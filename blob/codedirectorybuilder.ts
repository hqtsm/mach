import type { Class } from '@hqtsm/class';
import {
	type ArrayBufferReal,
	type BufferView,
	pointer,
	type Ptr,
} from '@hqtsm/struct';
import { UINT32_MAX } from '../const.ts';
import type { DynamicHash, HashCrypto } from '../hash/dynamichash.ts';
import type { Reader } from '../util/reader.ts';
import { CodeDirectory } from './codedirectory.ts';
import { CodeDirectoryScatter } from './codedirectoryscatter.ts';

function specialSlot(slot: number): number {
	slot = (+slot || 0) - (slot % 1 || 0);
	if (slot < 1) {
		throw new RangeError(`Invalid slot index: ${slot}`);
	}
	return slot;
}

async function generateHash(
	hasher: DynamicHash,
	reader: Reader,
	offset: number,
	length: number,
): Promise<ArrayBuffer> {
	return await hasher.digest(reader.slice(offset, offset + length));
}

/**
 * Builder for building CodeDirectories from pieces.
 */
export class CodeDirectoryBuilder {
	declare public readonly ['constructor']: Class<typeof CodeDirectoryBuilder>;

	/**
	 * Hash crypto.
	 */
	public crypto: HashCrypto | null = null;

	/**
	 * Special slots.
	 */
	private readonly mSpecial = new Map<number, ArrayBuffer>();

	/**
	 * Executable file.
	 */
	private mExec: Reader | null = null;

	/**
	 * Starting offset inside mExec.
	 */
	private mExecOffset = 0;

	/**
	 * Total bytes to sign.
	 */
	private mExecLength = 0;

	/**
	 * Page size, must be a power of 2, or zero for infinite.
	 */
	private mPageSize = 0;

	/**
	 * Flags.
	 */
	private mFlags = 0;

	/**
	 * Hash algorithm.
	 */
	private readonly mHashType: number;

	/**
	 * Platform.
	 */
	private mPlatform = 0;

	/**
	 * Hash digest length.
	 */
	private readonly mDigestLength: number;

	/**
	 * Identifier.
	 */
	private mIdentifier: ArrayBufferReal = new ArrayBuffer(0);

	/**
	 * Team ID.
	 */
	private mTeamID: ArrayBufferReal = new ArrayBuffer(0);

	/**
	 * Highest special slot index.
	 */
	private mSpecialSlots = 0;

	/**
	 * Scatter vector.
	 */
	private mScatter: Ptr<CodeDirectoryScatter> | null = null;

	/**
	 * Scatter vector byte size, include sentinel.
	 */
	private mScatterSize = 0;

	/**
	 * Exec segment offset.
	 */
	private mExecSegOffset = 0n;

	/**
	 * Exec segment limit.
	 */
	private mExecSegLimit = 0n;

	/**
	 * Exec segment flags.
	 */
	private mExecSegFlags = 0n;

	/**
	 * Generate pre-encrypt hashes.
	 */
	private mGeneratePreEncryptHashes = false;

	/**
	 * Runtime version.
	 */
	private mRuntimeVersion = 0;

	/**
	 * CodeDirectoryBuilder constructor.
	 *
	 * @param digestAlgorithm Hash algorithm (kSecCodeSignatureHash* constants).
	 */
	constructor(digestAlgorithm: number) {
		this.mHashType = digestAlgorithm;
		this.mDigestLength = this.getHash().digestLength();
	}

	/**
	 * Number of code slots.
	 * Based on execLength and pageSize.
	 */
	private get mCodeSlots(): number {
		const { mExecLength } = this;
		if (mExecLength <= 0) {
			return 0;
		}
		const { mPageSize } = this;
		if (mPageSize === 0) {
			return 1;
		}
		const o = mExecLength % mPageSize;
		return o ? (mExecLength - o) / mPageSize + 1 : mExecLength / mPageSize;
	}

