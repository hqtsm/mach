import { kSecCodeMagicCodeDirectory } from '../const.ts';
import { structU32, structU64, structU8 } from '../struct.ts';

import { Blob } from './blob.ts';

/**
 * Describes secured pieces of a program.
 */
export class CodeDirectory extends Blob {
	declare public readonly ['constructor']: typeof CodeDirectory;

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
		const { hashSize } = this;
		return new Uint8Array(
			this.buffer,
			this.byteOffset + offset + hashSize * slot,
			hashSize,
		);
	}

	/**
	 * @inheritdoc
	 */
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
	 * @inheritdoc
	 */
	public static override readonly BYTE_LENGTH = ((o) => {
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
