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

		let header = await reader.slice(offset, offset + MachHeader.BYTE_LENGTH)
			.arrayBuffer();
		if (header.byteLength !== MachHeader.BYTE_LENGTH) {
			throw new RangeError('Invalid Mach-O header');
		}
		this.initHeader(header);

		const headersize = this.headerSize();
		const more = headersize - header.byteLength;
		if (more > 0) {
			const o = offset + header.byteLength;
			const d = new Uint8Array(
				await reader.slice(o, o + more).arrayBuffer(),
			);
			if (d.byteLength !== more) {
				throw new RangeError('Invalid Mach-O header');
			}
			const full = new Uint8Array(header.byteLength + more);
			full.set(new Uint8Array(header));
			full.set(d, header.byteLength);
			header = full;
			this.initHeader(header);
		}

		const commandOffset = offset + headersize;
		const commandSize = this.commandSize();
		const commands = new Uint8Array(
			await reader.slice(commandOffset, commandOffset + commandSize)
				.arrayBuffer(),
		);
		if (commands.byteLength !== commandSize) {
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
