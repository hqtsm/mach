import { type Class, toStringTag } from '@hqtsm/class';
import { pointer, type Ptr } from '@hqtsm/struct';
import {
	CPU_ARCH_ABI64,
	CPU_SUBTYPE_MASK,
	CPU_TYPE_ARM,
	FAT_CIGAM,
	FAT_MAGIC,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
	PAGE_SIZE,
} from '../const.ts';
import { FatArch } from '../mach/fatarch.ts';
import { FatHeader } from '../mach/fatheader.ts';
import { MachHeader } from '../mach/machheader.ts';
import type { Reader } from '../util/reader.ts';
import { Architecture } from './architecture.ts';
import { MachO } from './macho.ts';

/**
 * Maximum power of 2 alignment amount.
 */
const MAX_ALIGN = 30;

/**
 * A universal binary over a readable.
 * Works for fat binaries and also thin binaries.
 */
export class Universal {
	declare public readonly ['constructor']: Class<typeof Universal>;

	/**
	 * Binary reader.
	 */
	private mReader: Reader | null = null;

	/**
	 * Architecture list, if fat.
	 */
	private mArchList: Ptr<FatArch> | null = null;

	/**
	 * Architecture count, if fat.
	 */
	private mArchCount = 0;

	/**
	 * Single architecture, if thin.
	 */
	private mThinArch: Architecture | null = null;

	/**
	 * Offset in reader.
	 */
	private mBase = 0;

	/**
	 * Length in reader, if thin.
	 */
	private mLength = 0;

	/**
	 * Length of slice at each offset.
	 */
	private mSizes: Map<number, number> = new Map();

	/**
	 * Mach type.
	 */
	private mMachType = 0;

	/**
	 * Suspicious flag.
	 */
	private mSuspicious = false;

	/**
	 * Create uninitialized Universal instance.
	 */
	protected constructor() {}

	/**
	 * Initialize instance.
	 *
	 * @param reader Reader.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection.
	 * @returns This instance.
	 */
	protected async Universal(
		reader: Reader,
		offset = 0,
		length = 0,
	): Promise<this> {
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		this.mReader = reader;
		this.mBase = offset;
		this.mLength = length;
		this.mMachType = 0;
		let mSuspicious = this.mSuspicious = false;
		this.mArchList = null;
		this.mArchCount = 0;
		this.mThinArch = null;
		const mSizes = this.mSizes;
		mSizes.clear();

		const hs = Math.max(FatHeader.BYTE_LENGTH, MachHeader.BYTE_LENGTH);
		const hd = await reader.slice(offset, offset + hs).arrayBuffer();
		if (hd.byteLength !== hs) {
			throw new RangeError('Invalid header');
		}

		let header = new FatHeader(hd);
		let mHeader;
		const m = header.magic;
		switch (m) {
			case FAT_CIGAM:
				header = new FatHeader(hd, 0, !header.littleEndian);
				// Falls through.
			case FAT_MAGIC: {
				// In some cases the fat header may be 1 less than needed.
				// Something about "15001604" whatever that is.
				let mArchCount = this.mArchCount = header.nfatArch;

				// Read enough for 1 extra arch.
				const archSize = FatArch.BYTE_LENGTH * (mArchCount + 1);
				const archOffset = offset + header.byteLength;
				const archData = await reader
					.slice(archOffset, archOffset + archSize)
					.arrayBuffer();
				if (archData.byteLength !== archSize) {
					throw new RangeError('Invalid architectures');
				}
				const mArchList = this.mArchList = new (pointer(FatArch))(
					archData,
					0,
					header.littleEndian,
				);

				// Detect possibly undercounted architecture.
				const lastArch = mArchList[mArchCount];
				if (lastArch.cputype === (CPU_ARCH_ABI64 | CPU_TYPE_ARM)) {
					this.mArchCount = mArchCount = ++mArchCount;
				}

				// Padding between header and slices should all be zeroed out.
				const sortedList = [];
				for (let i = 0; i < mArchCount; i++) {
					sortedList.push(mArchList[i]);
				}
				sortedList.sort((a, b) => a.offset - b.offset);

				const universalHeaderEnd = offset + header.byteLength +
					(FatArch.BYTE_LENGTH * mArchCount);
				let prevHeaderEnd = universalHeaderEnd;
				let prevArchSize = 0;
				let prevArchStart = 0;

				for (const { offset, size, align } of sortedList) {
					if (mSizes.has(offset)) {
						throw new RangeError(
							`Multiple architectures at offset: 0x${
								offset.toString(16)
							}`,
						);
					}
					mSizes.set(offset, size);

					const gapSize = offset - prevHeaderEnd;
					if (
						prevHeaderEnd !== universalHeaderEnd &&
						(align > MAX_ALIGN || gapSize >= (1 << align))
					) {
						this.mSuspicious = mSuspicious = true;
						break;
					}

					let off = 0;
					GAPS: while (off < gapSize) {
						const want = Math.min(gapSize - off, PAGE_SIZE);
						const readOffset = prevHeaderEnd + off;
						// deno-lint-ignore no-await-in-loop
						const read = await reader
							.slice(readOffset, readOffset + want)
							.arrayBuffer();
						const got = read.byteLength;
						if (!got) {
							this.mSuspicious = mSuspicious = true;
							break;
						}
						off += got;
						const gapBytes = new Uint8Array(read);
						for (let x = 0; x < got; x++) {
							if (gapBytes[x]) {
								this.mSuspicious = mSuspicious = true;
								break GAPS;
							}
						}
					}
					if (off !== gapSize) {
						this.mSuspicious = mSuspicious = true;
					}
					if (mSuspicious) {
						break;
					}

					prevHeaderEnd = offset + size;
					prevArchSize = size;
					prevArchStart = offset;
				}

				if (
					!mSuspicious &&
					(prevArchStart + prevArchSize !== reader.size)
				) {
					this.mSuspicious = true;
				}
				break;
			}
			case MH_CIGAM:
			case MH_CIGAM_64:
				mHeader = new MachHeader(hd, 0, !header.littleEndian);
				// Falls through.
			case MH_MAGIC:
			case MH_MAGIC_64: {
				mHeader ??= new MachHeader(hd);
				this.mThinArch = new Architecture(
					mHeader.cputype,
					mHeader.cpusubtype,
				);
				break;
			}
			default: {
				throw new RangeError(`Unknown magic: 0x${m.toString(16)}`);
			}
		}
		return this;
	}

