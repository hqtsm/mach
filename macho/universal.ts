import { pointer, type Ptr } from '@hqtsm/struct';
import {
	FAT_CIGAM,
	FAT_MAGIC,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
	PAGE_SIZE,
} from '../const.ts';
import { FatHeader } from '../mach/fatheader.ts';
import { MachHeader } from '../mach/machheader.ts';
import type { Reader } from '../util/reader.ts';
import { Architecture } from './architecture.ts';
import { FatArch } from '../mach/fatarch.ts';
import { CPU_ARCH_ABI64 } from '../const.ts';
import { CPU_TYPE_ARM } from '../const.ts';

/**
 * Maximum power of 2 alignment amount.
 */
const MAX_ALIGN = 30;

/**
 * A universal binary over a readable.
 * Works for fat binaries and also thin binaries.
 */
export class Universal {
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
	 * Open binary.
	 *
	 * @param reader Reader.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection, requires offset.
	 */
	public async open(reader: Reader, offset = 0, length = 0): Promise<void> {
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
		const mSizes = this.mSizes = new Map();

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
							`Two architectures have the same offset: ${offset}`,
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
						const gapBytes = new Uint8Array(got);
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
	}
}
