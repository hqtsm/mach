import { toStringTag } from '@hqtsm/class';
import {
	type ArrayBufferPointer,
	getByteLength,
	Int8Ptr,
	LITTLE_ENDIAN,
	pointer,
	type Ptr,
	Uint32Ptr,
} from '@hqtsm/struct';
import type { Reader } from '../helpers/mod.ts';
import {
	type _const,
	type bool,
	type char,
	EIO,
	ENOEXEC,
	type size_t,
	strlen,
	strncmp,
	type uint,
	type uint32_t,
} from '../libc/mod.ts';
import {
	CPU_ARCH_ABI64,
	CPU_SUBTYPE_MASK,
	CPU_SUBTYPE_MULTIPLE,
	type cpu_subtype_t,
	CPU_TYPE_ARM,
	type cpu_type_t,
	PAGE_MASK_ARM64,
} from '../mach/mod.ts';
import {
	build_version_command,
	fat_arch,
	type fat_arch_64,
	FAT_CIGAM,
	fat_header,
	FAT_MAGIC,
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
} from '../mach-o/mod.ts';
import { errSecInternalError } from '../Security/mod.ts';
import { Security_MacOSError, Security_UnixError } from './errors.ts';

/**
 * Maximum number of architectures fat binaries can have.
 */
export const Security_MAX_ARCH_COUNT = 100;

/**
 * Maximum power of 2 a Mach-O can have.
 */
export const Security_MAX_ALIGN = 30;

/**
 * Architecture specification.
 */
export class Security_Architecture {
	/**
	 * CPU type.
	 */
	public first: cpu_type_t;

	/**
	 * CPU subtype.
	 */
	public second: cpu_subtype_t;

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
	constructor(type: cpu_type_t, sub?: cpu_subtype_t | null);

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
		type?: cpu_type_t | fat_arch | fat_arch_64,
		sub?: cpu_subtype_t,
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
	public static cpuType(_this: Security_Architecture): cpu_type_t {
		return _this.first;
	}

	/**
	 * CPU subtype.
	 *
	 * @param _this This.
	 * @returns Masked subtype ID.
	 */
	public static cpuSubtype(_this: Security_Architecture): cpu_subtype_t {
		return _this.second & ~CPU_SUBTYPE_MASK;
	}

	/**
	 * Full CPU subtype.
	 *
	 * @param _this This.
	 * @returns Full subtype ID.
	 */
	public static cpuSubtypeFull(_this: Security_Architecture): cpu_subtype_t {
		return _this.second;
	}

	/**
	 * Is architecture valid.
	 *
	 * @param _this This.
	 * @returns Is valid.
	 */
	public static bool(_this: Security_Architecture): bool {
		return !!_this.first;
	}

	/**
	 * If architectures are equal.
	 *
	 * @param a1 Architecture A.
	 * @param a2 Architecture B.
	 * @returns Is equal.
	 */
	public static equals(
		a1: Security_Architecture,
		a2: Security_Architecture,
	): bool {
		return a1.first === a2.first && a1.second === a2.second;
	}

	/**
	 * If architecture is less than another.
	 *
	 * @param a1 Architecture A.
	 * @param a2 Architecture B.
	 * @returns Is less than.
	 */
	public static lessThan(
		a1: Security_Architecture,
		a2: Security_Architecture,
	): bool {
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
	public static matches(
		_this: Security_Architecture,
		templ: Security_Architecture,
	): bool {
		if (_this.first !== templ.first) {
			return false;
		}
		if (templ.second === CPU_SUBTYPE_MULTIPLE) {
			return true;
		}
		return !((_this.second ^ templ.second) & ~CPU_SUBTYPE_MASK);
	}

	static {
		toStringTag(this, 'Security_Architecture');
	}
}

/**
 * Common interface of Mach-O binaries features.
 */
export class Security_MachOBase {
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
	public static isFlipped(_this: Security_MachOBase): bool {
		return _this.mFlip;
	}

