import { toStringTag } from '@hqtsm/class';
import {
	type ArrayBufferPointer,
	type Const,
	getByteLength,
	Int8Ptr,
	LITTLE_ENDIAN,
	pointer,
	type Ptr,
	Uint32Ptr,
} from '@hqtsm/struct';
import { EIO, ENOEXEC } from '../libc/errno.ts';
import { strlen, strncmp } from '../libc/string.ts';
import {
	CPU_ARCH_ABI64,
	CPU_SUBTYPE_MASK,
	CPU_SUBTYPE_MULTIPLE,
	CPU_TYPE_ARM,
} from '../mach/machine.ts';
import { PAGE_MASK_ARM64 } from '../mach/vm_param.ts';
import {
	fat_arch,
	type fat_arch_64,
	FAT_CIGAM,
	fat_header,
	FAT_MAGIC,
} from '../mach-o/fat.ts';
import {
	build_version_command,
	LC_BUILD_VERSION,
	LC_CODE_SIGNATURE,
	LC_DYLIB_CODE_SIGN_DRS,
	LC_SEGMENT,
	LC_SEGMENT_64,
	type lc_str,
	LC_SYMTAB,
	LC_VERSION_MIN_IPHONEOS,
	LC_VERSION_MIN_MACOSX,
	LC_VERSION_MIN_TVOS,
	LC_VERSION_MIN_WATCHOS,
	linkedit_data_command,
	load_command,
	mach_header,
	mach_header_64,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
	PLATFORM_IOS,
	PLATFORM_MACOS,
	PLATFORM_TVOS,
	PLATFORM_WATCHOS,
	section,
	section_64,
	SEG_LINKEDIT,
	segment_command,
	segment_command_64,
	symtab_command,
	version_min_command,
} from '../mach-o/loader.ts';
import type { Reader } from '../util/reader.ts';
import { MacOSError, UnixError } from './errors.ts';
import { errSecInternalError } from './SecBase.ts';

/**
 * Maximum number of architectures fat binaries can have.
 */
export const MAX_ARCH_COUNT = 100;

/**
 * Maximum power of 2 a Mach-O can have.
 */
export const MAX_ALIGN = 30;

/**
 * Architecture specification.
 */
export class Architecture {
	/**
	 * CPU type.
	 */
	public first: number;

	/**
	 * CPU subtype.
	 */
	public second: number;

	/**
	 * Create architecture.
	 */
	constructor();

	/**
	 * Create architecture with CPU type and subtype.
	 *
	 * @param type CPU type.
	 * @param sub CPU subtype, defaults to `CPU_SUBTYPE_MULTIPLE`.
	 */
	constructor(type: number, sub?: number | null);

	/**
	 * Create architecture from fat architecture struct.
	 *
	 * @param archInFile Fat struct.
	 */
	constructor(archInFile: fat_arch | fat_arch_64);

	/**
	 * Create architecture with CPU type and subtype.
	 *
	 * @param type CPU type or fat architecture.
	 * @param sub CPU subtype.
	 */
	constructor(
		type?: number | fat_arch | fat_arch_64,
		sub?: number,
	) {
		switch (typeof type) {
			case 'undefined': {
				this.first = 0;
				this.second = 0;
				break;
			}
			case 'number': {
				this.first = type;
				this.second = sub ?? CPU_SUBTYPE_MULTIPLE;
				break;
			}
			default: {
				this.first = type.cputype;
				this.second = type.cpusubtype;
			}
		}
	}

	/**
	 * CPU type.
	 *
	 * @param _this This.
	 * @returns Type ID.
	 */
	public static cpuType(_this: Architecture): number {
		return _this.first;
	}

	/**
	 * CPU subtype.
	 *
	 * @param _this This.
	 * @returns Masked subtype ID.
	 */
	public static cpuSubtype(_this: Architecture): number {
		return _this.second & ~CPU_SUBTYPE_MASK;
	}

	/**
	 * Full CPU subtype.
	 *
	 * @param _this This.
	 * @returns Full subtype ID.
	 */
	public static cpuSubtypeFull(_this: Architecture): number {
		return _this.second;
	}

	/**
	 * Is architecture valid.
	 *
	 * @param _this This.
	 * @returns Is valid.
	 */
	public static bool(_this: Architecture): boolean {
		return !!_this.first;
	}

	/**
	 * If architectures are equal.
	 *
	 * @param a1 Architecture A.
	 * @param a2 Architecture B.
	 * @returns Is equal.
	 */
	public static equals(a1: Architecture, a2: Architecture): boolean {
		return a1.first === a2.first && a1.second === a2.second;
	}

