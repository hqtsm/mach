import {
	type BufferPointer,
	LITTLE_ENDIAN,
	pointer,
	type Ptr,
} from '@hqtsm/struct';
import { MH_CIGAM, MH_CIGAM_64, MH_MAGIC, MH_MAGIC_64 } from '../const.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { LoadCommand } from '../mach/loadcommand.ts';

const LoadCommandPtr = pointer(LoadCommand);

/**
 * Common interface of Mach-O binaries features.
 */
export class MachOBase {
	declare public readonly ['constructor']: Omit<typeof MachOBase, 'new'>;

	/**
	 * Mach-O header.
	 */
	private mHeader: MachHeader | MachHeader64 | null = null;

	/**
	 * Mach-O commands.
	 */
	private mCommands: Ptr<LoadCommand> | null = null;

	/**
	 * Create Mach-O base instance.
	 */
	constructor() {}

	/**
	 * If binary is little endian.
	 */
	public get isLittleEndian(): boolean {
		return this.mHeader!.littleEndian;
	}

	/**
	 * If binary endian does not matches the host endian.
	 */
	public get isFlipped(): boolean {
		return this.isLittleEndian !== LITTLE_ENDIAN;
	}

	/**
	 * If binary is 64-bit.
	 */
	public get is64(): boolean {
		return this.mHeader!.magic === MH_MAGIC_64;
	}

	/**
	 * Initialize header.
	 *
	 * @param header Mach-O header data.
	 */
	protected initHeader(header: BufferPointer): void {
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
	protected initCommands(commands: BufferPointer): void {
		this.mCommands = new LoadCommandPtr(
			commands.buffer,
			commands.byteOffset,
		);
	}

	/**
	 * Size of header.
	 */
	protected get headerSize(): number {
		return this.mHeader!.byteLength;
	}

	/**
	 * Size of commands.
	 */
	protected get commandSize(): number {
		return this.mHeader!.sizeofcmds;
	}
}