	/**
	 * If binary is 64-bit.
	 *
	 * @param _this This.
	 * @returns True if 64-bit, false if 32-bit.
	 */
	public static is64(_this: Security_MachOBase): bool {
		return _this.m64;
	}

	/**
	 * Get Mach-O header.
	 *
	 * @param _this This.
	 * @returns Header or null.
	 */
	public static header(
		_this: Security_MachOBase,
	): mach_header | mach_header_64 | null {
		return _this.mHeader;
	}

	/**
	 * Get architecture from header.
	 *
	 * @param _this This.
	 * @returns Architecture.
	 */
	public static architecture(
		_this: Security_MachOBase,
	): Security_Architecture {
		const mHeader = _this.mHeader!;
		return new Security_Architecture(mHeader.cputype, mHeader.cpusubtype);
	}

	/**
	 * Get file type from header.
	 *
	 * @param _this This.
	 * @returns File type.
	 */
	public static type(_this: Security_MachOBase): uint32_t {
		return _this.mHeader!.filetype;
	}

	/**
	 * Get flags from header.
	 *
	 * @param _this This.
	 * @returns Flags.
	 */
	public static flags(_this: Security_MachOBase): uint32_t {
		return _this.mHeader!.flags;
	}

	/**
	 * Get load commands.
	 *
	 * @param _this This.
	 * @returns Load commands pointer or null.
	 */
	public static loadCommands(_this: Security_MachOBase): load_command | null {
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
		_this: Security_MachOBase,
		command: load_command,
	): load_command | null {
		const { cmdsize } = command;
		if (!cmdsize) {
			Security_UnixError.throwMe(ENOEXEC);
		}
		const { mEndCommands } = _this;
		const byteOffset = command.byteOffset + cmdsize;
		if (byteOffset >= mEndCommands) {
			return null;
		}
		if (byteOffset + load_command.BYTE_LENGTH > mEndCommands) {
			Security_UnixError.throwMe(ENOEXEC);
		}
		command = new load_command(
			command.buffer,
			byteOffset,
			command.littleEndian,
		);
		if (byteOffset + command.cmdsize > mEndCommands) {
			Security_UnixError.throwMe(ENOEXEC);
		}
		return command;
	}

