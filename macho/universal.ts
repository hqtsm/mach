import {
	FAT_CIGAM,
	FAT_MAGIC,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
} from '../const.ts';
import { FatHeader } from '../mach/fatheader.ts';
import { MachHeader } from '../mach/machheader.ts';
import type { Reader } from '../util/reader.ts';

/**
 * A universal binary over a readable.
 * Works for fat binaries and also thin binaries.
 */
export class Universal {
	/**
	 * Binary reader.
	 */
	private mReader: Reader | null = null;

	/**
	 * Offset in reader.
	 */
	private mBase = 0;

	/**
	 * Length in reader.
	 */
	private mLength = 0;

	/**
	 * Mach type.
	 */
	private mMachType = 0;

	/**
	 * Suspicious flag.
	 */
	private mSuspicious = false;

	/**
	 * Open binary.
	 *
	 * @param reader Reader.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection, requires offset.
	 */
	public async open(reader: Reader, offset = 0, length = 0): Promise<void> {
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		this.mReader = reader;
		this.mBase = offset;
		this.mLength = length;
		this.mMachType = 0;
		this.mSuspicious = false;

		const hs = Math.max(FatHeader.BYTE_LENGTH, MachHeader.BYTE_LENGTH);
		const hd = await reader.slice(offset, offset + hs).arrayBuffer();
		if (hd.byteLength !== hs) {
			throw new RangeError('Invalid header');
		}

		let header = new FatHeader(hd);
		let mHeader;
		const m = header.magic;
		switch (m) {
			case FAT_CIGAM:
				header = new FatHeader(hd, 0, !header.littleEndian);
				// falls through
			case FAT_MAGIC: {
				// TODO
				break;
			}
			case MH_CIGAM:
			case MH_CIGAM_64:
				mHeader = new MachHeader(hd, 0, !header.littleEndian);
				// falls through
			case MH_MAGIC:
			case MH_MAGIC_64: {
				mHeader ??= new MachHeader(hd, 0);
				// TODO
				break;
			}
			default: {
				throw new RangeError(`Unknown magic: 0x${m.toString(16)}`);
			}
		}
	}
}
