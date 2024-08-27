import {Blob} from '../blob.ts';
import {BufferView} from '../types.ts';
import {kSecCodeMagicCodeDirectory} from '../const.ts';

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
	public magic(): number {
		return kSecCodeMagicCodeDirectory;
	}

	/**
	 * @inheritDoc
	 */
	public length(): number {
		// TODO
		return 0;
	}

	/**
	 * @inheritDoc
	 */
	public write(buffer: BufferView, offset = 0): number {
		const l = this.length();
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
