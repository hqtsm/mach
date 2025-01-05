import {
	constant,
	Int8Ptr,
	pointer,
	type Ptr,
	uint32BE,
	uint64BE,
	uint8,
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
import { CodeDirectoryScatter } from './codedirectoryscatter.ts';
import { Blob } from './blob.ts';

/**
 * Describes secured pieces of a program.
 */
export class CodeDirectory extends Blob {
	declare public readonly ['constructor']: Omit<typeof CodeDirectory, 'new'>;

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
	 */
	public get identifier(): Int8Ptr {
		return new Int8Ptr(
			this.buffer,
			this.byteOffset + this.identOffset,
			this.littleEndian,
		);
	}

	/**
	 * Signed code limit, from codeLimit64 or codeLimit.
	 */
	public get signingLimit(): bigint {
		if (this.version >= this.constructor.supportsCodeLimit64) {
			const { codeLimit64 } = this;
			if (codeLimit64) {
				return codeLimit64;
			}
		}
		return BigInt(this.codeLimit);
	}

	/**
	 * Pointer to scatter vector.
	 */
	public get scatterVector(): Ptr<CodeDirectoryScatter> | null {
		if (this.version >= this.constructor.supportsScatter) {
			const { scatterOffset } = this;
			if (scatterOffset) {
				return new (pointer(CodeDirectoryScatter))(
					this.buffer,
					this.byteOffset + scatterOffset,
					this.littleEndian,
				);
			}
		}
		return null;
	}

	/**
	 * Pointer to team identifier string.
	 */
	public get teamID(): Int8Ptr | null {
		if (this.version >= this.constructor.supportsTeamID) {
			const { teamIDOffset } = this;
			if (teamIDOffset) {
				return new Int8Ptr(
					this.buffer,
					this.byteOffset + teamIDOffset,
					this.littleEndian,
				);
			}
		}
		return null;
	}

	/**
	 * Executable segment base, zero if not supported.
	 */
	public get execSegmentBase(): bigint {
		if (this.version >= this.constructor.supportsExecSegment) {
			return this.execSegBase;
		}
		return 0n;
	}

	/**
	 * Executable segment limit, zero if not supported.
	 */
	public get execSegmentLimit(): bigint {
		if (this.version >= this.constructor.supportsExecSegment) {
			return this.execSegLimit;
		}
		return 0n;
	}

	/**
	 * Executable segment flags, zero if not supported.
	 */
	public get execSegmentFlags(): bigint {
		if (this.version >= this.constructor.supportsExecSegment) {
			return this.execSegFlags;
		}
		return 0n;
	}

	/**
	 * Runtime version, zero if not supported.
	 */
	public get runtimeVersion(): number {
		if (this.version >= this.constructor.supportsPreEncrypt) {
			return this.runtime;
		}
		return 0;
	}

	/**
	 * Get slot data view.
	 *
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public getSlot(slot: number, preEncrypt: boolean): Uint8Array | null {
		slot = (+slot || 0) - (slot % 1 || 0);
		let offset;
		if (preEncrypt) {
			if (
				this.version < this.constructor.supportsPreEncrypt ||
				!(offset = this.preEncryptOffset)
			) {
				return null;
			}
		} else {
			offset = this.hashOffset;
		}
		const { hashSize } = this;
		return new Uint8Array(
			this.buffer,
			this.byteOffset + offset + hashSize * slot,
			hashSize,
		);
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
		throw new Error(`Unsupported hash type: ${hashType}`);
	}

	static {
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
