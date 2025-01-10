import {
	type BufferPointer,
	type Int8Ptr,
	LITTLE_ENDIAN,
	Uint32Ptr,
} from '@hqtsm/struct';
import {
	LC_CODE_SIGNATURE,
	LC_DYLIB_CODE_SIGN_DRS,
	LC_VERSION_MIN_IPHONEOS,
	LC_VERSION_MIN_MACOSX,
	LC_VERSION_MIN_TVOS,
	LC_VERSION_MIN_WATCHOS,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
	PLATFORM_IOS,
	PLATFORM_MACOS,
	PLATFORM_TVOS,
	PLATFORM_WATCHOS,
} from '../const.ts';
import type { BuildVersionCommand } from '../mach/buildversioncommand.ts';
import type { LcStr } from '../mach/lcstr.ts';
import { LinkeditDataCommand } from '../mach/linkeditdatacommand.ts';
import { LoadCommand } from '../mach/loadcommand.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import type { Section } from '../mach/section.ts';
import type { Section64 } from '../mach/section64.ts';
import type { SegmentCommand } from '../mach/segmentcommand.ts';
import type { SegmentCommand64 } from '../mach/segmentcommand64.ts';
import type { VersionMinCommand } from '../mach/versionmincommand.ts';
import { Architecture } from './architecture.ts';

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
	private mCommands: LoadCommand | null = null;

	/**
	 * Create Mach-O base instance.
	 */
	constructor() {}

	/**
	 * The end commands offset, from start of commands.
	 */
	private get mEndCommands(): number {
		return this.mCommands!.byteOffset + this.mHeader!.sizeofcmds;
	}

	/**
	 * Is a 64-bit binary.
	 */
	private get m64(): boolean {
		return this.mHeader!.magic === MH_MAGIC_64;
	}

	/**
	 * Does binary endian not matches the host endian.
	 */
	private get mFlip(): boolean {
		return this.mHeader!.littleEndian !== LITTLE_ENDIAN;
	}

	/**
	 * If binary endian does not matches the host endian.
	 *
	 * @returns True if flipped, false if not.
	 */
	public isFlipped(): boolean {
		return this.mFlip;
	}

	/**
	 * If binary is 64-bit.
	 *
	 * @returns True if 64-bit, false if 32-bit.
	 */
	public is64(): boolean {
		return this.m64;
	}

	/**
	 * Get Mach-O header.
	 *
	 * @returns Header or null.
	 */
	public header(): MachHeader | MachHeader64 | null {
		return this.mHeader;
	}

	/**
	 * Get architecture from header.
	 *
	 * @returns Architecture.
	 */
	public architecture(): Architecture {
		const mHeader = this.mHeader!;
		return new Architecture(mHeader.cputype, mHeader.cpusubtype);
	}

	/**
	 * Get file type from header.
	 *
	 * @returns File type.
	 */
	public type(): number {
		return this.mHeader!.filetype;
	}

	/**
	 * Get flags from header.
	 *
	 * @returns Flags.
	 */
	public flags(): number {
		return this.mHeader!.flags;
	}

	/**
	 * Get load commands.
	 *
	 * @returns Load commands pointer or null.
	 */
	public loadCommands(): LoadCommand | null {
		return this.mCommands;
	}

	/**
	 * Get next load command.
	 *
	 * @param command Current load command.
	 * @returns Next load command or null.
	 */
	public nextCommand(command: LoadCommand): LoadCommand | null {
		const { cmdsize } = command;
		if (!cmdsize) {
			throw new Error('Invalid command size');
		}
		const { mEndCommands } = this;
		const byteOffset = command.byteOffset + cmdsize;
		if (byteOffset >= mEndCommands) {
			return null;
		}
		if (byteOffset + LoadCommand.BYTE_LENGTH > mEndCommands) {
			throw new Error('Invalid command size');
		}
		command = new LoadCommand(
			command.buffer,
			byteOffset,
			command.littleEndian,
		);
		if (byteOffset + command.cmdsize > mEndCommands) {
			throw new Error('Invalid command size');
		}
		return command;
	}

	/**
	 * Get command length.
	 *
	 * @returns Byte length of commands.
	 */
	public commandLength(): number {
		return this.mHeader!.sizeofcmds;
	}

	/**
	 * Find load command by type.
	 *
	 * @param cmd Command type.
	 * @returns Load command or null.
	 */
	public findCommand(cmd: number): LoadCommand | null {
		void cmd;
		throw new Error('TODO');
	}

	/**
	 * Find segment by name.
	 *
	 * @param segname Segment name.
	 * @returns Segment command or null.
	 */
	public findSegment(
		segname: Int8Ptr,
	): SegmentCommand | SegmentCommand64 | null {
		void segname;
		throw new Error('TODO');
	}

	/**
	 * Find section by name.
	 *
	 * @param segname Segment name.
	 * @param sectname Section name.
	 * @returns Section or null.
	 */
	public findSection(
		segname: Int8Ptr,
		sectname: Int8Ptr,
	): Section | Section64 | null {
		void segname;
		void sectname;
		throw new Error('TODO');
	}

	/**
	 * Get string from load command union.
	 *
	 * @param cmd Load command.
	 * @param str String union.
	 * @returns String pointer or null.
	 */
	public string(cmd: LoadCommand, str: LcStr): Int8Ptr {
		void cmd;
		void str;
		throw new Error('TODO');
	}

	/**
	 * Find code signature command.
	 *
	 * @returns Code signature command or null.
	 */
	public findCodeSignature(): LinkeditDataCommand | null {
		const cmd = this.findCommand(LC_CODE_SIGNATURE);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < LinkeditDataCommand.BYTE_LENGTH) {
			throw new Error('Invalid LC_CODE_SIGNATURE command size');
		}
		return new LinkeditDataCommand(
			cmd.buffer,
			cmd.byteOffset,
			cmd.littleEndian,
		);
	}

	/**
	 * Find code signing DRs copied from linked dylibs.
	 *
	 * @returns Code signing DRs command or null.
	 */
	public findLibraryDependencies(): LinkeditDataCommand | null {
		const cmd = this.findCommand(LC_DYLIB_CODE_SIGN_DRS);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < LinkeditDataCommand.BYTE_LENGTH) {
			throw new Error('Invalid LC_DYLIB_CODE_SIGN_DRS command size');
		}
		return new LinkeditDataCommand(
			cmd.buffer,
			cmd.byteOffset,
			cmd.littleEndian,
		);
	}

	/**
	 * Get code signature offset.
	 *
	 * @returns Code signature offset, or 0.
	 */
	public signingOffset(): number {
		const lec = this.findCodeSignature();
		return lec ? lec.dataoff : 0;
	}

	/**
	 * Get code signature length.
	 *
	 * @returns Code signature length, or 0.
	 */
	public signingLength(): number {
		const lec = this.findCodeSignature();
		return lec ? lec.datasize : 0;
	}

	/**
	 * Get version identifer information.
	 *
	 * @param platform Platform.
	 * @param minVersion Minimum version.
	 * @param sdkVersion SDK version.
	 * @returns True if found, false if not.
	 */
	public version(
		platform: Uint32Ptr | null,
		minVersion: Uint32Ptr | null,
		sdkVersion: Uint32Ptr | null,
	): boolean {
		const bc = this.findBuildVersion();
		if (bc) {
			if (platform) {
				platform[0] = bc.platform;
			}
			if (minVersion) {
				minVersion[0] = bc.minos;
			}
			if (sdkVersion) {
				sdkVersion[0] = bc.sdk;
			}
			return true;
		}

		const vc = this.findMinVersion();
		if (vc) {
			if (platform) {
				let pf;
				switch (vc.cmd) {
					case LC_VERSION_MIN_MACOSX: {
						pf = PLATFORM_MACOS;
						break;
					}
					case LC_VERSION_MIN_IPHONEOS: {
						pf = PLATFORM_IOS;
						break;
					}
					case LC_VERSION_MIN_WATCHOS: {
						pf = PLATFORM_WATCHOS;
						break;
					}
					case LC_VERSION_MIN_TVOS: {
						pf = PLATFORM_TVOS;
						break;
					}
					default: {
						pf = 0;
					}
				}
				platform[0] = pf;
			}
			if (minVersion) {
				minVersion[0] = vc.version;
			}
			if (sdkVersion) {
				sdkVersion[0] = vc.sdk;
			}
			return true;
		}

		return false;
	}

	/**
	 * Get platform.
	 *
	 * @returns Platform or 0.
	 */
	public platform(): number {
		const p = new Uint32Ptr(new ArrayBuffer(Uint32Ptr.BYTES_PER_ELEMENT));
		return this.version(p, null, null) ? p[0] : 0;
	}

	/**
	 * Get minimum version.
	 *
	 * @returns Minimum version or 0.
	 */
	public minVersion(): number {
		const p = new Uint32Ptr(new ArrayBuffer(Uint32Ptr.BYTES_PER_ELEMENT));
		return this.version(null, p, null) ? p[0] : 0;
	}

	/**
	 * Get SDK version.
	 *
	 * @returns SDK version or 0.
	 */
	public sdkVersion(): number {
		const p = new Uint32Ptr(new ArrayBuffer(Uint32Ptr.BYTES_PER_ELEMENT));
		return this.version(null, null, p) ? p[0] : 0;
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
				throw new TypeError(
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
		this.mCommands = new LoadCommand(
			commands.buffer,
			commands.byteOffset,
			this.mHeader!.littleEndian,
		);
	}

	/**
	 * Size of header.
	 *
	 * @returns Byte length of header.
	 */
	protected headerSize(): number {
		return this.m64 ? MachHeader64.BYTE_LENGTH : MachHeader.BYTE_LENGTH;
	}

	/**
	 * Size of commands.
	 *
	 * @returns Byte length of commands.
	 */
	protected commandSize(): number {
		return this.mHeader!.sizeofcmds;
	}

	/**
	 * Find minimum version command.
	 *
	 * @returns Minimum version command or null.
	 */
	protected findMinVersion(): VersionMinCommand | null {
		throw new Error('TODO');
	}

	/**
	 * Find build version command.
	 *
	 * @returns Build version command or null.
	 */
	protected findBuildVersion(): BuildVersionCommand | null {
		throw new Error('TODO');
	}
}
