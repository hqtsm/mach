import { type ArrayBufferReal, getByteLength } from '@hqtsm/struct';
import {
	LC_SEGMENT,
	LC_SEGMENT_64,
	LC_SYMTAB,
	SEG_LINKEDIT,
} from '../const.ts';
import { strncmp } from '../libc/string.ts';
import { MachHeader } from '../mach/machheader.ts';
import { SegmentCommand } from '../mach/segmentcommand.ts';
import { SegmentCommand64 } from '../mach/segmentcommand64.ts';
import { SymtabCommand } from '../mach/symtabcommand.ts';
import type { Reader } from '../util/reader.ts';
import { MachOBase } from './machobase.ts';

/**
 * A Mach-O binary over a reader.
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
	 * Suspicious flag.
	 */
	private mSuspicious = false;

	/**
	 * Create uninitialized Mach-O instance.
	 */
	protected constructor() {
		super();
	}

	/**
	 * Initialize instance.
	 *
	 * @param reader Reader object.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection, requires offset.
	 * @returns This instance.
	 */
	protected async MachO(
		reader: Reader,
		offset = 0,
		length = 0,
	): Promise<MachO> {
		offset = (+offset || 0) - (offset % 1 || 0);
		length = (+length || 0) - (length % 1 || 0);
		this.mReader = reader;
		this.mOffset = offset;
		const mLength = this.mLength = offset ? length : reader.size;
		this.mSuspicious = false;

		const hs = MachHeader.BYTE_LENGTH;
		const header = await reader.slice(offset, offset + hs).arrayBuffer();
		if (header.byteLength !== hs) {
			throw new RangeError('Invalid header');
		}
		this.initHeader(header);
		offset += hs;

		const fhs = this.headerSize();
		const more = fhs - hs;
		if (more > 0) {
			const d = await reader.slice(offset, offset + more).arrayBuffer();
			if (d.byteLength !== more) {
				throw new RangeError('Invalid header');
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
			throw new RangeError('Invalid commands');
		}
		this.initCommands(commands);

		if (mLength) {
			this.validateStructure();
		}
		return this;
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
		const o = this.mOffset + offset;
		const data = await this.mReader!.slice(o, o + size).arrayBuffer();
		if (data.byteLength !== size) {
			throw new RangeError(
				`Invalid data range: ${offset}:${size}`,
			);
		}
		return data;
	}

	/**
	 * Validate structure of binary.
	 */
	public validateStructure(): void {
		let isValid = false;

		const segLinkedit = new Uint8Array(SEG_LINKEDIT.length + 1);
		for (let i = SEG_LINKEDIT.length; i--;) {
			segLinkedit[i] = SEG_LINKEDIT.charCodeAt(i);
		}

		LOOP: for (
			let cmd = this.loadCommands();
			cmd;
			cmd = this.nextCommand(cmd)
		) {
			switch (cmd.cmd) {
				case LC_SEGMENT: {
					if (cmd.cmdsize < SegmentCommand.BYTE_LENGTH) {
						throw new RangeError('Invalid command size');
					}
					const seg = new SegmentCommand(
						cmd.buffer,
						cmd.byteOffset,
						cmd.littleEndian,
					);
					if (
						!strncmp(
							seg.segname,
							segLinkedit,
							getByteLength(SegmentCommand, 'segname'),
						)
					) {
						isValid = seg.fileoff + seg.filesize === this.length();
						break LOOP;
					}
					break;
				}
				case LC_SEGMENT_64: {
					if (cmd.cmdsize < SegmentCommand64.BYTE_LENGTH) {
						throw new RangeError('Invalid command size');
					}
					const seg64 = new SegmentCommand64(
						cmd.buffer,
						cmd.byteOffset,
						cmd.littleEndian,
					);
					if (
						!strncmp(
							seg64.segname,
							segLinkedit,
							getByteLength(SegmentCommand64, 'segname'),
						)
					) {
						isValid = Number(seg64.fileoff + seg64.filesize) ===
							this.length();
						break LOOP;
					}
					break;
				}
				case LC_SYMTAB: {
					if (cmd.cmdsize < SymtabCommand.BYTE_LENGTH) {
						throw new RangeError('Invalid command size');
					}
					const symtab = new SymtabCommand(
						cmd.buffer,
						cmd.byteOffset,
						cmd.littleEndian,
					);
					isValid = symtab.stroff + symtab.strsize === this.length();
					break LOOP;
				}
			}
		}

		if (!isValid) {
			this.mSuspicious = true;
		}
	}

	/**
	 * Check if binary structure is suspicious.
	 *
	 * @returns Is suspicious.
	 */
	public isSuspicious(): boolean {
		return this.mSuspicious;
	}

	/**
	 * Create Mach-O binary over a reader.
	 *
	 * @param reader Reader object.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection, requires offset.
	 * @returns Mach-O binary.
	 */
	public static async MachO(
		reader: Reader,
		offset = 0,
		length = 0,
	): Promise<MachO> {
		return await new MachO().MachO(reader, offset, length);
	}
}
