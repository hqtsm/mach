import { constant, toStringTag } from '@hqtsm/class';
import {
	type Const,
	Int8Ptr,
	pointer,
	type Ptr,
	uint32BE,
	uint64BE,
	uint8,
	Uint8Ptr,
} from '@hqtsm/struct';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kSecCodeMagicCodeDirectory,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
} from '../const.ts';
import { CCHashInstance } from '../hash/cchashinstance.ts';
import type { DynamicHash } from '../hash/dynamichash.ts';
import { Blob } from './blob.ts';
import { CodeDirectoryScatter } from './codedirectoryscatter.ts';

/**
 * Describes secured pieces of a program.
 */
export class CodeDirectory extends Blob {
	/**
	 * Compatibility version.
	 */
	declare public version: number;

	/**
	 * Setup and mode flags (SecCodeSignatureFlags kSecCodeSignature*).
	 */
	declare public flags: number;

	/**
	 * Offset of hash slot element at index zero.
	 */
	declare public hashOffset: number;

	/**
	 * Offset of identifier string.
	 */
	declare public identOffset: number;

	/**
	 * Number of special hash slots.
	 */
	declare public nSpecialSlots: number;

	/**
	 * Number of ordinary (code) hash slots.
	 */
	declare public nCodeSlots: number;

	/**
	 * Limit to main image signature range, 32 bits.
	 */
	declare public codeLimit: number;

	/**
	 * Size of each hash in bytes.
	 */
	declare public hashSize: number;

	/**
	 * Hash type (SecCSDigestAlgorithm kSecCodeSignatureHash*).
	 */
	declare public hashType: number;

	/**
	 * Platform identifier, zero if not platform binary.
	 */
	declare public platform: number;

	/**
	 * The page size, log2(page size in bytes), 0 => infinite.
	 */
	declare public pageSize: number;

	/**
	 * Unused, must be zero.
	 */
	declare public spare2: number;

	/**
	 * Offset of scatter vector or 0 for none.
	 * Assumes supportsScatter.
	 */
	declare public scatterOffset: number;

	/**
	 * Offset of team identifier or 0 for none.
	 * Assumes supportsTeamID.
	 */
	declare public teamIDOffset: number;

	/**
	 * Unused, must be zero.
	 */
	declare public spare3: number;

	/**
	 * Limit to main image signature range, 64 bits.
	 * Assumes supportsCodeLimit64.
	 */
	declare public codeLimit64: bigint;

	/**
	 * Offset of executable segment (TEXT segment file offset),
	 * Assumes supportsExecSegment.
	 */
	declare public execSegBase: bigint;

	/**
	 * Limit of executable segment (TEXT segment file size).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegLimit: bigint;

	/**
	 * The exec segment flags (SecCodeExecSegFlags kSecCodeExecSeg*).
	 * Assumes supportsExecSegment.
	 */
	declare public execSegFlags: bigint;

	/**
	 * Runtime version encoded as an unsigned integer.
	 * Assumes supportsPreEncrypt.
	 */
	declare public runtime: number;

	/**
	 * Offset of pre-encrypt hash slots.
	 * Assumes supportsPreEncrypt.
	 */
	declare public preEncryptOffset: number;

	/**
	 * Pointer to identifier string.
	 *
	 * @param _this This.
	 * @returns Char pointer.
	 */
	public static identifier(_this: CodeDirectory): Int8Ptr {
		return new Int8Ptr(
			_this.buffer,
			_this.byteOffset + _this.identOffset,
			_this.littleEndian,
		);
	}

	/**
	 * Signed code limit, from codeLimit64 or codeLimit.
	 *
	 * @param _this This.
	 * @returns Code limit.
	 */
	public static signingLimit(_this: CodeDirectory): bigint {
		if (_this.version >= CodeDirectory.supportsCodeLimit64) {
			const { codeLimit64 } = _this;
			if (codeLimit64) {
				return codeLimit64;
			}
		}
		return BigInt(_this.codeLimit);
	}

	/**
	 * Get slot data view, for writing.
	 *
	 * @param _this This.
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public static getSlotMutable(
		_this: CodeDirectory,
		slot: number,
		preEncrypt: boolean,
	): Uint8Ptr | null {
		slot = (+slot || 0) - (slot % 1 || 0);
		let offset;
		if (preEncrypt) {
			if (
				_this.version < CodeDirectory.supportsPreEncrypt ||
				!(offset = _this.preEncryptOffset)
			) {
				return null;
			}
		} else {
			offset = _this.hashOffset;
		}
		return new Uint8Ptr(
			_this.buffer,
			_this.byteOffset + offset + _this.hashSize * slot,
			_this.littleEndian,
		);
	}

	/**
	 * Get slot data view, for reading.
	 *
	 * @param _this This.
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public static getSlot(
		_this: CodeDirectory,
		slot: number,
		preEncrypt: boolean,
	): Const<Uint8Ptr> | null {
		return CodeDirectory.getSlotMutable(_this, slot, preEncrypt);
	}

	/**
	 * Pointer to scatter vector.
	 *
	 * @param _this This.
	 * @returns Scatter pointer, or null.
	 */
	public static scatterVector(
		_this: CodeDirectory,
	): Ptr<CodeDirectoryScatter> | null {
		if (_this.version >= CodeDirectory.supportsScatter) {
			const { scatterOffset } = _this;
			if (scatterOffset) {
				return new (pointer(CodeDirectoryScatter))(
					_this.buffer,
					_this.byteOffset + scatterOffset,
					_this.littleEndian,
				);
			}
		}
		return null;
	}