	/**
	 * Open executable.
	 *
	 * @param file File reader.
	 * @param pagesize Page size.
	 * @param offset Offset in file.
	 * @param length Length in file.
	 */
	public executable(
		file: Reader,
		pagesize: number,
		offset: number,
		length: number,
	): void {
		pagesize = (+pagesize || 0) - (pagesize % 1 || 0);
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		this.mExec = file;
		this.mPageSize = pagesize;
		this.mExecOffset = offset;
		this.mExecLength = length;
	}

	/**
	 * Reopen executable.
	 *
	 * @param file File reader.
	 * @param offset Offset in file.
	 * @param length Length in file.
	 */
	public reopen(file: Reader, offset: number, length: number): void {
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		if (!this.opened()) {
			throw new Error('Executable not open');
		}
		this.mExec = file;
		this.mExecOffset = offset;
		this.mExecLength = length;
	}

	/**
	 * Is an executable open.
	 *
	 * @returns Is open.
	 */
	public opened(): boolean {
		return !!this.mExec;
	}

	/**
	 * Set special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @param hash Hash data.
	 */
	public async specialSlot(
		slot: number,
		data: ArrayBufferReal | BufferView,
	): Promise<void> {
		slot = specialSlot(slot);
		this.mSpecial.set(slot, await this.getHash().digest(data));
		if (slot > this.mSpecialSlots) {
			this.mSpecialSlots = slot;
		}
	}

	/**
	 * Get special slot.
	 *
	 * @param slot Slot index, 1 indexed.
	 * @returns Hash data, or null.
	 */
	private getSpecialSlot(slot: number): ArrayBuffer | null {
		slot = specialSlot(slot);
		return this.mSpecial.get(slot) || null;
	}

	/**
	 * Set identifier.
	 *
	 * @param code Identifier.
	 */
	public identifier(code: ArrayBufferReal | BufferView): void {
		if ('buffer' in code) {
			const { buffer, byteOffset, byteLength } = code;
			this.mIdentifier = buffer.slice(
				byteOffset,
				byteOffset + byteLength,
			);
		} else {
			this.mIdentifier = code.slice(0);
		}
	}

	/**
	 * Set team ID.
	 *
	 * @param team Team ID.
	 */
	public teamID(team: ArrayBufferReal | BufferView): void {
		if ('buffer' in team) {
			const { buffer, byteOffset, byteLength } = team;
			this.mTeamID = buffer.slice(
				byteOffset,
				byteOffset + byteLength,
			);
		} else {
			this.mTeamID = team.slice(0);
		}
	}

	/**
	 * Set flags.
	 *
	 * @param flags Flags.
	 */
	public flags(flags: number): void {
		this.mFlags = flags;
	}

	/**
	 * Set platform.
	 *
	 * @param platform Platform.
	 */
	public platform(platform: number): void {
		this.mPlatform = platform;
	}

	/**
	 * Create a scatter vector with count slots, plus sentinel.
	 *
	 * @param count Number of slots, excluding sentinel.
	 * @returns Scatter vector.
	 */
	public scatter(count: number): Ptr<CodeDirectoryScatter>;

	/**
	 * Get existing scatter vector.
	 *
	 * @returns Scatter vector.
	 */
	public scatter(): Ptr<CodeDirectoryScatter> | null;

	/**
	 * Get or create scatter vector.
	 *
	 * @param count Number to create or undefined to get existing.
	 * @returns Scatter vector or null.
	 */
	public scatter(count?: number): Ptr<CodeDirectoryScatter> | null {
		if (count !== undefined) {
			count = (+count || 0) - (count % 1 || 0);
			const { BYTE_LENGTH } = CodeDirectoryScatter;
			const total = this.mScatterSize = (count + 1) * BYTE_LENGTH;
			return this.mScatter = new (pointer(CodeDirectoryScatter))(
				new ArrayBuffer(total),
			);
		}
		return this.mScatter;
	}

