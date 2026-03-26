import { toStringTag } from '@hqtsm/class';
import { pointer, type Ptr } from '@hqtsm/struct';
import type { bool, uint } from '../../libc/c.ts';
import { ENOMEM } from '../../libc/errno.ts';
import type { size_t } from '../../libc/stddef.ts';
import {
	UINT32_MAX,
	type uint32_t,
	type uint64_t,
	type uint8_t,
} from '../../libc/stdint.ts';
import { calloc } from '../../libc/stdlib.ts';
import type { SubtleCryptoDigest } from '../../util/crypto.ts';
import {
	type ArrayBufferLikeData,
	toUint8ArrayArrayBuffer,
} from '../../util/memory.ts';
import type { Reader } from '../../util/reader.ts';
import { errSecCSTooBig } from '../CSCommon.ts';
import { MacOSError, UnixError } from '../errors.ts';
import type { DynamicHash } from '../hashing.ts';
import {
	CodeDirectory,
	type CodeDirectoryHashAlgorithm,
	CodeDirectoryScatter,
	type CodeDirectorySpecialSlot,
} from './codedirectory.ts';

/**
 * Builder for building CodeDirectories from pieces.
 */
export class CodeDirectoryBuilder {
	/**
	 * CodeDirectoryBuilder constructor.
	 *
	 * @param digestAlgorithm Hash algorithm (kSecCodeSignatureHash* constants).
	 */
	constructor(digestAlgorithm: CodeDirectoryHashAlgorithm) {
		this.mHashType = digestAlgorithm;
		this.mDigestLength = CodeDirectoryBuilder.getHash(this).digestLength();
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
		pagesize: size_t,
		offset: size_t,
		length: size_t,
	): void {
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
		offset: size_t,
		length: size_t,
	): void {
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
	public static opened(_this: CodeDirectoryBuilder): bool {
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
		slot: CodeDirectorySpecialSlot,
		data: ArrayBufferLikeData,
	): Promise<void> {
		const hash = CodeDirectoryBuilder.getHash(_this);
		await hash.update(
			'buffer' in data
				? toUint8ArrayArrayBuffer(
					data.buffer,
					data.byteOffset,
					data.byteLength,
				)
				: toUint8ArrayArrayBuffer(data),
		);
		const digest = new ArrayBuffer(hash.digestLength());
		await hash.finish(digest);
		_this.mSpecial.set(slot, digest);
		if (slot > _this.mSpecialSlots) {
			_this.mSpecialSlots = slot;
		}
	}

	/**
	 * Set identifier.
	 *
	 * @param _this This.
	 * @param code Identifier.
	 */
	public static identifier(
		_this: CodeDirectoryBuilder,
		code: ArrayBufferLikeData,
	): void {
		if ('buffer' in code) {
			const { buffer, byteOffset, byteLength } = code;
			_this.mIdentifier = buffer.slice(
				byteOffset,
				byteOffset + byteLength,
			);
		} else {
			_this.mIdentifier = code.slice();
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
		team: ArrayBufferLikeData,
	): void {
		if ('buffer' in team) {
			const { buffer, byteOffset, byteLength } = team;
			_this.mTeamID = buffer.slice(
				byteOffset,
				byteOffset + byteLength,
			);
		} else {
			_this.mTeamID = team.slice();
		}
	}

	/**
	 * Set flags.
	 *
	 * @param _this This.
	 * @param flags Flags.
	 */
	public static flags(_this: CodeDirectoryBuilder, flags: uint32_t): void {
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
		platform: uint8_t,
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
		count?: uint,
	): Ptr<CodeDirectoryScatter> | null {
		if (count !== undefined) {
			const { BYTE_LENGTH } = CodeDirectoryScatter;
			const total = _this.mScatterSize = (count + 1) * BYTE_LENGTH;
			const s = calloc(total);
			if (!s) {
				UnixError.throwMe(ENOMEM);
			}
			return _this.mScatter = new (pointer(CodeDirectoryScatter))(s);
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
		base: uint64_t,
		limit: uint64_t,
		flags: uint64_t,
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
		flags: uint64_t,
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
		pre: bool,
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
		runtime: uint32_t,
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
		version: uint32_t | null = null,
	): size_t {
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
		version: uint32_t | null = null,
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
		if (mCodeSlots > UINT32_MAX) {
			MacOSError.throwMe(errSecCSTooBig);
		}

		const total = CodeDirectoryBuilder.size(_this, version);
		const buffer = calloc(total);
		if (!buffer) {
			UnixError.throwMe(ENOMEM);
		}
		const data = new Uint8Array(buffer);
		const dir = new CodeDirectory(buffer);

		CodeDirectory.initializeSize(dir, total);
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
		const gpeh = spe && mGeneratePreEncryptHashes;
		if (gpeh) {
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
		for (let slot = 0; slot < mCodeSlots; slot++) {
			let thisPage = remaining;
			if (mPageSize && thisPage > mPageSize) {
				thisPage = mPageSize;
			}
			const hasher = CodeDirectoryBuilder.getHash(_this);
			const data = new Uint8Array(hasher.digestLength());
			// deno-lint-ignore no-await-in-loop
			await CodeDirectory['generateHash'](
				hasher,
				mExec!.slice(position, position + thisPage),
				data,
			);
			const s = CodeDirectory.getSlotMutable(dir, slot, false)!;
			new Uint8Array(s.buffer, s.byteOffset).set(data);
			if (gpeh) {
				const s = CodeDirectory.getSlotMutable(dir, slot, true)!;
				new Uint8Array(s.buffer, s.byteOffset).set(data);
			}
			position += thisPage;
			remaining -= thisPage;
		}

		return dir;
	}

	/**
	 * Get fixed size for compatibility version.
	 *
	 * @param _this This.
	 * @param version Compatibility version.
	 * @returns Byte size.
	 */
	public static fixedSize(
		_this: CodeDirectoryBuilder,
		version: uint32_t,
	): size_t {
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
	 * Hash type.
	 *
	 * @param _this This.
	 * @returns Hash type.
	 */
	public static hashType(_this: CodeDirectoryBuilder): uint32_t {
		return _this.mHashType;
	}

	/**
	 * Get hash creation instance.
	 *
	 * @param _this This.
	 * @returns Hash instance.
	 */
	public static getHash(_this: CodeDirectoryBuilder): DynamicHash {
		const hash = CodeDirectory.hashFor(_this.mHashType);
		hash.subtle = _this.subtle;
		return hash;
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
		slot: CodeDirectorySpecialSlot,
	): ArrayBuffer | null {
		return _this.mSpecial.get(slot) || null;
	}

	/**
	 * Special slots.
	 */
	private readonly mSpecial = new Map<
		CodeDirectorySpecialSlot,
		ArrayBuffer
	>();

	/**
	 * Executable file.
	 */
	private mExec: Reader | null = null;

	/**
	 * Starting offset inside mExec.
	 */
	private mExecOffset: size_t = 0;

	/**
	 * Total bytes to sign.
	 */
	private mExecLength: size_t = 0;

	/**
	 * Page size, must be a power of 2, or zero for infinite.
	 */
	private mPageSize: size_t = 0;

	/**
	 * Flags.
	 */
	private mFlags: uint32_t = 0;

	/**
	 * Hash algorithm.
	 */
	private readonly mHashType: uint32_t;

	/**
	 * Platform.
	 */
	private mPlatform: uint8_t = 0;

	/**
	 * Hash digest length.
	 */
	private readonly mDigestLength: uint32_t;

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
	private mSpecialSlots: size_t = 0;

	/**
	 * Number of code slots.
	 * Based on execLength and pageSize.
	 */
	private get mCodeSlots(): size_t {
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
	 * Scatter vector.
	 */
	private mScatter: Ptr<CodeDirectoryScatter> | null = null;

	/**
	 * Scatter vector byte size, include sentinel.
	 */
	private mScatterSize: size_t = 0;

	/**
	 * Exec segment offset.
	 */
	private mExecSegOffset: uint64_t = 0n;

	/**
	 * Exec segment limit.
	 */
	private mExecSegLimit: uint64_t = 0n;

	/**
	 * Exec segment flags.
	 */
	private mExecSegFlags: uint64_t = 0n;

	/**
	 * Generate pre-encrypt hashes.
	 */
	private mGeneratePreEncryptHashes: bool = false;

	/**
	 * Runtime version.
	 */
	private mRuntimeVersion: uint32_t = 0;

	/**
	 * Dynamic hash crypto.
	 */
	public subtle: SubtleCryptoDigest | null = null;

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
