import {
	HOST_LE,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
} from '../const.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import type { BufferView } from '../type.ts';

/**
 * Common interface of Mach-O binaries features.
 */
export class MachOBase {
	declare public readonly ['constructor']: Omit<typeof MachOBase, 'new'>;

	/**
	 * Mach-O header.
	 */
	private mHeader: MachHeader | MachHeader64;

	/**
	 * Create Mach-O base instance.
	 */
	constructor() {
		this.mHeader = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	}

	/**
	 * If binary is little endian.
	 */
	public get isLittleEndian(): boolean {
		return this.mHeader.littleEndian;
	}

	/**
	 * If binary endian does not matches the host endian.
	 */
	public get isFlipped(): boolean {
		return this.isLittleEndian !== HOST_LE;
	}

	/**
	 * If binary is 64-bit.
	 */
	public get is64(): boolean {
		return this.mHeader.magic === MH_MAGIC_64;
	}

	/**
	 * Initialize header.
	 *
	 * @param header Mach-O header data.
	 */
	protected initHeader(header: BufferView): void {
		const { buffer, byteOffset } = header;
		const mhbe = new MachHeader(buffer, byteOffset);
		switch (mhbe.magic) {
			case MH_MAGIC: {
				this.mHeader = mhbe;
				break;
			}
			case MH_CIGAM: {
				this.mHeader = new MachHeader(
					buffer,
					byteOffset,
					!mhbe.littleEndian,
				);
				break;
			}
			case MH_MAGIC_64: {
				this.mHeader = new MachHeader64(
					buffer,
					byteOffset,
					mhbe.littleEndian,
				);
				break;
			}
			case MH_CIGAM_64: {
				this.mHeader = new MachHeader64(
					buffer,
					byteOffset,
					!mhbe.littleEndian,
				);
				break;
			}
			default: {
				throw new Error(
					`Unknown header magic: ${mhbe.magic.toString(16)}`,
				);
			}
		}
	}

	/**
	 * Initialize commands.
	 *
	 * @param commands Mach-O commands data.
	 */
	protected initCommands(commands: BufferView): void {
		// TODO
		void commands;
	}

	/**
	 * Size of header.
	 *
	 * @returns Header size.
	 */
	protected get headerSize(): number {
		return this.mHeader.byteLength;
	}

	/**
	 * Size of commands.
	 *
	 * @returns Commands size.
	 */
	protected get commandSize(): number {
		return this.mHeader.sizeofcmds;
	}
}