	/**
	 * Pointer to team identifier string.
	 *
	 * @param _this This.
	 * @returns Char pointer, or null.
	 */
	public static teamID(_this: CodeDirectory): Int8Ptr | null {
		if (_this.version >= CodeDirectory.supportsTeamID) {
			const { teamIDOffset } = _this;
			if (teamIDOffset) {
				return new Int8Ptr(
					_this.buffer,
					_this.byteOffset + teamIDOffset,
					_this.littleEndian,
				);
			}
		}
		return null;
	}

	/**
	 * Executable segment base.
	 *
	 * @param _this This.
	 * @returns Byte offset, zero if not supported.
	 */
	public static execSegmentBase(_this: CodeDirectory): bigint {
		return _this.version >= CodeDirectory.supportsExecSegment
			? _this.execSegBase
			: 0n;
	}

	/**
	 * Executable segment limit.
	 *
	 * @param _this This.
	 * @returns Byte length, zero if not supported.
	 */
	public static execSegmentLimit(_this: CodeDirectory): bigint {
		return _this.version >= CodeDirectory.supportsExecSegment
			? _this.execSegLimit
			: 0n;
	}

	/**
	 * Executable segment flags.
	 *
	 * @param _this This.
	 * @returns Flags, zero if not supported.
	 */
	public static execSegmentFlags(_this: CodeDirectory): bigint {
		return _this.version >= CodeDirectory.supportsExecSegment
			? _this.execSegFlags
			: 0n;
	}

	/**
	 * Runtime version.
	 *
	 * @param _this This.
	 * @returns Version, zero if not supported.
	 */
	public static runtimeVersion(_this: CodeDirectory): number {
		return _this.version >= CodeDirectory.supportsPreEncrypt
			? _this.runtime
			: 0;
	}

	public static override readonly typeMagic = kSecCodeMagicCodeDirectory;

	/**
	 * Earliest supported version.
	 */
	public static readonly earliestVersion = 0x20001;

	/**
	 * First version to support scatter.
	 */
	public static readonly supportsScatter = 0x20100;

	/**
	 * First version to support team ID.
	 */
	public static readonly supportsTeamID = 0x20200;

	/**
	 * First version to support codeLimit64.
	 */
	public static readonly supportsCodeLimit64 = 0x20300;

	/**
	 * First version to support exec base and limit.
	 */
	public static readonly supportsExecSegment = 0x20400;

	/**
	 * First version to support pre-encrypt hashes and runtime version.
	 */
	public static readonly supportsPreEncrypt = 0x20500;

	/**
	 * Get hash instance for hash type.
	 *
	 * @param hashType Hash type.
	 * @returns Hash instance.
	 */
	public static hashFor(hashType: number): DynamicHash {
		switch (hashType) {
			case kSecCodeSignatureHashSHA1: {
				return new CCHashInstance(kCCDigestSHA1);
			}
			case kSecCodeSignatureHashSHA256: {
				return new CCHashInstance(kCCDigestSHA256);
			}
			case kSecCodeSignatureHashSHA384: {
				return new CCHashInstance(kCCDigestSHA384);
			}
			case kSecCodeSignatureHashSHA256Truncated: {
				return new CCHashInstance(kCCDigestSHA256, 20);
			}
		}
		throw new RangeError(`Unsupported hash type: ${hashType}`);
	}

	static {
		toStringTag(this, 'CodeDirectory');
		uint32BE(this, 'version');
		uint32BE(this, 'flags');
		uint32BE(this, 'hashOffset');
		uint32BE(this, 'identOffset');
		uint32BE(this, 'nSpecialSlots');
		uint32BE(this, 'nCodeSlots');
		uint32BE(this, 'codeLimit');
		uint8(this, 'hashSize');
		uint8(this, 'hashType');
		uint8(this, 'platform');
		uint8(this, 'pageSize');
		uint32BE(this, 'spare2');
		uint32BE(this, 'scatterOffset');
		uint32BE(this, 'teamIDOffset');
		uint32BE(this, 'spare3');
		uint64BE(this, 'codeLimit64');
		uint64BE(this, 'execSegBase');
		uint64BE(this, 'execSegLimit');
		uint64BE(this, 'execSegFlags');
		uint32BE(this, 'runtime');
		uint32BE(this, 'preEncryptOffset');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
		constant(this, 'earliestVersion');
		constant(this, 'supportsScatter');
		constant(this, 'supportsTeamID');
		constant(this, 'supportsCodeLimit64');
		constant(this, 'supportsExecSegment');
		constant(this, 'supportsPreEncrypt');
	}
}
