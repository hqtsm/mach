import {
	HOST_LE,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
} from '../const.ts';
import { MachHeader, MachHeaderBE, MachHeaderLE } from '../mach/machheader.ts';
import {
	MachHeader64,
	MachHeader64BE,
	MachHeader64LE,
} from '../mach/machheader64.ts';
import type { BufferView } from '../type.ts';

/**
 * Common interface of Mach-O binaries features.
 */
export class MachOBase {
	declare public readonly ['constructor']: Omit<typeof MachOBase, 'new'>;

	/**
	 * Mach-O header.
	 */
	private mHeader:
		| this['constructor']['MachHeader']['prototype']
		| this['constructor']['MachHeader64']['prototype'];

	/**
	 * Create Mach-O base instance.
	 */
	constructor() {
		const { MachHeader } = this.constructor;
		this.mHeader = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	}

	/**
	 * If endian does not matches the host endian.
	 */
	public get isFlipped(): boolean {
		return this.mHeader.littleEndian !== HOST_LE;
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
		const { MachHeaderBE, MachHeaderLE, MachHeader64BE, MachHeader64LE } =
			this.constructor;
		const { buffer, byteOffset } = header;
		const mhbe = new MachHeaderBE(buffer, byteOffset);
		switch (mhbe.magic) {
			case MH_MAGIC: {
				this.mHeader = mhbe;
				break;
			}
			case MH_CIGAM: {
				this.mHeader = new MachHeaderLE(buffer, byteOffset);
				break;
			}
			case MH_MAGIC_64: {
				this.mHeader = new MachHeader64BE(buffer, byteOffset);
				break;
			}
			case MH_CIGAM_64: {
				this.mHeader = new MachHeader64LE(buffer, byteOffset);
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

	/**
	 * MachHeader reference.
	 */
	public static readonly MachHeader = MachHeader;

	/**
	 * MachHeaderBE reference.
	 */
	public static readonly MachHeaderBE = MachHeaderBE;

	/**
	 * MachHeaderLE reference.
	 */
	public static readonly MachHeaderLE = MachHeaderLE;

	/**
	 * MachHeader64 reference.
	 */
	public static readonly MachHeader64 = MachHeader64;

	/**
	 * MachHeader64BE reference.
	 */
	public static readonly MachHeader64BE = MachHeader64BE;

	/**
	 * MachHeader64LE reference.
	 */
	public static readonly MachHeader64LE = MachHeader64LE;
}