	/**
	 * Get Mach-O for architecture.
	 *
	 * @param arch Architecture to get.
	 * @returns Mach-O.
	 */
	public async architecture(arch: Architecture): Promise<MachO>;

	/**
	 * Get Mach-O for offset.
	 *
	 * @param arch Offset of binary.
	 * @returns Mach-O.
	 */
	public async architecture(offset: number): Promise<MachO>;

	/**
	 * Get Mach-O for architecture or offset.
	 *
	 * @param a Architecture or offset.
	 * @returns Mach-O.
	 */
	public async architecture(a: Architecture | number): Promise<MachO> {
		if (typeof a === 'number') {
			if (Universal.prototype.isUniversal.call(this)) {
				const length = Universal.prototype.lengthOfSlice.call(this, a);
				return Universal.prototype.make.call(
					this,
					await MachO.MachO(this.mReader!, a, length),
				);
			}
			if (a === this.mBase) {
				return MachO.MachO(this.mReader!);
			}
		} else {
			if (Universal.prototype.isUniversal.call(this)) {
				return Universal.prototype.findImage.call(this, a);
			}
			if (Architecture.matches(a, this.mThinArch!)) {
				return MachO.MachO(this.mReader!, this.mBase, this.mLength);
			}
		}
		throw new RangeError('Architecture not found');
	}

	/**
	 * Get offset or architecture.
	 *
	 * @param arch Architecture to get the offset of.
	 * @returns Architecture offset.
	 */
	public archOffset(arch: Architecture): number {
		if (Universal.prototype.isUniversal.call(this)) {
			return this.mBase +
				Universal.prototype.findArch.call(this, arch).offset;
		}
		if (Architecture.matches(this.mThinArch!, arch)) {
			return 0;
		}
		throw new RangeError('Architecture not found');
	}

	/**
	 * Get length of architecture.
	 *
	 * @param arch Architecture to get the length of.
	 * @returns Architecture length.
	 */
	public archLength(arch: Architecture): number {
		if (Universal.prototype.isUniversal.call(this)) {
			return this.mBase + this.findArch(arch).size;
		}
		if (Architecture.matches(this.mThinArch!, arch)) {
			return this.mReader!.size;
		}
		throw new RangeError('Architecture not found');
	}

	/**
	 * Is part of a FAT file.
	 *
	 * @returns Narrowed range or not.
	 */
	public narrowed(): boolean {
		return !!this.mBase;
	}

	/**
	 * Get set of architectures.
	 *
	 * @param archs Set of architectures to populate into.
	 */
	public architectures(archs: Set<Architecture>): void {
		const skip = new Set<string>();
		for (const a of archs) {
			skip.add(`${a.first}:${a.second}`);
		}
		if (Universal.prototype.isUniversal.call(this)) {
			const mArchList = this.mArchList!;
			for (let i = 0; i < this.mArchCount; i++) {
				const { cputype, cpusubtype } = mArchList[i];
				if (!skip.has(`${cputype}:${cpusubtype}`)) {
					archs.add(new Architecture(cputype, cpusubtype));
				}
			}
		} else {
			const { first, second } = this.mThinArch!;
			if (!skip.has(`${first}:${second}`)) {
				archs.add(new Architecture(first, second));
			}
		}
	}

