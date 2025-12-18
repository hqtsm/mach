import { type Class, toStringTag } from '@hqtsm/class';
import { pointer, type Ptr } from '@hqtsm/struct';
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
	private mIdentifier: ArrayBufferLike = new ArrayBuffer(0);

	/**
	 * Team ID.
	 */
	private mTeamID: ArrayBufferLike = new ArrayBuffer(0);

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
		this.mDigestLength = CodeDirectoryBuilder.getHash(this).digestLength();
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
	 * @param _this This.
	 * @param file File reader.
	 * @param pagesize Page size.
	 * @param offset Offset in file.
	 * @param length Length in file.
	 */
	public static executable(
		_this: CodeDirectoryBuilder,
		file: Reader,
		pagesize: number,
		offset: number,
		length: number,
	): void {
		pagesize = (+pagesize || 0) - (pagesize % 1 || 0);
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		_this.mExec = file;
		_this.mPageSize = pagesize;
		_this.mExecOffset = offset;
		_this.mExecLength = length;
	}

	/**
	 * Reopen executable.
	 *
	 * @param _this This.
	 * @param file File reader.
	 * @param offset Offset in file.
	 * @param length Length in file.
	 */
	public static reopen(
		_this: CodeDirectoryBuilder,
		file: Reader,
		offset: number,
		length: number,
	): void {
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		if (!CodeDirectoryBuilder.opened(_this)) {
			throw new Error('Executable not open');
		}
		_this.mExec = file;
		_this.mExecOffset = offset;
		_this.mExecLength = length;
	}

	/**
	 * Is an executable open.
	 *
	 * @param _this This.
	 * @returns Is open.
	 */
	public static opened(_this: CodeDirectoryBuilder): boolean {
		return !!_this.mExec;
	}

	/**
	 * Set special slot.
	 *
	 * @param _this This.
	 * @param slot Slot index, 1 indexed.
	 * @param hash Hash data.
	 */
	public static async specialSlot(
		_this: CodeDirectoryBuilder,
		slot: number,
		data: ArrayBufferLike | ArrayBufferView,
	): Promise<void> {
		slot = specialSlot(slot);
		_this.mSpecial.set(
			slot,
			await CodeDirectoryBuilder.getHash(_this).digest(data),
		);
		if (slot > _this.mSpecialSlots) {
			_this.mSpecialSlots = slot;
		}
	}

	/**
	 * Get special slot.
	 *
	 * @param _this This.
	 * @param slot Slot index, 1 indexed.
	 * @returns Hash data, or null.
	 */
	private static getSpecialSlot(
		_this: CodeDirectoryBuilder,
		slot: number,
	): ArrayBuffer | null {
		slot = specialSlot(slot);
		return _this.mSpecial.get(slot) || null;
	}

	/**
	 * Set identifier.
	 *
	 * @param _this This.
	 * @param code Identifier.
	 */
	public static identifier(
		_this: CodeDirectoryBuilder,
		code: ArrayBufferLike | ArrayBufferView,
	): void {
		if ('buffer' in code) {
			const { buffer, byteOffset, byteLength } = code;
			_this.mIdentifier = buffer.slice(
				byteOffset,
				byteOffset + byteLength,
			);
		} else {
			_this.mIdentifier = code.slice(0);
		}
	}

	/**
	 * Set team ID.
	 *
	 * @param _this This.
	 * @param team Team ID.
	 */
	public static teamID(
		_this: CodeDirectoryBuilder,
		team: ArrayBufferLike | ArrayBufferView,
	): void {
		if ('buffer' in team) {
			const { buffer, byteOffset, byteLength } = team;
			_this.mTeamID = buffer.slice(
				byteOffset,
				byteOffset + byteLength,
			);
		} else {
			_this.mTeamID = team.slice(0);
		}
	}

	/**
	 * Set flags.
	 *
	 * @param _this This.
	 * @param flags Flags.
	 */
	public static flags(_this: CodeDirectoryBuilder, flags: number): void {
		_this.mFlags = flags;
	}

	/**
	 * Set platform.
	 *
	 * @param _this This.
	 * @param platform Platform.
	 */
	public static platform(
		_this: CodeDirectoryBuilder,
		platform: number,
	): void {
		_this.mPlatform = platform;
	}

	/**
	 * Create a scatter vector with count slots, plus sentinel.
	 *
	 * @param _this This.
	 * @param count Number of slots, excluding sentinel.
	 * @returns Scatter vector.
	 */
	public static scatter(
		_this: CodeDirectoryBuilder,
		count: number,
	): Ptr<CodeDirectoryScatter>;

	/**
	 * Get existing scatter vector.
	 *
	 * @param _this This.
	 * @returns Scatter vector.
	 */
	public static scatter(
		_this: CodeDirectoryBuilder,
	): Ptr<CodeDirectoryScatter> | null;

	/**
	 * Get or create scatter vector.
	 *
	 * @param _this This.
	 * @param count Number to create or undefined to get existing.
	 * @returns Scatter vector or null.
	 */
	public static scatter(
		_this: CodeDirectoryBuilder,
		count?: number,
	): Ptr<CodeDirectoryScatter> | null {
		if (count !== undefined) {
			count = (+count || 0) - (count % 1 || 0);
			const { BYTE_LENGTH } = CodeDirectoryScatter;
			const total = _this.mScatterSize = (count + 1) * BYTE_LENGTH;
			return _this.mScatter = new (pointer(CodeDirectoryScatter))(
				new ArrayBuffer(total),
			);
		}
		return _this.mScatter;
	}

	/**
	 * Set exec segment.
	 *
	 * @param _this This.
	 * @param base Base offset.
	 * @param limit Limit.
	 * @param flags Flags.
	 */
	public static execSeg(
		_this: CodeDirectoryBuilder,
		base: bigint,
		limit: bigint,
		flags: bigint,
	): void {
		_this.mExecSegOffset = base;
		_this.mExecSegLimit = limit;
		_this.mExecSegFlags = flags;
	}

	/**
	 * Add exec segment flags.
	 *
	 * @param _this This.
	 * @param flags Flags.
	 */
	public static addExecSegFlags(
		_this: CodeDirectoryBuilder,
		flags: bigint,
	): void {
		_this.mExecSegFlags |= flags;
	}

	/**
	 * Set generate pre-encrypt hashes.
	 *
	 * @param _this This.
	 * @param pre Generate pre-encrypt hashes.
	 */
	public static generatePreEncryptHashes(
		_this: CodeDirectoryBuilder,
		pre: boolean,
	): void {
		_this.mGeneratePreEncryptHashes = pre;
	}

	/**
	 * Set the runtime version.
	 *
	 * @param _this This.
	 * @param runtime Runtime version.
	 */
	public static runTimeVersion(
		_this: CodeDirectoryBuilder,
		runtime: number,
	): void {
		_this.mRuntimeVersion = runtime;
	}

	/**
	 * Caculate size for CodeDirectory currently described.
	 *
	 * @param _this This.
	 * @param version Compatibility version or null for minimum.
	 * @returns Byte size.
	 */
	public static size(
		_this: CodeDirectoryBuilder,
		version: number | null = null,
	): number {
		version ??= CodeDirectoryBuilder.minVersion(_this);
		const {
			mIdentifier,
			mTeamID,
			mCodeSlots,
			mSpecialSlots,
			mDigestLength,
			mGeneratePreEncryptHashes,
		} = _this;
		let size = CodeDirectoryBuilder.fixedSize(_this, version);
		if (!(version < CodeDirectory.supportsScatter)) {
			size += _this.mScatterSize;
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
	 * @param _this This.
	 * @param version Compatibility version or null for minimum.
	 * @returns CodeDirectory instance.
	 */
	public static async build(
		_this: CodeDirectoryBuilder,
		version: number | null = null,
	): Promise<CodeDirectory> {
		version ??= CodeDirectoryBuilder.minVersion(_this);
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
		} = _this;
		if (!mExec) {
			throw new Error('Executable not open');
		}
		const size = CodeDirectoryBuilder.size(_this, version);
		const buffer = new ArrayBuffer(size);
		const data = new Uint8Array(buffer);
		const dir = new CodeDirectory(buffer);
		CodeDirectory.initializeLength(dir, size);
		dir.version = version;
		dir.flags = _this.mFlags;
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
		dir.hashType = _this.mHashType;
		dir.platform = _this.mPlatform;
		dir.hashSize = mDigestLength;
		dir.pageSize = mPageSize ? Math.log2(mPageSize) : 0;
		if (!(version < CodeDirectory.supportsExecSegment)) {
			dir.execSegBase = _this.mExecSegOffset;
			dir.execSegLimit = _this.mExecSegLimit;
			dir.execSegFlags = _this.mExecSegFlags;
		}
		if (!(version < CodeDirectory.supportsPreEncrypt)) {
			dir.runtime = _this.mRuntimeVersion;
		}
		let offset = CodeDirectoryBuilder.fixedSize(_this, version);
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
			const hash = CodeDirectoryBuilder.getSpecialSlot(_this, i);
			if (hash) {
				const slot = CodeDirectory.getSlotMutable(dir, -i, false)!;
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
			const hasher = CodeDirectoryBuilder.getHash(_this);
			// deno-lint-ignore no-await-in-loop
			const hash = await generateHash(hasher, mExec, position, thisPage);
			const data = new Uint8Array(hash);
			const slot = CodeDirectory.getSlotMutable(dir, i, false)!;
			new Uint8Array(slot.buffer, slot.byteOffset).set(data);
			if (gpec) {
				const slot = CodeDirectory.getSlotMutable(dir, i, true)!;
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
	 * @param _this This.
	 * @returns Hash type.
	 */
	public static hashType(_this: CodeDirectoryBuilder): number {
		return _this.mHashType;
	}

	/**
	 * Get fixed size for compatibility version.
	 *
	 * @param __this This.
	 * @param version Compatibility version.
	 * @returns Byte size.
	 */
	public static fixedSize(
		__this: CodeDirectoryBuilder,
		version: number,
	): number {
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
	 * @param _this This.
	 * @returns Hash instance.
	 */
	public static getHash(_this: CodeDirectoryBuilder): DynamicHash {
		const hash = CodeDirectory.hashFor(_this.mHashType);
		hash.crypto = _this.crypto;
		return hash;
	}

	/**
	 * Minimum compatibility version of described CodeDirectory.
	 *
	 * @param _this This.
	 * @returns Minimum version.
	 */
	public static minVersion(_this: CodeDirectoryBuilder): number {
		if (_this.mGeneratePreEncryptHashes || _this.mRuntimeVersion) {
			return CodeDirectory.supportsPreEncrypt;
		}
		if (_this.mExecSegLimit > 0) {
			return CodeDirectory.supportsExecSegment;
		}
		if (_this.mExecLength > UINT32_MAX) {
			return CodeDirectory.supportsCodeLimit64;
		}
		if (_this.mTeamID.byteLength) {
			return CodeDirectory.supportsTeamID;
		}
		if (_this.mScatterSize) {
			return CodeDirectory.supportsScatter;
		}
		return CodeDirectory.earliestVersion;
	}

	static {
		toStringTag(this, 'CodeDirectoryBuilder');
	}
}