	/**
	 * If architecture is less than another.
	 *
	 * @param a1 Architecture A.
	 * @param a2 Architecture B.
	 * @returns Is less than.
	 */
	public static lessThan(a1: Architecture, a2: Architecture): boolean {
		const x = a1.first;
		const y = a2.first;
		return x < y || (!(y < x) && a1.second < a2.second);
	}

	/**
	 * Check is architecture matches template, asymmetric comparison.
	 *
	 * @param _this This.
	 * @param templ Template architecture.
	 * @returns Matches template.
	 */
	public static matches(_this: Architecture, templ: Architecture): boolean {
		if (_this.first !== templ.first) {
			return false;
		}
		if (templ.second === CPU_SUBTYPE_MULTIPLE) {
			return true;
		}
		return !((_this.second ^ templ.second) & ~CPU_SUBTYPE_MASK);
	}

	static {
		toStringTag(this, 'Architecture');
	}
}

/**
 * Common interface of Mach-O binaries features.
 */
export class MachOBase {
	/**
	 * Mach-O header.
	 */
	private mHeader: mach_header | mach_header_64 | null = null;

	/**
	 * Mach-O commands.
	 */
	private mCommands: load_command | null = null;

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
	 * @param _this This.
	 * @returns True if flipped, false if not.
	 */
	public static isFlipped(_this: MachOBase): boolean {
		return _this.mFlip;
	}

	/**
	 * If binary is 64-bit.
	 *
	 * @param _this This.
	 * @returns True if 64-bit, false if 32-bit.
	 */
	public static is64(_this: MachOBase): boolean {
		return _this.m64;
	}

	/**
	 * Get Mach-O header.
	 *
	 * @param _this This.
	 * @returns Header or null.
	 */
	public static header(
		_this: MachOBase,
	): mach_header | mach_header_64 | null {
		return _this.mHeader;
	}

	/**
	 * Get architecture from header.
	 *
	 * @param _this This.
	 * @returns Architecture.
	 */
	public static architecture(_this: MachOBase): Architecture {
		const mHeader = _this.mHeader!;
		return new Architecture(mHeader.cputype, mHeader.cpusubtype);
	}

	/**
	 * Get file type from header.
	 *
	 * @param _this This.
	 * @returns File type.
	 */
	public static type(_this: MachOBase): number {
		return _this.mHeader!.filetype;
	}

	/**
	 * Get flags from header.
	 *
	 * @param _this This.
	 * @returns Flags.
	 */
	public static flags(_this: MachOBase): number {
		return _this.mHeader!.flags;
	}

	/**
	 * Get load commands.
	 *
	 * @param _this This.
	 * @returns Load commands pointer or null.
	 */
	public static loadCommands(_this: MachOBase): load_command | null {
		return _this.mCommands;
	}

	/**
	 * Get next load command.
	 *
	 * @param _this This.
	 * @param command Current load command.
	 * @returns Next load command or null.
	 */
	public static nextCommand(
		_this: MachOBase,
		command: load_command,
	): load_command | null {
		const { cmdsize } = command;
		if (!cmdsize) {
			UnixError.throwMe(ENOEXEC);
		}
		const { mEndCommands } = _this;
		const byteOffset = command.byteOffset + cmdsize;
		if (byteOffset >= mEndCommands) {
			return null;
		}
		if (byteOffset + load_command.BYTE_LENGTH > mEndCommands) {
			UnixError.throwMe(ENOEXEC);
		}
		command = new load_command(
			command.buffer,
			byteOffset,
			command.littleEndian,
		);
		if (byteOffset + command.cmdsize > mEndCommands) {
			UnixError.throwMe(ENOEXEC);
		}
		return command;
	}

	/**
	 * Get command length.
	 *
	 * @returns Byte length of commands.
	 */
	public static commandLength(_this: MachOBase): number {
		return _this.mHeader!.sizeofcmds;
	}

	/**
	 * Find load command by type.
	 *
	 * @param _this This.
	 * @param cmd Command type.
	 * @returns Load command or null.
	 */
	public static findCommand(
		_this: MachOBase,
		cmd: number,
	): load_command | null {
		for (
			let c = MachOBase.loadCommands(_this);
			c;
			c = MachOBase.nextCommand(_this, c)
		) {
			if (c.cmd === cmd) {
				return c;
			}
		}
		return null;
	}

