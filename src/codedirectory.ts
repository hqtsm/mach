import {Blob} from './blob.ts';
import {kSecCodeMagicCodeDirectory} from './const.ts';
import {memberU32, memberU64, memberU8} from './member.ts';
import {constant} from './util.ts';

/**
 * Describes secured pieces of a program.
 */
export class CodeDirectory extends Blob {
	public declare readonly ['constructor']: typeof CodeDirectory;

	/**
	 * Compatibility version.
	 */
	public declare version: number;

	/**
	 * Setup and mode flags (SecCodeSignatureFlags kSecCodeSignature*).
	 */
	public declare flags: number;

	/**
	 * Offset of hash slot element at index zero.
	 */
	public declare hashOffset: number;

	/**
	 * Offset of identifier string.
	 */
	public declare identOffset: number;

	/**
	 * Number of special hash slots.
	 */
	public declare nSpecialSlots: number;

	/**
	 * Number of ordinary (code) hash slots.
	 */
	public declare nCodeSlots: number;

	/**
	 * Limit to main image signature range, 32 bits.
	 */
	public declare codeLimit: number;

	/**
	 * Size of each hash in bytes.
	 */
	public declare hashSize: number;

	/**
	 * Hash type (SecCSDigestAlgorithm kSecCodeSignatureHash*).
	 */
	public declare hashType: number;

	/**
	 * Platform identifier, zero if not platform binary.
	 */
	public declare platform: number;

	/**
	 * The page size, log2(page size in bytes), 0 => infinite.
	 */
	public declare pageSize: number;

	/**
	 * Unused, must be zero.
	 */
	public declare spare2: number;

	/**
	 * Offset of scatter vector or 0 for none.
	 * Assumes supportsScatter.
	 */
	public declare scatterOffset: number;

	/**
	 * Offset of team identifier or 0 for none.
	 * Assumes supportsTeamID.
	 */
	public declare teamIDOffset: number;

	/**
	 * Unused, must be zero.
	 */
	public declare spare3: number;

	/**
	 * Limit to main image signature range, 64 bits.
	 * Assumes supportsCodeLimit64.
	 */
	public declare codeLimit64: bigint;

	/**
	 * Offset of executable segment (TEXT segment file offset),
	 * Assumes supportsExecSegment.
	 */
	public declare execSegBase: bigint;

	/**
	 * Limit of executable segment (TEXT segment file size).
	 * Assumes supportsExecSegment.
	 */
	public declare execSegLimit: bigint;

	/**
	 * The exec segment flags (SecCodeExecSegFlags kSecCodeExecSeg*).
	 * Assumes supportsExecSegment.
	 */
	public declare execSegFlags: bigint;

	/**
	 * Runtime version encoded as an unsigned integer.
	 * Assumes supportsPreEncrypt.
	 */
	public declare runtime: number;

	/**
	 * Offset of pre-encrypt hash slots.
	 * Assumes supportsPreEncrypt.
	 */
	public declare preEncryptOffset: number;

	/**
	 * Get slot data view.
	 *
	 * @param slot Slot index.
	 * @param preEncrypt Pre-encrypt version.
	 * @returns Hash value, or null.
	 */
	public getSlot(slot: number, preEncrypt: boolean) {
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
		const {hashSize} = this;
		return new Uint8Array(
			this.buffer,
			this.byteOffset + offset + hashSize * slot,
			hashSize
		);
	}

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

	static {
		let {sizeof} = this;
		sizeof += memberU32(this, sizeof, 'version', false);
		sizeof += memberU32(this, sizeof, 'flags', false);
		sizeof += memberU32(this, sizeof, 'hashOffset', false);
		sizeof += memberU32(this, sizeof, 'identOffset', false);
		sizeof += memberU32(this, sizeof, 'nSpecialSlots', false);
		sizeof += memberU32(this, sizeof, 'nCodeSlots', false);
		sizeof += memberU32(this, sizeof, 'codeLimit', false);
		sizeof += memberU8(this, sizeof, 'hashSize');
		sizeof += memberU8(this, sizeof, 'hashType');
		sizeof += memberU8(this, sizeof, 'platform');
		sizeof += memberU8(this, sizeof, 'pageSize');
		sizeof += memberU32(this, sizeof, 'spare2', false);
		sizeof += memberU32(this, sizeof, 'scatterOffset', false);
		sizeof += memberU32(this, sizeof, 'teamIDOffset', false);
		sizeof += memberU32(this, sizeof, 'spare3', false);
		sizeof += memberU64(this, sizeof, 'codeLimit64', false);
		sizeof += memberU64(this, sizeof, 'execSegBase', false);
		sizeof += memberU64(this, sizeof, 'execSegLimit', false);
		sizeof += memberU64(this, sizeof, 'execSegFlags', false);
		sizeof += memberU32(this, sizeof, 'runtime', false);
		sizeof += memberU32(this, sizeof, 'preEncryptOffset', false);
		constant(this, 'sizeof', sizeof);
		constant(this, 'typeMagic', kSecCodeMagicCodeDirectory);
		constant(this, 'earliestVersion');
		constant(this, 'supportsScatter');
		constant(this, 'supportsTeamID');
		constant(this, 'supportsCodeLimit64');
		constant(this, 'supportsExecSegment');
		constant(this, 'supportsPreEncrypt');
	}
}