	/**
	 * Set exec segment.
	 *
	 * @param base Base offset.
	 * @param limit Limit.
	 * @param flags Flags.
	 */
	public execSeg(base: bigint, limit: bigint, flags: bigint): void {
		this.mExecSegOffset = base;
		this.mExecSegLimit = limit;
		this.mExecSegFlags = flags;
	}

	/**
	 * Add exec segment flags.
	 *
	 * @param flags Flags.
	 */
	public addExecSegFlags(flags: bigint): void {
		this.mExecSegFlags |= flags;
	}

	/**
	 * Set generate pre-encrypt hashes.
	 *
	 * @param pre Generate pre-encrypt hashes.
	 */
	public generatePreEncryptHashes(pre: boolean): void {
		this.mGeneratePreEncryptHashes = pre;
	}

	/**
	 * Set the runtime version.
	 *
	 * @param runtime Runtime version.
	 */
	public runTimeVersion(runtime: number): void {
		this.mRuntimeVersion = runtime;
	}

	/**
	 * Caculate size for CodeDirectory currently described.
	 *
	 * @param version Compatibility version or null for minimum.
	 * @returns Byte size.
	 */
	public size(version: number | null = null): number {
		version ??= this.minVersion();
		const {
			mIdentifier,
			mTeamID,
			mCodeSlots,
			mSpecialSlots,
			mDigestLength,
			mGeneratePreEncryptHashes,
		} = this;
		let size = this.fixedSize(version);
		if (!(version < CodeDirectory.supportsScatter)) {
			size += this.mScatterSize;
		}
		size += mIdentifier.byteLength + 1;
		if (!(version < CodeDirectory.supportsTeamID) && mTeamID.byteLength) {
			size += mTeamID.byteLength + 1;
		}
		size += (mCodeSlots + mSpecialSlots) * mDigestLength;
		if (
			!(version < CodeDirectory.supportsPreEncrypt) &&
			mGeneratePreEncryptHashes
		) {
			size += mCodeSlots * mDigestLength;
		}
		return size;
	}

