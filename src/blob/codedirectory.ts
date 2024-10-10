import {kSecCodeMagicCodeDirectory} from '../const.ts';
import {structU32, structU64, structU8} from '../struct.ts';

import {Blob} from './blob.ts';

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
	 * @inheritdoc
	 */
	public static readonly typeMagic = kSecCodeMagicCodeDirectory;

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
	 * @inheritdoc
	 */
	public static BYTE_LENGTH = (o => {
		o += structU32(this, o, 'version', false);
		o += structU32(this, o, 'flags', false);
		o += structU32(this, o, 'hashOffset', false);
		o += structU32(this, o, 'identOffset', false);
		o += structU32(this, o, 'nSpecialSlots', false);
		o += structU32(this, o, 'nCodeSlots', false);
		o += structU32(this, o, 'codeLimit', false);
		o += structU8(this, o, 'hashSize');
		o += structU8(this, o, 'hashType');
		o += structU8(this, o, 'platform');
		o += structU8(this, o, 'pageSize');
		o += structU32(this, o, 'spare2', false);
		o += structU32(this, o, 'scatterOffset', false);
		o += structU32(this, o, 'teamIDOffset', false);
		o += structU32(this, o, 'spare3', false);
		o += structU64(this, o, 'codeLimit64', false);
		o += structU64(this, o, 'execSegBase', false);
		o += structU64(this, o, 'execSegLimit', false);
		o += structU64(this, o, 'execSegFlags', false);
		o += structU32(this, o, 'runtime', false);
		o += structU32(this, o, 'preEncryptOffset', false);
		return o;
	})(super.BYTE_LENGTH);
}
