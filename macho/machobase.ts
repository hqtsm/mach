import {
	type BufferPointer,
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

function strneq(s1: Int8Ptr, s2: Int8Ptr, n: number): boolean {
	for (let i = 0; i < n; i++) {
		const a = s1[i];
		const b = s2[i];
		if (!a && !b) {
			return true;
		}
		if (a !== b) {
			return false;
		}
	}
	return true;
}

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
	 * The end commands offset, from start of commands.
	 */
	private mEndCommands = 0;

	/**
	 * Create Mach-O base instance.
	 */
	constructor() {}

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
		segname: BufferPointer,
	): SegmentCommand | SegmentCommand64 | null {
		const sn = new Int8Ptr(segname.buffer, segname.byteOffset);
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
				throw new Error('Invalid command size');
			}
			const seg = new SC(c.buffer, c.byteOffset, c.littleEndian);
			if (strneq(seg.segname, sn, getByteLength(SC, 'segname'))) {
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
		segname: BufferPointer,
		sectname: BufferPointer,
	): Section | Section64 | null {
		const seg = this.findSegment(segname);
		if (!seg) {
			return null;
		}
		const S = this.m64 ? Section64 : Section;
		const SL = S.BYTE_LENGTH;
		const { buffer, byteLength, littleEndian, nsects } = seg;
		if (byteLength + (nsects * SL) > seg.cmdsize) {
			return null;
		}
		const sn = new Int8Ptr(sectname.buffer, sectname.byteOffset);
		const SNL = getByteLength(S, 'sectname');
		for (let n = nsects, o = seg.byteOffset + byteLength; n--; o += SL) {
			const sect = new S(buffer, o, littleEndian);
			if (strneq(sect.sectname, sn, SNL)) {
				return sect;
			}
		}
		return null;
	}

	/**
	 * Get string from load command union.
	 * Failed bounds check will return null (no exception).
	 * Reading out-of-bounds may still throw exception.
	 *
	 * @param cmd Load command holding string union.
	 * @param str String union within load command.
	 * @returns String pointer or null.
	 */
	public string(cmd: LoadCommand, str: LcStr): Int8Ptr | null {
		const { offset } = str;
		const sp = new Int8Ptr(
			cmd.buffer,
			cmd.byteOffset + offset,
			cmd.littleEndian,
		);
		let size = 0;
		while (sp[size++]);
		if (offset + size > cmd.cmdsize) {
			return null;
		}
		return sp;
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
			throw new Error('Invalid command size');
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
			throw new Error('Invalid command size');
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
		const mHeader = this.mHeader!;
		const lc = this.mCommands = new LoadCommand(
			commands.buffer,
			commands.byteOffset,
			mHeader.littleEndian,
		);
		this.mEndCommands = lc.byteOffset + mHeader.sizeofcmds;
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
		for (let c = this.loadCommands(); c; c = this.nextCommand(c)) {
			switch (c.cmd) {
				case LC_VERSION_MIN_MACOSX:
				case LC_VERSION_MIN_IPHONEOS:
				case LC_VERSION_MIN_WATCHOS:
				case LC_VERSION_MIN_TVOS: {
					if (c.cmdsize < VersionMinCommand.BYTE_LENGTH) {
						throw new Error('Invalid command size');
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
	protected findBuildVersion(): BuildVersionCommand | null {
		for (let c = this.loadCommands(); c; c = this.nextCommand(c)) {
			if (c.cmd === LC_BUILD_VERSION) {
				if (c.cmdsize < BuildVersionCommand.BYTE_LENGTH) {
					throw new Error('Invalid command size');
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
