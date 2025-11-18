import type { Class } from '@hqtsm/class';
import {
	type BufferPointer,
	type Const,
	getByteLength,
	Int8Ptr,
	LITTLE_ENDIAN,
	Uint32Ptr,
} from '@hqtsm/struct';
import {
	LC_BUILD_VERSION,
	LC_CODE_SIGNATURE,
	LC_DYLIB_CODE_SIGN_DRS,
	LC_SEGMENT,
	LC_SEGMENT_64,
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
import { strlen, strncmp } from '../libc/string.ts';
import { BuildVersionCommand } from '../mach/buildversioncommand.ts';
import type { LcStr } from '../mach/lcstr.ts';
import { LinkeditDataCommand } from '../mach/linkeditdatacommand.ts';
import { LoadCommand } from '../mach/loadcommand.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { Section } from '../mach/section.ts';
import { Section64 } from '../mach/section64.ts';
import { SegmentCommand } from '../mach/segmentcommand.ts';
import { SegmentCommand64 } from '../mach/segmentcommand64.ts';
import { VersionMinCommand } from '../mach/versionmincommand.ts';
import { Architecture } from './architecture.ts';

/**
 * Common interface of Mach-O binaries features.
 */
export class MachOBase {
	declare public readonly ['constructor']: Class<typeof MachOBase>;

	/**
	 * Mach-O header.
	 */
	private mHeader: Const<MachHeader> | Const<MachHeader64> | null = null;

	/**
	 * Mach-O commands.
	 */
	private mCommands: Const<LoadCommand> | null = null;

	/**
	 * The end commands offset, from start of commands.
	 */
	private mEndCommands = 0;

	/**
	 * Is a 64-bit binary.
	 */
	private m64 = false;

	/**
	 * Does binary endian not matches the host endian.
	 */
	private mFlip = false;

	/**
	 * Create Mach-O base instance.
	 */
	constructor() {}

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
	public header(): Const<MachHeader> | Const<MachHeader64> | null {
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
	public loadCommands(): Const<LoadCommand> | null {
		return this.mCommands;
	}

	/**
	 * Get next load command.
	 *
	 * @param command Current load command.
	 * @returns Next load command or null.
	 */
	public nextCommand(command: Const<LoadCommand>): Const<LoadCommand> | null {
		const { cmdsize } = command;
		if (!cmdsize) {
			throw new RangeError('Invalid command size');
		}
		const { mEndCommands } = this;
		const byteOffset = command.byteOffset + cmdsize;
		if (byteOffset >= mEndCommands) {
			return null;
		}
		if (byteOffset + LoadCommand.BYTE_LENGTH > mEndCommands) {
			throw new RangeError('Invalid command size');
		}
		command = new LoadCommand(
			command.buffer,
			byteOffset,
			command.littleEndian,
		);
		if (byteOffset + command.cmdsize > mEndCommands) {
			throw new RangeError('Invalid command size');
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
	public findCommand(cmd: number): Const<LoadCommand> | null {
		for (let c = this.loadCommands(); c; c = this.nextCommand(c)) {
			if (c.cmd === cmd) {
				return c;
			}
		}
		return null;
	}

	/**
	 * Find segment by name.
	 *
	 * @param segname Segment name character pointer, null terminated.
	 * @returns Segment command or null.
	 */
	public findSegment(
		segname: ArrayBufferLike | BufferPointer,
	): Const<SegmentCommand> | Const<SegmentCommand64> | null {
		let buffer, byteOffset;
		if ('buffer' in segname) {
			buffer = segname.buffer;
			byteOffset = segname.byteOffset;
		} else {
			buffer = segname;
			byteOffset = 0;
		}
		const sn = new Int8Ptr(buffer, byteOffset);
		let SC: typeof SegmentCommand | typeof SegmentCommand64 | null;
		for (let c = this.loadCommands(); c; c = this.nextCommand(c)) {
			switch (c.cmd) {
				case LC_SEGMENT: {
					SC = SegmentCommand;
					break;
				}
				case LC_SEGMENT_64: {
					SC = SegmentCommand64;
					break;
				}
				default: {
					continue;
				}
			}
			if (c.cmdsize < SC.BYTE_LENGTH) {
				throw new RangeError('Invalid command size');
			}
			const seg = new SC(c.buffer, c.byteOffset, c.littleEndian);
			if (!strncmp(seg.segname, sn, getByteLength(SC, 'segname'))) {
				return seg;
			}
		}
		return null;
	}

	/**
	 * Find section by name.
	 *
	 * @param segname Segment name character pointer, null terminated.
	 * @param sectname Section name character pointer, null terminated.
	 * @returns Section or null.
	 */
	public findSection(
		segname: ArrayBufferLike | BufferPointer,
		sectname: ArrayBufferLike | BufferPointer,
	): Const<Section> | Const<Section64> | null {
		const seg = this.findSegment(segname);
		if (!seg) {
			return null;
		}
		const S = this.m64 ? Section64 : Section;
		const SL = S.BYTE_LENGTH;
		const { byteLength, littleEndian, nsects } = seg;
		if (byteLength + (nsects * SL) > seg.cmdsize) {
			return null;
		}
		let buffer, byteOffset;
		if ('buffer' in sectname) {
			buffer = sectname.buffer;
			byteOffset = sectname.byteOffset;
		} else {
			buffer = sectname;
			byteOffset = 0;
		}
		const sn = new Int8Ptr(buffer, byteOffset);
		const SNL = getByteLength(S, 'sectname');
		for (let n = nsects, o = seg.byteOffset + byteLength; n--; o += SL) {
			const sect = new S(seg.buffer, o, littleEndian);
			if (!strncmp(sect.sectname, sn, SNL)) {
				return sect;
			}
		}
		return null;
	}

	/**
	 * Get string from load command union.
	 * Failed bounds check may return null, not throw.
	 * Reading out of bounds may still throw exception.
	 *
	 * @param cmd Load command holding string.
	 * @param str String within load command.
	 * @returns String pointer or null.
	 */
	public string(
		cmd: Const<LoadCommand>,
		str: Const<LcStr>,
	): Const<Int8Ptr> | null {
		const { offset } = str;
		const sp = new Int8Ptr(
			cmd.buffer,
			cmd.byteOffset + offset,
			cmd.littleEndian,
		);
		if (offset + strlen(sp) + 1 > cmd.cmdsize) {
			return null;
		}
		return sp;
	}

	/**
	 * Find code signature command.
	 *
	 * @returns Code signature command or null.
	 */
	public findCodeSignature(): Const<LinkeditDataCommand> | null {
		const cmd = this.findCommand(LC_CODE_SIGNATURE);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < LinkeditDataCommand.BYTE_LENGTH) {
			throw new RangeError('Invalid command size');
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
	public findLibraryDependencies(): Const<LinkeditDataCommand> | null {
		const cmd = this.findCommand(LC_DYLIB_CODE_SIGN_DRS);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < LinkeditDataCommand.BYTE_LENGTH) {
			throw new RangeError('Invalid command size');
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
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return this.version(p, null, null) ? p[0] : 0;
	}

	/**
	 * Get minimum version.
	 *
	 * @returns Minimum version or 0.
	 */
	public minVersion(): number {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return this.version(null, p, null) ? p[0] : 0;
	}

	/**
	 * Get SDK version.
	 *
	 * @returns SDK version or 0.
	 */
	public sdkVersion(): number {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return this.version(null, null, p) ? p[0] : 0;
	}

	/**
	 * Initialize header.
	 *
	 * @param header Mach-O header data.
	 */
	protected initHeader(header: ArrayBufferLike | BufferPointer): void {
		let buffer, byteOffset;
		if ('buffer' in header) {
			buffer = header.buffer;
			byteOffset = header.byteOffset;
		} else {
			buffer = header;
			byteOffset = 0;
		}
		let mh = this.mHeader = new MachHeader(buffer, byteOffset);
		let m64 = false;
		const m = mh.magic;
		switch (m) {
			case MH_MAGIC: {
				m64 = false;
				break;
			}
			case MH_CIGAM: {
				mh = new MachHeader(buffer, byteOffset, !mh.littleEndian);
				m64 = false;
				break;
			}
			case MH_MAGIC_64: {
				mh = new MachHeader64(buffer, byteOffset);
				m64 = true;
				break;
			}
			case MH_CIGAM_64: {
				mh = new MachHeader64(buffer, byteOffset, !mh.littleEndian);
				m64 = true;
				break;
			}
			default: {
				throw new RangeError(`Unknown magic: 0x${m.toString(16)}`);
			}
		}
		this.mHeader = mh;
		this.m64 = m64;
		this.mFlip = mh.littleEndian !== LITTLE_ENDIAN;
	}

	/**
	 * Initialize commands.
	 *
	 * @param commands Mach-O commands data.
	 */
	protected initCommands(commands: ArrayBufferLike | BufferPointer): void {
		let buffer, byteOffset;
		if ('buffer' in commands) {
			buffer = commands.buffer;
			byteOffset = commands.byteOffset;
		} else {
			buffer = commands;
			byteOffset = 0;
		}
		const mHeader = this.mHeader!;
		const mCommands = this.mCommands = new LoadCommand(
			buffer,
			byteOffset,
			mHeader.littleEndian,
		);
		const mEndCommands = this.mEndCommands = byteOffset +
			mHeader.sizeofcmds;
		if (byteOffset + mCommands.byteLength > mEndCommands) {
			throw new RangeError('Invalid commands size');
		}
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
	protected findMinVersion(): Const<VersionMinCommand> | null {
		for (let c = this.loadCommands(); c; c = this.nextCommand(c)) {
			switch (c.cmd) {
				case LC_VERSION_MIN_MACOSX:
				case LC_VERSION_MIN_IPHONEOS:
				case LC_VERSION_MIN_WATCHOS:
				case LC_VERSION_MIN_TVOS: {
					if (c.cmdsize < VersionMinCommand.BYTE_LENGTH) {
						throw new RangeError('Invalid command size');
					}
					return new VersionMinCommand(
						c.buffer,
						c.byteOffset,
						c.littleEndian,
					);
				}
			}
		}
		return null;
	}

	/**
	 * Find build version command.
	 *
	 * @returns Build version command or null.
	 */
	protected findBuildVersion(): Const<BuildVersionCommand> | null {
		for (let c = this.loadCommands(); c; c = this.nextCommand(c)) {
			if (c.cmd === LC_BUILD_VERSION) {
				if (c.cmdsize < BuildVersionCommand.BYTE_LENGTH) {
					throw new RangeError('Invalid command size');
				}
				return new BuildVersionCommand(
					c.buffer,
					c.byteOffset,
					c.littleEndian,
				);
			}
		}
		return null;
	}
}