	/**
	 * Get command length.
	 *
	 * @returns Byte length of commands.
	 */
	public static commandLength(_this: Security_MachOBase): size_t {
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
		_this: Security_MachOBase,
		cmd: uint32_t,
	): load_command | null {
		for (
			let c = Security_MachOBase.loadCommands(_this);
			c;
			c = Security_MachOBase.nextCommand(_this, c)
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
		_this: Security_MachOBase,
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
			let c = Security_MachOBase.loadCommands(_this);
			c;
			c = Security_MachOBase.nextCommand(_this, c)
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
				Security_UnixError.throwMe(ENOEXEC);
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
		_this: Security_MachOBase,
		segname: ArrayBufferLike | ArrayBufferPointer,
		sectname: ArrayBufferLike | ArrayBufferPointer,
	): section | section_64 | null {
		const seg = Security_MachOBase.findSegment(_this, segname);
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
		_this: Security_MachOBase,
		cmd: load_command,
		str: lc_str,
	): _const<Ptr<char>> | null {
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
		_this: Security_MachOBase,
	): linkedit_data_command | null {
		const cmd = Security_MachOBase.findCommand(_this, LC_CODE_SIGNATURE);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < linkedit_data_command.BYTE_LENGTH) {
			Security_UnixError.throwMe(ENOEXEC);
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
		_this: Security_MachOBase,
	): linkedit_data_command | null {
		const cmd = Security_MachOBase.findCommand(
			_this,
			LC_DYLIB_CODE_SIGN_DRS,
		);
		if (!cmd) {
			return null;
		}
		if (cmd.cmdsize < linkedit_data_command.BYTE_LENGTH) {
			Security_UnixError.throwMe(ENOEXEC);
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
	public static signingOffset(_this: Security_MachOBase): size_t {
		const lec = Security_MachOBase.findCodeSignature(_this);
		return lec ? lec.dataoff : 0;
	}

	/**
	 * Get code signature length.
	 *
	 * @param _this This.
	 * @returns Code signature length, or 0.
	 */
	public static signingLength(_this: Security_MachOBase): size_t {
		const lec = Security_MachOBase.findCodeSignature(_this);
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
		_this: Security_MachOBase,
		platform: Ptr<uint32_t> | null,
		minVersion: Ptr<uint32_t> | null,
		sdkVersion: Ptr<uint32_t> | null,
	): bool {
		const bc = Security_MachOBase.findBuildVersion(_this);
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

		const vc = Security_MachOBase.findMinVersion(_this);
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
	public static platform(_this: Security_MachOBase): uint32_t {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return Security_MachOBase.version(_this, p, null, null) ? p[0] : 0;
	}

	/**
	 * Get minimum version.
	 *
	 * @param _this This.
	 * @returns Minimum version or 0.
	 */
	public static minVersion(_this: Security_MachOBase): uint32_t {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return Security_MachOBase.version(_this, null, p, null) ? p[0] : 0;
	}

	/**
	 * Get SDK version.
	 *
	 * @param _this This.
	 * @returns SDK version or 0.
	 */
	public static sdkVersion(_this: Security_MachOBase): uint32_t {
		const p = new Uint32Ptr(new ArrayBuffer(4));
		return Security_MachOBase.version(_this, null, null, p) ? p[0] : 0;
	}

	/**
	 * Initialize header.
	 *
	 * @param _this This.
	 * @param header Mach-O header data.
	 */
	protected static initHeader(
		_this: Security_MachOBase,
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
				Security_UnixError.throwMe(ENOEXEC);
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
		_this: Security_MachOBase,
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
			Security_UnixError.throwMe(ENOEXEC);
		}
	}

	/**
	 * Size of header.
	 *
	 * @param _this This.
	 * @returns Byte length of header.
	 */
	protected static headerSize(_this: Security_MachOBase): size_t {
		return _this.m64 ? mach_header_64.BYTE_LENGTH : mach_header.BYTE_LENGTH;
	}

	/**
	 * Size of commands.
	 *
	 * @param _this This.
	 * @returns Byte length of commands.
	 */
	protected static commandSize(_this: Security_MachOBase): size_t {
		return _this.mHeader!.sizeofcmds;
	}

	/**
	 * Find minimum version command.
	 *
	 * @param _this This.
	 * @returns Minimum version command or null.
	 */
	protected static findMinVersion(
		_this: Security_MachOBase,
	): version_min_command | null {
		for (
			let c = Security_MachOBase.loadCommands(_this);
			c;
			c = Security_MachOBase.nextCommand(_this, c)
		) {
			switch (c.cmd) {
				case LC_VERSION_MIN_MACOSX:
				case LC_VERSION_MIN_IPHONEOS:
				case LC_VERSION_MIN_WATCHOS:
				case LC_VERSION_MIN_TVOS: {
					if (c.cmdsize < version_min_command.BYTE_LENGTH) {
						Security_UnixError.throwMe(ENOEXEC);
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
		_this: Security_MachOBase,
	): build_version_command | null {
		for (
			let c = Security_MachOBase.loadCommands(_this);
			c;
			c = Security_MachOBase.nextCommand(_this, c)
		) {
			if (c.cmd === LC_BUILD_VERSION) {
				if (c.cmdsize < build_version_command.BYTE_LENGTH) {
					Security_UnixError.throwMe(ENOEXEC);
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
	private mEndCommands: size_t = 0;

	/**
	 * Is a 64-bit binary.
	 */
	private m64: bool = false;

	/**
	 * Does binary endian not matches the host endian.
	 */
	private mFlip: bool = false;

	static {
		toStringTag(this, 'Security_MachOBase');
	}
}

/**
 * A Mach-O binary over a reader.
 */
export class Security_MachO extends Security_MachOBase {
	/**
	 * Binary reader.
	 */
	private mReader: Reader | null = null;

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
		offset: size_t = 0,
		length: size_t = 0,
	): Promise<this> {
		this.mReader = reader;
		this.mOffset = offset;
		const mLength = this.mLength = offset ? length : reader.size;
		this.mSuspicious = false;

		const hs = mach_header.BYTE_LENGTH;
		const header = await reader.slice(offset, offset + hs).arrayBuffer();
		if (header.byteLength !== hs) {
			Security_UnixError.throwMe(ENOEXEC);
		}
		Security_MachO.initHeader(this, header);
		offset += hs;

		const fhs = Security_MachO.headerSize(this);
		const more = fhs - hs;
		if (more > 0) {
			const d = await reader.slice(offset, offset + more).arrayBuffer();
			if (d.byteLength !== more) {
				Security_UnixError.throwMe(ENOEXEC);
			}
			const full = new Uint8Array(fhs);
			full.set(new Uint8Array(header));
			full.set(new Uint8Array(d), hs);
			Security_MachO.initHeader(this, full);
			offset += more;
		}

		const cs = Security_MachO.commandSize(this);
		const commands = await reader.slice(offset, offset + cs).arrayBuffer();
		if (commands.byteLength !== cs) {
			Security_UnixError.throwMe(ENOEXEC);
		}
		Security_MachO.initCommands(this, commands);

		if (mLength) {
			Security_MachO.validateStructure(this);
		}
		return this;
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
		offset: size_t = 0,
		length: size_t = 0,
	): Promise<Security_MachO> {
		return await new Security_MachO().MachO(reader, offset, length);
	}

	/**
	 * Get binary offset.
	 *
	 * @param _this This.
	 * @returns Offset in reader.
	 */
	public static offset(_this: Security_MachO): size_t {
		return _this.mOffset;
	}

	/**
	 * Get binary length.
	 *
	 * @param _this This.
	 * @returns Length in reader.
	 */
	public static size(_this: Security_MachO): size_t {
		return _this.mLength;
	}

	/**
	 * Get signing extent.
	 *
	 * @param _this This.
	 * @returns Signing offset or file length if none.
	 */
	public static signingExtent(_this: Security_MachO): size_t {
		return Security_MachO.signingOffset(_this) ||
			Security_MachO.size(_this);
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
		_this: Security_MachO,
		offset: size_t,
		size: size_t,
	): Promise<ArrayBuffer> {
		const o = _this.mOffset + offset;
		const data = await _this.mReader!.slice(o, o + size).arrayBuffer();
		if (data.byteLength !== size) {
			Security_UnixError.throwMe(EIO);
		}
		return data;
	}

	/**
	 * Validate structure of binary.
	 *
	 * @param _this This.
	 */
	public static validateStructure(_this: Security_MachO): void {
		let isValid = false;

		const segLinkedit = new Uint8Array(SEG_LINKEDIT.length + 1);
		for (let i = SEG_LINKEDIT.length; i--;) {
			segLinkedit[i] = SEG_LINKEDIT.charCodeAt(i);
		}

		LOOP: for (
			let cmd = Security_MachO.loadCommands(_this);
			cmd;
			cmd = Security_MachO.nextCommand(_this, cmd)
		) {
			switch (cmd.cmd) {
				case LC_SEGMENT: {
					if (cmd.cmdsize < segment_command.BYTE_LENGTH) {
						Security_UnixError.throwMe(ENOEXEC);
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
							Security_MachO.size(_this);
						break LOOP;
					}
					break;
				}
				case LC_SEGMENT_64: {
					if (cmd.cmdsize < segment_command_64.BYTE_LENGTH) {
						Security_UnixError.throwMe(ENOEXEC);
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
							Security_MachO.size(_this);
						break LOOP;
					}
					break;
				}
				case LC_SYMTAB: {
					if (cmd.cmdsize < symtab_command.BYTE_LENGTH) {
						Security_UnixError.throwMe(ENOEXEC);
					}
					const symtab = new symtab_command(
						cmd.buffer,
						cmd.byteOffset,
						cmd.littleEndian,
					);
					isValid = symtab.stroff + symtab.strsize ===
						Security_MachO.size(_this);
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
	public static isSuspicious(_this: Security_MachO): bool {
		return _this.mSuspicious;
	}

	/**
	 * Offset in reader.
	 */
	private mOffset: size_t = 0;

	/**
	 * Length in reader.
	 */
	private mLength: size_t = 0;

	/**
	 * Suspicious flag.
	 */
	private mSuspicious: bool = false;

	static {
		toStringTag(this, 'Security_MachO');
	}
}

/**
 * A Mach-O binary over a buffer.
 */
export class Security_MachOImage extends Security_MachOBase {
	/**
	 * Construct a Mach-O binary over a buffer.
	 *
	 * @param address Buffer pointer.
	 */
	constructor(address: ArrayBufferLike | ArrayBufferPointer) {
		super();

		Security_MachOImage.initHeader(this, address);

		let buffer;
		let byteOffset = Security_MachOImage.headerSize(this);
		if ('buffer' in address) {
			buffer = address.buffer;
			byteOffset += address.byteOffset;
		} else {
			buffer = address;
		}
		Security_MachOImage.initCommands(this, {
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
	public static address(_this: Security_MachOImage): ArrayBufferPointer {
		return Security_MachOImage.header(_this)!;
	}

	static {
		toStringTag(this, 'Security_MachOImage');
	}
}

/**
 * Universal architectures.
 */
export type Security_Universal_Architectures = Set<Security_Architecture>;

/**
 * Universal offsets to length.
 */
export type Security_Universal_OffsetsToLength = Map<size_t, size_t>;

/**
 * A universal binary over a readable.
 * Works for fat binaries and also thin binaries.
 */
export class Security_Universal {
	/**
	 * Binary reader.
	 */
	private mReader: Reader | null = null;

	/**
	 * Create uninitialized Universal instance.
	 */
	protected constructor() {}

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
		offset: size_t = 0,
		length: size_t = 0,
	): Promise<Security_Universal> {
		return await new Security_Universal().Universal(reader, offset, length);
	}

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
		offset: size_t = 0,
		length: size_t = 0,
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
			Security_UnixError.throwMe(ENOEXEC);
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
				if (mArchCount > Security_MAX_ARCH_COUNT) {
					Security_UnixError.throwMe(ENOEXEC);
				}

				// Read enough for 1 extra arch.
				const archSize = fat_arch.BYTE_LENGTH * (mArchCount + 1);
				const archOffset = offset + header.byteLength;
				const archData = await reader
					.slice(archOffset, archOffset + archSize)
					.arrayBuffer();
				if (archData.byteLength !== archSize) {
					Security_UnixError.throwMe(ENOEXEC);
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
						Security_MacOSError.throwMe(errSecInternalError);
					}
					mSizes.set(offset, size);

					const gapSize = offset - prevHeaderEnd;
					if (
						prevHeaderEnd !== universalHeaderEnd &&
						(align > Security_MAX_ALIGN || gapSize >= (1 << align))
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
				this.mThinArch = new Security_Architecture(
					mHeader.cputype,
					mHeader.cpusubtype,
				);
				break;
			}
			default: {
				Security_UnixError.throwMe(ENOEXEC);
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
		_this: Security_Universal,
		arch: Security_Architecture,
	): Promise<Security_MachO>;

	/**
	 * Get Mach-O for offset.
	 *
	 * @param _this This.
	 * @param arch Offset of binary.
	 * @returns Mach-O.
	 */
	public static async architecture(
		_this: Security_Universal,
		offset: size_t,
	): Promise<Security_MachO>;

	/**
	 * Get Mach-O for architecture or offset.
	 *
	 * @param _this This.
	 * @param arch Architecture or offset.
	 * @returns Mach-O.
	 */
	public static async architecture(
		_this: Security_Universal,
		arch: Security_Architecture | size_t,
	): Promise<Security_MachO> {
		if (typeof arch === 'number') {
			if (Security_Universal.isUniversal(_this)) {
				const length = Security_Universal.lengthOfSlice(_this, arch);
				return Security_Universal.make(
					_this,
					await Security_MachO.MachO(_this.mReader!, arch, length),
				);
			}
			if (arch === _this.mBase) {
				return Security_MachO.MachO(_this.mReader!);
			}
		} else {
			if (Security_Universal.isUniversal(_this)) {
				return Security_Universal.findImage(_this, arch);
			}
			if (Security_Architecture.matches(arch, _this.mThinArch!)) {
				return Security_MachO.MachO(
					_this.mReader!,
					_this.mBase,
					_this.mLength,
				);
			}
		}
		Security_UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Get offset or architecture.
	 *
	 * @param _this This.
	 * @param arch Architecture to get the offset of.
	 * @returns Architecture offset.
	 */
	public static archOffset(
		_this: Security_Universal,
		arch: Security_Architecture,
	): size_t {
		if (Security_Universal.isUniversal(_this)) {
			return _this.mBase +
				Security_Universal.findArch(_this, arch).offset;
		}
		if (Security_Architecture.matches(_this.mThinArch!, arch)) {
			return 0;
		}
		Security_UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Get length of architecture.
	 *
	 * @param _this This.
	 * @param arch Architecture to get the length of.
	 * @returns Architecture length.
	 */
	public static archLength(
		_this: Security_Universal,
		arch: Security_Architecture,
	): size_t {
		if (Security_Universal.isUniversal(_this)) {
			return _this.mBase + Security_Universal.findArch(_this, arch).size;
		}
		if (Security_Architecture.matches(_this.mThinArch!, arch)) {
			return _this.mReader!.size;
		}
		Security_UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Is part of a FAT file.
	 *
	 * @param _this This.
	 * @returns Narrowed range or not.
	 */
	public static narrowed(_this: Security_Universal): bool {
		return !!_this.mBase;
	}

	/**
	 * Get set of architectures.
	 *
	 * @param _this This.
	 * @param archs Set of architectures to populate into.
	 */
	public static architectures(
		_this: Security_Universal,
		archs: Security_Universal_Architectures,
	): void {
		const skip = new Set<string>();
		for (const a of archs) {
			skip.add(`${a.first}:${a.second}`);
		}
		if (Security_Universal.isUniversal(_this)) {
			const mArchList = _this.mArchList!;
			for (let i = 0; i < _this.mArchCount; i++) {
				const { cputype, cpusubtype } = mArchList[i];
				if (!skip.has(`${cputype}:${cpusubtype}`)) {
					archs.add(new Security_Architecture(cputype, cpusubtype));
				}
			}
		} else {
			const { first, second } = _this.mThinArch!;
			if (!skip.has(`${first}:${second}`)) {
				archs.add(new Security_Architecture(first, second));
			}
		}
	}

	/**
	 * Is a universal binary.
	 *
	 * @param _this This.
	 * @returns True if universal, even if only 1 architecture.
	 */
	public static isUniversal(_this: Security_Universal): bool {
		return !!_this.mArchList;
	}

	/**
	 * Get length of slice at offset.
	 *
	 * @param _this This.
	 * @param offset Slice offset.
	 * @returns Slice length.
	 */
	public static lengthOfSlice(
		_this: Security_Universal,
		offset: size_t,
	): size_t {
		const value = _this.mSizes.get(offset);
		if (value === undefined) {
			Security_MacOSError.throwMe(errSecInternalError);
		}
		return value;
	}

	/**
	 * Get offset in reader.
	 *
	 * @param _this This.
	 * @returns Byte offset in reader.
	 */
	public static offset(_this: Security_Universal): size_t {
		return _this.mBase;
	}

	/**
	 * Get length in reader.
	 *
	 * @param _this This.
	 * @returns Byte length in reader.
	 */
	public static size(_this: Security_Universal): size_t {
		return _this.mLength;
	}

	/**
	 * Check if FAT binary is suspicious.
	 *
	 * @param _this This.
	 * @returns Is suspicious.
	 */
	public static isSuspicious(_this: Security_Universal): bool {
		return _this.mSuspicious;
	}

	/**
	 * Guess type of file.
	 *
	 * @param reader Reader object.
	 * @returns Zero if not a valid Mach-O or Universal.
	 */
	public static async typeOf(reader: Reader): Promise<uint32_t> {
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
	 * Find matching architecture in FAT file architecture list.
	 *
	 * @param _this This.
	 * @param arch Architecture to find.
	 * @returns Matching FAT architecture.
	 */
	private static findArch(
		_this: Security_Universal,
		arch: Security_Architecture,
	): fat_arch {
		const { mArchList, mArchCount } = _this;
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Security_Architecture.cpuType(arch) &&
				a.cpusubtype === Security_Architecture.cpuSubtypeFull(arch)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Security_Architecture.cpuType(arch) &&
				(a.cpusubtype & ~CPU_SUBTYPE_MASK) ===
					Security_Architecture.cpuSubtype(arch)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (
				a.cputype === Security_Architecture.cpuType(arch) &&
				!(a.cpusubtype & ~CPU_SUBTYPE_MASK)
			) {
				return a;
			}
		}
		for (let i = 0; i < mArchCount; i++) {
			const a = mArchList![i];
			if (a.cputype === Security_Architecture.cpuType(arch)) {
				return a;
			}
		}
		Security_UnixError.throwMe(ENOEXEC);
	}

	/**
	 * Find Mach-O image for architecture.
	 *
	 * @param _this This.
	 * @param target Architecture.
	 * @returns Mach-O image.
	 */
	private static async findImage(
		_this: Security_Universal,
		target: Security_Architecture,
	): Promise<Security_MachO> {
		const arch = Security_Universal.findArch(_this, target);
		return Security_Universal.make(
			_this,
			await Security_MachO.MachO(
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
	private static make(
		_this: Security_Universal,
		macho: Security_MachO,
	): Security_MachO {
		const type = Security_MachO.type(macho);
		if (!type) {
			Security_UnixError.throwMe(ENOEXEC);
		}
		const { mMachType } = _this;
		if (mMachType && mMachType !== type) {
			Security_UnixError.throwMe(ENOEXEC);
		}
		_this.mMachType = type;
		return macho;
	}

	/**
	 * Architecture list, if fat.
	 */
	private mArchList: Ptr<fat_arch> | null = null;

	/**
	 * Architecture count, if fat.
	 */
	private mArchCount: uint = 0;

	/**
	 * Single architecture, if thin.
	 */
	private mThinArch: Security_Architecture | null = null;

	/**
	 * Offset in reader.
	 */
	private mBase: size_t = 0;

	/**
	 * Length in reader, if thin.
	 */
	private mLength: size_t = 0;

	/**
	 * Length of slice at each offset.
	 */
	private mSizes: Security_Universal_OffsetsToLength = new Map();

	/**
	 * Mach type.
	 */
	private mMachType: uint32_t = 0;

	/**
	 * Suspicious flag.
	 */
	private mSuspicious: bool = false;

	static {
		toStringTag(this, 'Security_Universal');
	}
}