	/**
	 * Build CodeDirectory.
	 *
	 * @param version Compatibility version or null for minimum.
	 * @returns CodeDirectory instance.
	 */
	public async build(version: number | null = null): Promise<CodeDirectory> {
		version ??= this.minVersion();
		const {
			mExec,
			mExecOffset,
			mExecLength,
			mPageSize,
			mSpecialSlots,
			mCodeSlots,
			mDigestLength,
			mScatter,
			mScatterSize,
			mIdentifier,
			mTeamID,
			mGeneratePreEncryptHashes,
		} = this;
		if (!mExec) {
			throw new Error('Executable not open');
		}
		const size = this.size(version);
		const buffer = new ArrayBuffer(size);
		const data = new Uint8Array(buffer);
		const dir = new CodeDirectory(buffer);
		dir.initializeLength(size);
		dir.version = version;
		dir.flags = this.mFlags;
		dir.nSpecialSlots = mSpecialSlots;
		dir.nCodeSlots = mCodeSlots;
		if (
			mExecLength > UINT32_MAX &&
			!(version < CodeDirectory.supportsCodeLimit64)
		) {
			dir.codeLimit = UINT32_MAX;
			dir.codeLimit64 = BigInt(mExecLength);
		} else {
			dir.codeLimit = mExecLength;
		}
		dir.hashType = this.mHashType;
		dir.platform = this.mPlatform;
		dir.hashSize = mDigestLength;
		dir.pageSize = mPageSize ? Math.log2(mPageSize) : 0;
		if (!(version < CodeDirectory.supportsExecSegment)) {
			dir.execSegBase = this.mExecSegOffset;
			dir.execSegLimit = this.mExecSegLimit;
			dir.execSegFlags = this.mExecSegFlags;
		}
		if (!(version < CodeDirectory.supportsPreEncrypt)) {
			dir.runtime = this.mRuntimeVersion;
		}
		let offset = this.fixedSize(version);
		if (mScatter && !(version < CodeDirectory.supportsScatter)) {
			dir.scatterOffset = offset;
			data.set(
				new Uint8Array(
					mScatter.buffer,
					mScatter.byteOffset,
					mScatterSize,
				),
				offset,
			);
			offset += mScatterSize;
		}
		dir.identOffset = offset;
		data.set(new Uint8Array(mIdentifier), offset);
		offset += mIdentifier.byteLength + 1;
		if (mTeamID.byteLength && !(version < CodeDirectory.supportsTeamID)) {
			dir.teamIDOffset = offset;
			data.set(new Uint8Array(mTeamID), offset);
			offset += mTeamID.byteLength + 1;
		}
		const spe = !(version < CodeDirectory.supportsPreEncrypt);
		const gpec = spe && mGeneratePreEncryptHashes;
		if (gpec) {
			dir.preEncryptOffset = offset;
			offset += mCodeSlots * mDigestLength;
		}
		dir.hashOffset = offset + mSpecialSlots * mDigestLength;
		for (let i = 1; i <= mSpecialSlots; i++) {
			const hash = this.getSpecialSlot(i);
			if (hash) {
				const slot = dir.getSlotMutable(-i, false)!;
				new Uint8Array(slot.buffer, slot.byteOffset).set(
					new Uint8Array(hash),
				);
			}
		}
		let position = mExecOffset;
		let remaining = mExecLength;
		for (let i = 0; i < mCodeSlots; i++) {
			let thisPage = remaining;
			if (mPageSize && thisPage > mPageSize) {
				thisPage = mPageSize;
			}
			const hasher = this.getHash();
			// deno-lint-ignore no-await-in-loop
			const hash = await generateHash(hasher, mExec, position, thisPage);
			const data = new Uint8Array(hash);
			const slot = dir.getSlotMutable(i, false)!;
			new Uint8Array(slot.buffer, slot.byteOffset).set(data);
			if (gpec) {
				const slot = dir.getSlotMutable(i, true)!;
				new Uint8Array(slot.buffer, slot.byteOffset).set(data);
			}
			position += thisPage;
			remaining -= thisPage;
		}
		return dir;
	}

	/**
	 * Hash type.
	 *
	 * @returns Hash type.
	 */
	public hashType(): number {
		return this.mHashType;
	}

	/**
	 * Get fixed size for compatibility version.
	 *
	 * @param version Compatibility version.
	 * @returns Byte size.
	 */
	public fixedSize(version: number): number {
		let size = CodeDirectory.BYTE_LENGTH;
		if (version < CodeDirectory.supportsPreEncrypt) {
			size -= 8;
		}
		if (version < CodeDirectory.supportsExecSegment) {
			size -= 24;
		}
		if (version < CodeDirectory.supportsCodeLimit64) {
			size -= 12;
		}
		if (version < CodeDirectory.supportsTeamID) {
			size -= 4;
		}
		if (version < CodeDirectory.supportsScatter) {
			size -= 4;
		}
		return size;
	}

	/**
	 * Get hash creation instance.
	 *
	 * @returns Hash instance.
	 */
	public getHash(): DynamicHash {
		const hash = CodeDirectory.hashFor(this.mHashType);
		hash.crypto = this.crypto;
		return hash;
	}

	/**
	 * Minimum compatibility version of described CodeDirectory.
	 */
	public minVersion(): number {
		if (this.mGeneratePreEncryptHashes || this.mRuntimeVersion) {
			return CodeDirectory.supportsPreEncrypt;
		}
		if (this.mExecSegLimit > 0) {
			return CodeDirectory.supportsExecSegment;
		}
		if (this.mExecLength > UINT32_MAX) {
			return CodeDirectory.supportsCodeLimit64;
		}
		if (this.mTeamID.byteLength) {
			return CodeDirectory.supportsTeamID;
		}
		if (this.mScatterSize) {
			return CodeDirectory.supportsScatter;
		}
		return CodeDirectory.earliestVersion;
	}
}