	/**
	 * Find segment by name.
	 *
	 * @param _this This.
	 * @param segname Segment name character pointer, null terminated.
	 * @returns Segment command or null.
	 */
	public static findSegment(
		_this: MachOBase,
		segname: ArrayBufferLike | ArrayBufferPointer,
	): segment_command | segment_command_64 | null {
		let buffer, byteOffset;
		if ('buffer' in segname) {
			buffer = segname.buffer;
			byteOffset = segname.byteOffset;
		} else {
			buffer = segname;
			byteOffset = 0;
		}
		const sn = new Int8Ptr(buffer, byteOffset);
		let SC: typeof segment_command | typeof segment_command_64 | null;
		for (
			let c = MachOBase.loadCommands(_this);
			c;
			c = MachOBase.nextCommand(_this, c)
		) {
			switch (c.cmd) {
				case LC_SEGMENT: {
					SC = segment_command;
					break;
				}
				case LC_SEGMENT_64: {
					SC = segment_command_64;
					break;
				}
				default: {
					continue;
				}
			}
			if (c.cmdsize < SC.BYTE_LENGTH) {
				UnixError.throwMe(ENOEXEC);
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
	 * @param _this This.
	 * @param segname Segment name character pointer, null terminated.
	 * @param sectname Section name character pointer, null terminated.
	 * @returns Section or null.
	 */
	public static findSection(
		_this: MachOBase,
		segname: ArrayBufferLike | ArrayBufferPointer,
		sectname: ArrayBufferLike | ArrayBufferPointer,
	): section | section_64 | null {
		const seg = MachOBase.findSegment(_this, segname);
		if (!seg) {
			return null;
		}
		const S = _this.m64 ? section_64 : section;
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
	 * @param _this This.
	 * @param cmd Load command holding string.
	 * @param str String within load command.
	 * @returns String pointer or null.
	 */
	public static string(
		_this: MachOBase,
		cmd: load_command,
		str: lc_str,
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
	 * @param _this This.
	 * @returns Code signature command or null.
	 */
	public static findCodeSignature(
		_this: MachOBase,
	): linkedit_data_command | null {
		const cmd = MachOBase.findCommand(_this, LC_CODE_SIGNATURE);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < linkedit_data_command.BYTE_LENGTH) {
			UnixError.throwMe(ENOEXEC);
		}
		return new linkedit_data_command(
			cmd.buffer,
			cmd.byteOffset,
			cmd.littleEndian,
		);
	}

	/**
	 * Find code signing DRs copied from linked dylibs.
	 *
	 * @param _this This.
	 * @returns Code signing DRs command or null.
	 */
	public static findLibraryDependencies(
		_this: MachOBase,
	): linkedit_data_command | null {
		const cmd = MachOBase.findCommand(_this, LC_DYLIB_CODE_SIGN_DRS);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < linkedit_data_command.BYTE_LENGTH) {
			UnixError.throwMe(ENOEXEC);
		}
		return new linkedit_data_command(
			cmd.buffer,
			cmd.byteOffset,
			cmd.littleEndian,
		);
	}

	/**
	 * Get code signature offset.
	 *
	 * @param _this This.
	 * @returns Code signature offset, or 0.
	 */
	public static signingOffset(_this: MachOBase): number {
		const lec = MachOBase.findCodeSignature(_this);
		return lec ? lec.dataoff : 0;
	}

	/**
	 * Get code signature length.
	 *
	 * @param _this This.
	 * @returns Code signature length, or 0.
	 */
	public static signingLength(_this: MachOBase): number {
		const lec = MachOBase.findCodeSignature(_this);
		return lec ? lec.datasize : 0;
	}

	/**
	 * Get version identifer information.
	 *
	 * @param _this This.
	 * @param platform Platform.
	 * @param minVersion Minimum version.
	 * @param sdkVersion SDK version.
	 * @returns True if found, false if not.
	 */
	public static version(
		_this: MachOBase,
		platform: Uint32Ptr | null,
		minVersion: Uint32Ptr | null,
		sdkVersion: Uint32Ptr | null,
	): boolean {
		const bc = MachOBase.findBuildVersion(_this);
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

		const vc = MachOBase.findMinVersion(_this);
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
	 * @param _this This.
	 * @returns Platform or 0.
	 */
	public static platform(_this: MachOBase): number {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return MachOBase.version(_this, p, null, null) ? p[0] : 0;
	}

	/**
	 * Get minimum version.
	 *
	 * @param _this This.
	 * @returns Minimum version or 0.
	 */
	public static minVersion(_this: MachOBase): number {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return MachOBase.version(_this, null, p, null) ? p[0] : 0;
	}

	/**
	 * Get SDK version.
	 *
	 * @param _this This.
	 * @returns SDK version or 0.
	 */
	public static sdkVersion(_this: MachOBase): number {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return MachOBase.version(_this, null, null, p) ? p[0] : 0;
	}

	/**
	 * Initialize header.
	 *
	 * @param _this This.
	 * @param header Mach-O header data.
	 */
	protected static initHeader(
		_this: MachOBase,
		header: ArrayBufferLike | ArrayBufferPointer,
	): void {
		let buffer, byteOffset;
		if ('buffer' in header) {
			buffer = header.buffer;
			byteOffset = header.byteOffset;
		} else {
			buffer = header;
			byteOffset = 0;
		}
		let mh = _this.mHeader = new mach_header(buffer, byteOffset);
		let m64 = false;
		const m = mh.magic;
		switch (m) {
			case MH_MAGIC: {
				m64 = false;
				break;
			}
			case MH_CIGAM: {
				mh = new mach_header(buffer, byteOffset, !mh.littleEndian);
				m64 = false;
				break;
			}
			case MH_MAGIC_64: {
				mh = new mach_header_64(buffer, byteOffset);
				m64 = true;
				break;
			}
			case MH_CIGAM_64: {
				mh = new mach_header_64(buffer, byteOffset, !mh.littleEndian);
				m64 = true;
				break;
			}
			default: {
				UnixError.throwMe(ENOEXEC);
			}
		}
		_this.mHeader = mh;
		_this.m64 = m64;
		_this.mFlip = mh.littleEndian !== LITTLE_ENDIAN;
	}

	/**
	 * Initialize commands.
	 *
	 * @param _this This.
	 * @param commands Mach-O commands data.
	 */
	protected static initCommands(
		_this: MachOBase,
		commands: ArrayBufferLike | ArrayBufferPointer,
	): void {
		let buffer, byteOffset;
		if ('buffer' in commands) {
			buffer = commands.buffer;
			byteOffset = commands.byteOffset;
		} else {
			buffer = commands;
			byteOffset = 0;
		}
		const mHeader = _this.mHeader!;
		const mCommands = _this.mCommands = new load_command(
			buffer,
			byteOffset,
			mHeader.littleEndian,
		);
		const mEndCommands = _this.mEndCommands = byteOffset +
			mHeader.sizeofcmds;
		if (byteOffset + mCommands.byteLength > mEndCommands) {
			UnixError.throwMe(ENOEXEC);
		}
	}

	/**
	 * Size of header.
	 *
	 * @param _this This.
	 * @returns Byte length of header.
	 */
	protected static headerSize(_this: MachOBase): number {
		return _this.m64 ? mach_header_64.BYTE_LENGTH : mach_header.BYTE_LENGTH;
	}

	/**
	 * Size of commands.
	 *
	 * @param _this This.
	 * @returns Byte length of commands.
	 */
	protected static commandSize(_this: MachOBase): number {
		return _this.mHeader!.sizeofcmds;
	}

	/**
	 * Find minimum version command.
	 *
	 * @param _this This.
	 * @returns Minimum version command or null.
	 */
	protected static findMinVersion(
		_this: MachOBase,
	): version_min_command | null {
		for (
			let c = MachOBase.loadCommands(_this);
			c;
			c = MachOBase.nextCommand(_this, c)
		) {
			switch (c.cmd) {
				case LC_VERSION_MIN_MACOSX:
				case LC_VERSION_MIN_IPHONEOS:
				case LC_VERSION_MIN_WATCHOS:
				case LC_VERSION_MIN_TVOS: {
					if (c.cmdsize < version_min_command.BYTE_LENGTH) {
						UnixError.throwMe(ENOEXEC);
					}
					return new version_min_command(
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
	 * @param _this This.
	 * @returns Build version command or null.
	 */
	protected static findBuildVersion(
		_this: MachOBase,
	): build_version_command | null {
		for (
			let c = MachOBase.loadCommands(_this);
			c;
			c = MachOBase.nextCommand(_this, c)
		) {
			if (c.cmd === LC_BUILD_VERSION) {
				if (c.cmdsize < build_version_command.BYTE_LENGTH) {
					UnixError.throwMe(ENOEXEC);
				}
				return new build_version_command(
					c.buffer,
					c.byteOffset,
					c.littleEndian,
				);
			}
		}
		return null;
	}

	static {
		toStringTag(this, 'MachOBase');
	}
}

/**
 * A Mach-O binary over a reader.
 */
export class MachO extends MachOBase {
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
	): Promise<this> {
		this.mReader = reader;
		this.mOffset = offset;
		const mLength = this.mLength = offset ? length : reader.size;
		this.mSuspicious = false;

		const hs = mach_header.BYTE_LENGTH;
		const header = await reader.slice(offset, offset + hs).arrayBuffer();
		if (header.byteLength !== hs) {
			UnixError.throwMe(ENOEXEC);
		}
		MachO.initHeader(this, header);
		offset += hs;

		const fhs = MachO.headerSize(this);
		const more = fhs - hs;
		if (more > 0) {
			const d = await reader.slice(offset, offset + more).arrayBuffer();
			if (d.byteLength !== more) {
				UnixError.throwMe(ENOEXEC);
			}
			const full = new Uint8Array(fhs);
			full.set(new Uint8Array(header));
			full.set(new Uint8Array(d), hs);
			MachO.initHeader(this, full);
			offset += more;
		}

		const cs = MachO.commandSize(this);
		const commands = await reader.slice(offset, offset + cs).arrayBuffer();
		if (commands.byteLength !== cs) {
			UnixError.throwMe(ENOEXEC);
		}
		MachO.initCommands(this, commands);

		if (mLength) {
			MachO.validateStructure(this);
		}
		return this;
	}

	/**
	 * Is a binary open.
	 *
	 * @param _this This.
	 * @returns Is open.
	 */
	public static isOpen(_this: MachO): boolean {
		return !!_this.mReader;
	}

	/**
	 * Get binary offset.
	 *
	 * @param _this This.
	 * @returns Offset in reader.
	 */
	public static offset(_this: MachO): number {
		return _this.mOffset;
	}

	/**
	 * Get binary length.
	 *
	 * @param _this This.
	 * @returns Length in reader.
	 */
	public static size(_this: MachO): number {
		return _this.mLength;
	}

	/**
	 * Get signing extent.
	 *
	 * @param _this This.
	 * @returns Signing offset or file length if none.
	 */
	public static signingExtent(_this: MachO): number {
		return MachO.signingOffset(_this) || MachO.size(_this);
	}

	/**
	 * Read data at offset.
	 *
	 * @param _this This.
	 * @param offset Offset in reader.
	 * @param size Size to read.
	 * @returns Data.
	 */
	public static async dataAt(
		_this: MachO,
		offset: number,
		size: number,
	): Promise<ArrayBuffer> {
		const o = _this.mOffset + offset;
		const data = await _this.mReader!.slice(o, o + size).arrayBuffer();
		if (data.byteLength !== size) {
			UnixError.throwMe(EIO);
		}
		return data;
	}

	/**
	 * Validate structure of binary.
	 *
	 * @param _this This.
	 */
	public static validateStructure(_this: MachO): void {
		let isValid = false;

		const segLinkedit = new Uint8Array(SEG_LINKEDIT.length + 1);
		for (let i = SEG_LINKEDIT.length; i--;) {
			segLinkedit[i] = SEG_LINKEDIT.charCodeAt(i);
		}

		LOOP: for (
			let cmd = MachO.loadCommands(_this);
			cmd;
			cmd = MachO.nextCommand(_this, cmd)
		) {
			switch (cmd.cmd) {
				case LC_SEGMENT: {
					if (cmd.cmdsize < segment_command.BYTE_LENGTH) {
						UnixError.throwMe(ENOEXEC);
					}
					const seg = new segment_command(
						cmd.buffer,
						cmd.byteOffset,
						cmd.littleEndian,
					);
					if (
						!strncmp(
							seg.segname,
							segLinkedit,
							getByteLength(segment_command, 'segname'),
						)
					) {
						isValid = seg.fileoff + seg.filesize ===
							MachO.size(_this);
						break LOOP;
					}
					break;
				}
				case LC_SEGMENT_64: {
					if (cmd.cmdsize < segment_command_64.BYTE_LENGTH) {
						UnixError.throwMe(ENOEXEC);
					}
					const seg64 = new segment_command_64(
						cmd.buffer,
						cmd.byteOffset,
						cmd.littleEndian,
					);
					if (
						!strncmp(
							seg64.segname,
							segLinkedit,
							getByteLength(segment_command_64, 'segname'),
						)
					) {
						isValid = Number(seg64.fileoff + seg64.filesize) ===
							MachO.size(_this);
						break LOOP;
					}
					break;
				}
				case LC_SYMTAB: {
					if (cmd.cmdsize < symtab_command.BYTE_LENGTH) {
						UnixError.throwMe(ENOEXEC);
					}
					const symtab = new symtab_command(
						cmd.buffer,
						cmd.byteOffset,
						cmd.littleEndian,
					);
					isValid = symtab.stroff + symtab.strsize ===
						MachO.size(_this);
					break LOOP;
				}
			}
		}

		if (!isValid) {
			_this.mSuspicious = true;
		}
	}

	/**
	 * Check if binary structure is suspicious.
	 *
	 * @param _this This.
	 * @returns Is suspicious.
	 */
	public static isSuspicious(_this: MachO): boolean {
		return _this.mSuspicious;
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

	static {
		toStringTag(this, 'MachO');
	}
}

/**
 * A Mach-O binary over a buffer.
 */
export class MachOImage extends MachOBase {
	/**
	 * Construct a Mach-O binary over a buffer.
	 *
	 * @param address Buffer pointer.
	 */
	constructor(address: ArrayBufferLike | ArrayBufferPointer) {
		super();

		MachOImage.initHeader(this, address);

		let buffer;
		let byteOffset = MachOImage.headerSize(this);
		if ('buffer' in address) {
			buffer = address.buffer;
			byteOffset += address.byteOffset;
		} else {
			buffer = address;
		}
		MachOImage.initCommands(this, {
			buffer,
			byteOffset,
		});
	}

	/**
	 * Get address of Mach-O.
	 *
	 * @param _this This.
	 * @returns Pionter to Mach-O header.
	 */
	public static address(_this: MachOImage): ArrayBufferPointer {
		return MachOImage.header(_this)!;
	}

	static {
		toStringTag(this, 'MachOImage');
	}
}

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
	 * Architecture list, if fat.
	 */
	private mArchList: Ptr<fat_arch> | null = null;

	/**
	 * Architecture count, if fat.
	 */
	private mArchCount = 0;

	/**
	 * Single architecture, if thin.
	 */
	private mThinArch: Architecture | null = null;

	/**
	 * Offset in reader.
	 */
	private mBase = 0;

	/**
	 * Length in reader, if thin.
	 */
	private mLength = 0;

	/**
	 * Length of slice at each offset.
	 */
	private mSizes: Map<number, number> = new Map();

	/**
	 * Mach type.
	 */
	private mMachType = 0;

	/**
	 * Suspicious flag.
	 */
	private mSuspicious = false;

	/**
	 * Create uninitialized Universal instance.
	 */
	protected constructor() {}

	/**
	 * Initialize instance.
	 *
	 * @param reader Reader.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection.
	 * @returns This instance.
	 */
	protected async Universal(
		reader: Reader,
		offset = 0,
		length = 0,
	): Promise<this> {
		this.mReader = reader;
		this.mBase = offset;
		this.mLength = length;
		this.mMachType = 0;
		let mSuspicious = this.mSuspicious = false;
		this.mArchList = null;
		this.mArchCount = 0;
		this.mThinArch = null;
		const mSizes = this.mSizes;
		mSizes.clear();

		const hs = Math.max(fat_header.BYTE_LENGTH, mach_header.BYTE_LENGTH);
		const hd = await reader.slice(offset, offset + hs).arrayBuffer();
		if (hd.byteLength !== hs) {
			UnixError.throwMe(ENOEXEC);
		}

		let header = new fat_header(hd);
		let mHeader;
		const m = header.magic;
		switch (m) {
			case FAT_CIGAM:
				header = new fat_header(hd, 0, !header.littleEndian);
				// Falls through.
			case FAT_MAGIC: {
				// In some cases the fat header may be 1 less than needed.
				// Something about "15001604" whatever that is.
				let mArchCount = this.mArchCount = header.nfat_arch;
				if (mArchCount > MAX_ARCH_COUNT) {
					UnixError.throwMe(ENOEXEC);
				}

				// Read enough for 1 extra arch.
				const archSize = fat_arch.BYTE_LENGTH * (mArchCount + 1);
				const archOffset = offset + header.byteLength;
				const archData = await reader
					.slice(archOffset, archOffset + archSize)
					.arrayBuffer();
				if (archData.byteLength !== archSize) {
					UnixError.throwMe(ENOEXEC);
				}
				const mArchList = this.mArchList = new (pointer(fat_arch))(
					archData,
					0,
					header.littleEndian,
				);

				// Detect possibly undercounted architecture.
				const lastArch = mArchList[mArchCount];
				if (lastArch.cputype === (CPU_ARCH_ABI64 | CPU_TYPE_ARM)) {
					this.mArchCount = mArchCount = ++mArchCount;
				}

				// Padding between header and slices should all be zeroed out.
				const sortedList = [];
				for (let i = 0; i < mArchCount; i++) {
					sortedList.push(mArchList[i]);
				}
				sortedList.sort((a, b) => a.offset - b.offset);

				const universalHeaderEnd = offset + header.byteLength +
					(fat_arch.BYTE_LENGTH * mArchCount);
				let prevHeaderEnd = universalHeaderEnd;
				let prevArchSize = 0;
				let prevArchStart = 0;

				for (const { offset, size, align } of sortedList) {
					if (mSizes.has(offset)) {
						MacOSError.throwMe(errSecInternalError);
					}
					mSizes.set(offset, size);

					const gapSize = offset - prevHeaderEnd;
					if (
						prevHeaderEnd !== universalHeaderEnd &&
						(align > MAX_ALIGN || gapSize >= (1 << align))
					) {
						this.mSuspicious = mSuspicious = true;
						break;
					}

					let off = 0;
					GAPS: while (off < gapSize) {
						const want = Math.min(gapSize - off, PAGE_MASK_ARM64);
						const readOffset = prevHeaderEnd + off;
						// deno-lint-ignore no-await-in-loop
						const read = await reader
							.slice(readOffset, readOffset + want)
							.arrayBuffer();
						const got = read.byteLength;
						if (!got) {
							this.mSuspicious = mSuspicious = true;
							break;
						}
						off += got;
						const gapBytes = new Uint8Array(read);
						for (let x = 0; x < got; x++) {
							if (gapBytes[x]) {
								this.mSuspicious = mSuspicious = true;
								break GAPS;
							}
						}
					}
					if (off !== gapSize) {
						this.mSuspicious = mSuspicious = true;
					}
					if (mSuspicious) {
						break;
					}

					prevHeaderEnd = offset + size;
					prevArchSize = size;
					prevArchStart = offset;
				}

				if (
					!mSuspicious &&
					(prevArchStart + prevArchSize !== reader.size)
				) {
					this.mSuspicious = true;
				}
				break;
			}
			case MH_CIGAM:
			case MH_CIGAM_64:
				mHeader = new mach_header(hd, 0, !header.littleEndian);
				// Falls through.
			case MH_MAGIC:
			case MH_MAGIC_64: {
				mHeader ??= new mach_header(hd);
				this.mThinArch = new Architecture(
					mHeader.cputype,
					mHeader.cpusubtype,
				);
				break;
			}
			default: {
				UnixError.throwMe(ENOEXEC);
			}
		}
		return this;
	}

	/**
	 * Get Mach-O for architecture.
	 *
	 * @param _this This.
	 * @param arch Architecture to get.
	 * @returns Mach-O.
	 */
	public static async architecture(
		_this: Universal,
		arch: Architecture,
	): Promise<MachO>;

	/**
	 * Get Mach-O for offset.
	 *
	 * @param _this This.
	 * @param arch Offset of binary.
	 * @returns Mach-O.
	 */
	public static async architecture(
		_this: Universal,
		offset: number,
	): Promise<MachO>;

	/**
	 * Get Mach-O for architecture or offset.
	 *
	 * @param _this This.
	 * @param a Architecture or offset.
	 * @returns Mach-O.
	 */
	public static async architecture(
		_this: Universal,
		a: Architecture | number,
	): Promise<MachO> {
		if (typeof a === 'number') {
			if (Universal.isUniversal(_this)) {
				const length = Universal.lengthOfSlice(_this, a);
				return Universal.make(
					_this,
					await MachO.MachO(_this.mReader!, a, length),
				);
			}
			if (a === _this.mBase) {
				return MachO.MachO(_this.mReader!);
			}
		} else {
			if (Universal.isUniversal(_this)) {
				return Universal.findImage(_this, a);
			}
			if (Architecture.matches(a, _this.mThinArch!)) {
				return MachO.MachO(_this.mReader!, _this.mBase, _this.mLength);
			}
		}
		UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Get offset or architecture.
	 *
	 * @param _this This.
	 * @param arch Architecture to get the offset of.
	 * @returns Architecture offset.
	 */
	public static archOffset(_this: Universal, arch: Architecture): number {
		if (Universal.isUniversal(_this)) {
			return _this.mBase + Universal.findArch(_this, arch).offset;
		}
		if (Architecture.matches(_this.mThinArch!, arch)) {
			return 0;
		}
		UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Get length of architecture.
	 *
	 * @param _this This.
	 * @param arch Architecture to get the length of.
	 * @returns Architecture length.
	 */
	public static archLength(_this: Universal, arch: Architecture): number {
		if (Universal.isUniversal(_this)) {
			return _this.mBase + Universal.findArch(_this, arch).size;
		}
		if (Architecture.matches(_this.mThinArch!, arch)) {
			return _this.mReader!.size;
		}
		UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Is part of a FAT file.
	 *
	 * @param _this This.
	 * @returns Narrowed range or not.
	 */
	public static narrowed(_this: Universal): boolean {
		return !!_this.mBase;
	}

	/**
	 * Get set of architectures.
	 *
	 * @param _this This.
	 * @param archs Set of architectures to populate into.
	 */
	public static architectures(
		_this: Universal,
		archs: Set<Architecture>,
	): void {
		const skip = new Set<string>();
		for (const a of archs) {
			skip.add(`${a.first}:${a.second}`);
		}
		if (Universal.isUniversal(_this)) {
			const mArchList = _this.mArchList!;
			for (let i = 0; i < _this.mArchCount; i++) {
				const { cputype, cpusubtype } = mArchList[i];
				if (!skip.has(`${cputype}:${cpusubtype}`)) {
					archs.add(new Architecture(cputype, cpusubtype));
				}
			}
		} else {
			const { first, second } = _this.mThinArch!;
			if (!skip.has(`${first}:${second}`)) {
				archs.add(new Architecture(first, second));
			}
		}
	}

	/**
	 * Is a universal binary.
	 *
	 * @param _this This.
	 * @returns True if universal, even if only 1 architecture.
	 */
	public static isUniversal(_this: Universal): boolean {
		return !!_this.mArchList;
	}

	/**
	 * Get length of slice at offset.
	 *
	 * @param _this This.
	 * @param offset Slice offset.
	 * @returns Slice length.
	 */
	public static lengthOfSlice(_this: Universal, offset: number): number {
		const value = _this.mSizes.get(offset);
		if (value === undefined) {
			MacOSError.throwMe(errSecInternalError);
		}
		return value;
	}

	/**
	 * Get offset in reader.
	 *
	 * @param _this This.
	 * @returns Byte offset in reader.
	 */
	public static offset(_this: Universal): number {
		return _this.mBase;
	}

	/**
	 * Get length in reader.
	 *
	 * @param _this This.
	 * @returns Byte length in reader.
	 */
	public static size(_this: Universal): number {
		return _this.mLength;
	}

	/**
	 * Check if FAT binary is suspicious.
	 *
	 * @param _this This.
	 * @returns Is suspicious.
	 */
	public static isSuspicious(_this: Universal): boolean {
		return _this.mSuspicious;
	}

	/**
	 * Find matching architecture in FAT file architecture list.
	 *
	 * @param _this This.
	 * @param arch Architecture to find.
	 * @returns Matching FAT architecture.
	 */
	private static findArch(_this: Universal, arch: Architecture): fat_arch {
		const { mArchList, mArchCount } = _this;
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Architecture.cpuType(arch) &&
				a.cpusubtype === Architecture.cpuSubtypeFull(arch)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Architecture.cpuType(arch) &&
				(a.cpusubtype & ~CPU_SUBTYPE_MASK) ===
					Architecture.cpuSubtype(arch)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Architecture.cpuType(arch) &&
				!(a.cpusubtype & ~CPU_SUBTYPE_MASK)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (a.cputype === Architecture.cpuType(arch)) {
				return a;
			}
		}
		UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Find Mach-O image for architecture.
	 *
	 * @param _this This.
	 * @param target Architecture.
	 * @returns Mach-O image.
	 */
	private static async findImage(
		_this: Universal,
		target: Architecture,
	): Promise<MachO> {
		const arch = Universal.findArch(_this, target);
		return Universal.make(
			_this,
			await MachO.MachO(
				_this.mReader!,
				_this.mBase + arch.offset,
				arch.size,
			),
		);
	}

	/**
	 * Validate type of Mach-O.
	 *
	 * @param macho Mach-O instance.
	 * @returns Mach-O instance.
	 */
	private static make(_this: Universal, macho: MachO): MachO {
		const type = MachO.type(macho);
		if (!type) {
			UnixError.throwMe(ENOEXEC);
		}
		const { mMachType } = _this;
		if (mMachType && mMachType !== type) {
			UnixError.throwMe(ENOEXEC);
		}
		_this.mMachType = type;
		return macho;
	}

	/**
	 * Guess type of file.
	 *
	 * @param reader Reader object.
	 * @returns Zero if not a valid Mach-O or Universal.
	 */
	public static async typeOf(reader: Reader): Promise<number> {
		let data = await reader.slice(0, mach_header.BYTE_LENGTH).arrayBuffer();
		if (data.byteLength !== mach_header.BYTE_LENGTH) {
			return 0;
		}
		let header = new mach_header(data);
		let arch1;
		for (let tries = 3; tries--;) {
			switch (header.magic) {
				case MH_CIGAM:
				case MH_CIGAM_64:
					header = new mach_header(data, 0, !header.littleEndian);
					// Falls through.
				case MH_MAGIC:
				case MH_MAGIC_64: {
					return header.filetype;
				}
				case FAT_CIGAM:
					arch1 = new fat_arch(
						data,
						fat_header.BYTE_LENGTH,
						!header.littleEndian,
					);
					// Falls through.
				case FAT_MAGIC: {
					arch1 ??= new fat_arch(data, fat_header.BYTE_LENGTH);
					const { offset } = arch1;
					// deno-lint-ignore no-await-in-loop
					data = await reader
						.slice(offset, offset + header.byteLength)
						.arrayBuffer();
					if (data.byteLength !== header.byteLength) {
						return 0;
					}
					header = new mach_header(data, 0, arch1.littleEndian);
					continue;
				}
				default: {
					return 0;
				}
			}
		}
		return 0;
	}

	/**
	 * A universal binary over a readable.
	 *
	 * @param reader Reader.
	 * @param offset Offset for subsection.
	 * @param length Length of subsection.
	 * @returns Universal instance.
	 */
	public static async Universal(
		reader: Reader,
		offset = 0,
		length = 0,
	): Promise<Universal> {
		return await new Universal().Universal(reader, offset, length);
	}

	static {
		toStringTag(this, 'Universal');
	}
}
