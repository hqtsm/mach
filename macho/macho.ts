import type { ArrayBufferReal } from '@hqtsm/struct/native';
import { MachHeader } from '../mach/machheader.ts';
import type { Reader } from '../util/reader.ts';
import { MachOBase } from './machobase.ts';

/**
 * A Mach-O binary over a readable.
 */
export class MachO extends MachOBase {
	declare public readonly ['constructor']: Omit<typeof MachO, 'new'>;

	/**
	 * Binary reader.
	 */
	private mReader: Reader | null = null;

	/**
	 * Offset in reader.
	 */
	private mOffset = 0;

	/**
	 * Length in reader.
	 */
	private mLength = 0;

	/**
	 * Open binary.
	 *
	 * @param reader Reader object.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection, requires offset.
	 */
	public async open(reader: Reader, offset = 0, length = 0): Promise<void> {
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		this.mReader = reader;
		this.mOffset = offset;
		this.mLength = offset ? length : reader.size;

		const hs = MachHeader.BYTE_LENGTH;
		const header = await reader.slice(offset, offset + hs).arrayBuffer();
		if (header.byteLength !== hs) {
			throw new RangeError('Invalid Mach-O header');
		}
		this.initHeader(header);
		offset += hs;

		const fhs = this.headerSize();
		const more = fhs - hs;
		if (more > 0) {
			const d = await reader.slice(offset, offset + more).arrayBuffer();
			if (d.byteLength !== more) {
				throw new RangeError('Invalid Mach-O header');
			}
			const full = new Uint8Array(fhs);
			full.set(new Uint8Array(header));
			full.set(new Uint8Array(d), hs);
			this.initHeader(full);
			offset += more;
		}

		const cs = this.commandSize();
		const commands = await reader.slice(offset, offset + cs).arrayBuffer();
		if (commands.byteLength !== cs) {
			throw new RangeError('Invalid Mach-O commands');
		}
		this.initCommands(commands);
	}

	/**
	 * Is a binary open.
	 *
	 * @returns Is open.
	 */
	public isOpen(): boolean {
		return !!this.mReader;
	}

	/**
	 * Get binary offset.
	 *
	 * @returns Offset in reader.
	 */
	public offset(): number {
		return this.mOffset;
	}

	/**
	 * Get binary length.
	 *
	 * @returns Length in reader.
	 */
	public length(): number {
		return this.mLength;
	}

	/**
	 * Get signing extent.
	 *
	 * @returns Signing offset or file length if none.
	 */
	public signingExtent(): number {
		return this.signingOffset() || this.length();
	}

	/**
	 * Read data at offset.
	 *
	 * @param offset Offset in reader.
	 * @param size Size to read.
	 * @returns Data.
	 */
	public async dataAt(
		offset: number,
		size: number,
	): Promise<ArrayBufferReal> {
		offset = (+offset || 0) - (offset % 1 || 0);
		size = (+size || 0) - (size % 1 || 0);
		const data = await this.mReader!.slice(offset, offset + size)
			.arrayBuffer();
		if (data.byteLength !== size) {
			throw new RangeError('Invalid Mach-O data range');
		}
		return data;
	}
}
