import {Blob} from '../blob.ts';
import {BufferView} from '../types.ts';
import {
	kSecCodeMagicCodeDirectory,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
	kSecCodeSignatureNoHash
} from '../const.ts';

/**
 * CodeDirectory class.
 */
export class CodeDirectory extends Blob {
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
	 * @inheritDoc
	 */
	public get magic() {
		return kSecCodeMagicCodeDirectory;
	}

	/**
	 * @inheritDoc
	 */
	public get length() {
		// TODO
		return 0;
	}

	/**
	 * Compatibility version.
	 */
	public version = 0;

	/**
	 * Setup and mode flags.
	 */
	public flags = 0;

	/**
	 * Get bytes of each hash digest for hashType.
	 *
	 * @returns Size of each hash digest (bytes).
	 */
	public get hashSize(): number {
		switch (this.hashType) {
			case kSecCodeSignatureNoHash: {
				return 0;
			}
			case kSecCodeSignatureHashSHA1:
			case kSecCodeSignatureHashSHA256Truncated: {
				return 20;
			}
			case kSecCodeSignatureHashSHA256: {
				return 32;
			}
			case kSecCodeSignatureHashSHA384: {
				return 48;
			}
			case kSecCodeSignatureHashSHA512: {
				return 64;
			}
			default: {
				// Do nothing.
			}
		}
		throw new Error(`Unknown hash type: ${this.hashType}`);
	}

	/**
	 * Type of hash (kSecCodeSignatureHash* constants).
	 */
	public hashType = kSecCodeSignatureNoHash;

	/**
	 * Platform identifier, zero if not platform binary.
	 */
	public platform = 0;

	/**
	 * The log2(page size in bytes), 0 => infinite.
	 */
	public pageSize = 0;

	/**
	 * @inheritDoc
	 */
	public write(buffer: BufferView, offset = 0) {
		const l = this.length;
		// TODO
		// const d = new DataView(buffer.buffer, buffer.byteOffset + offset, l);
		return l;
	}

	/**
	 * Get fixed size for compatibility version.
	 *
	 * @param version Compatibility version.
	 * @returns Byte size.
	 */
	public static fixedSize(version: number) {
		let l = 40;
		if (version >= this.supportsTeamID) {
			l += 4;
		}
		if (version >= this.supportsCodeLimit64) {
			l += 12;
		}
		if (version >= this.supportsExecSegment) {
			l += 24;
		}
		if (version >= this.supportsPreEncrypt) {
			l += 8;
		}
		return l;
	}
}