	/**
	 * Is a universal binary.
	 *
	 * @returns True if universal, even if only 1 architecture.
	 */
	public isUniversal(): boolean {
		return !!this.mArchList;
	}

	/**
	 * Get length of slice at offset.
	 *
	 * @param offset Slice offset.
	 * @returns Slice length.
	 */
	public lengthOfSlice(offset: number): number {
		const value = this.mSizes.get(offset);
		if (value === undefined) {
			throw new RangeError('Offset not found');
		}
		return value;
	}

	/**
	 * Get offset in reader.
	 *
	 * @returns Byte offset in reader.
	 */
	public offset(): number {
		return this.mBase;
	}

	/**
	 * Get length in reader.
	 *
	 * @returns Byte length in reader.
	 */
	public length(): number {
		return this.mLength;
	}

	/**
	 * Check if FAT binary is suspicious.
	 *
	 * @returns Is suspicious.
	 */
	public isSuspicious(): boolean {
		return this.mSuspicious;
	}

	/**
	 * Find matching architecture in FAT file architecture list.
	 *
	 * @param arch Architecture to find.
	 * @returns Matching FAT architecture.
	 */
	private findArch(arch: Architecture): FatArch {
		const { mArchList, mArchCount } = this;
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Architecture.cpuType(arch) &&
				a.cpusubtype === Architecture.cpuSubtypeFull(arch)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Architecture.cpuType(arch) &&
				(a.cpusubtype & ~CPU_SUBTYPE_MASK) ===
					Architecture.cpuSubtype(arch)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Architecture.cpuType(arch) &&
				!(a.cpusubtype & ~CPU_SUBTYPE_MASK)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (a.cputype === Architecture.cpuType(arch)) {
				return a;
			}
		}
		throw new RangeError('Architecture not found');
	}

	/**
	 * Find Mach-O image for architecture.
	 *
	 * @param target Architecture.
	 * @returns Mach-O image.
	 */
	private async findImage(target: Architecture): Promise<MachO> {
		const arch = Universal.prototype.findArch.call(this, target);
		return this.make(
			await MachO.MachO(
				this.mReader!,
				this.mBase + arch.offset,
				arch.size,
			),
		);
	}

	/**
	 * Validate type of Mach-O.
	 *
	 * @param macho Mach-O instance.
	 * @returns Mach-O instance.
	 */
	private make(macho: MachO): MachO {
		const type = macho.type();
		if (!type) {
			throw new RangeError('Unknown type');
		}
		const { mMachType } = this;
		if (mMachType && mMachType !== type) {
			throw new RangeError('Mismatched type');
		}
		this.mMachType = type;
		return macho;
	}

	/**
	 * Guess type of file.
	 *
	 * @param reader Reader object.
	 * @returns Zero if not a valid Mach-O or Universal.
	 */
	public static async typeOf(reader: Reader): Promise<number> {
		let data = await reader.slice(0, MachHeader.BYTE_LENGTH).arrayBuffer();
		if (data.byteLength !== MachHeader.BYTE_LENGTH) {
			return 0;
		}
		let header = new MachHeader(data);
		let arch1;
		for (let tries = 3; tries--;) {
			switch (header.magic) {
				case MH_CIGAM:
				case MH_CIGAM_64:
					header = new MachHeader(data, 0, !header.littleEndian);
					// Falls through.
				case MH_MAGIC:
				case MH_MAGIC_64: {
					return header.filetype;
				}
				case FAT_CIGAM:
					arch1 = new FatArch(
						data,
						FatHeader.BYTE_LENGTH,
						!header.littleEndian,
					);
					// Falls through.
				case FAT_MAGIC: {
					arch1 ??= new FatArch(data, FatHeader.BYTE_LENGTH);
					const { offset } = arch1;
					// deno-lint-ignore no-await-in-loop
					data = await reader
						.slice(offset, offset + header.byteLength)
						.arrayBuffer();
					if (data.byteLength !== header.byteLength) {
						return 0;
					}
					header = new MachHeader(data, 0, arch1.littleEndian);
					continue;
				}
				default: {
					return 0;
				}
			}
		}
		return 0;
	}

	/**
	 * A universal binary over a readable.
	 *
	 * @param reader Reader.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection.
	 * @returns Universal instance.
	 */
	public static async Universal(
		reader: Reader,
		offset = 0,
		length = 0,
	): Promise<Universal> {
		return await new Universal().Universal(reader, offset, length);
	}

	static {
		toStringTag(this, 'Universal');
	}
}
