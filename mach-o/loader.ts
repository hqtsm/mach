// deno-lint-ignore-file camelcase
import { constant, toStringTag } from '@hqtsm/class';
import {
	type Arr,
	array,
	int32,
	Int8Ptr,
	member,
	Struct,
	uint16,
	uint24,
	uint32,
	uint64,
	uint8,
	Uint8Ptr,
	Union,
} from '@hqtsm/struct';
import type { bitfield, char } from '../libc/c.ts';
import type {
	int32_t,
	uint16_t,
	uint32_t,
	uint64_t,
	uint8_t,
} from '../libc/stdint.ts';

/**
 * Mach-O header, 32-bit.
 */
export class mach_header extends Struct {
	/**
	 * Mach magic.
	 */
	declare public magic: uint32_t;

	/**
	 * CPU type.
	 */
	declare public cputype: int32_t;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: int32_t;

	/**
	 * File type.
	 */
	declare public filetype: uint32_t;

	/**
	 * Number of load commands.
	 */
	declare public ncmds: uint32_t;

	/**
	 * Size of load commands.
	 */
	declare public sizeofcmds: uint32_t;

	/**
	 * Flags.
	 */
	declare public flags: uint32_t;

	static {
		toStringTag(this, 'mach_header');
		uint32(this, 'magic');
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint32(this, 'filetype');
		uint32(this, 'ncmds');
		uint32(this, 'sizeofcmds');
		uint32(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}

// Constants for mach_header magic:

/**
 * Mach magic number, 32-bit.
 */
export const MH_MAGIC = 0xfeedface;

/**
 * Mach magic number, 32-bit, byte swapped.
 */
export const MH_CIGAM = 0xcefaedfe;

/**
 * Mach-O header, 64-bit.
 */
export class mach_header_64 extends Struct {
	/**
	 * Mach magic.
	 */
	declare public magic: uint32_t;

	/**
	 * CPU type.
	 */
	declare public cputype: int32_t;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: int32_t;

	/**
	 * File type.
	 */
	declare public filetype: uint32_t;

	/**
	 * Number of load commands.
	 */
	declare public ncmds: uint32_t;

	/**
	 * Size of load commands.
	 */
	declare public sizeofcmds: uint32_t;

	/**
	 * Flags.
	 */
	declare public flags: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved: uint32_t;

	static {
		toStringTag(this, 'mach_header_64');
		uint32(this, 'magic');
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint32(this, 'filetype');
		uint32(this, 'ncmds');
		uint32(this, 'sizeofcmds');
		uint32(this, 'flags');
		uint32(this, 'reserved');
		constant(this, 'BYTE_LENGTH');
	}
}

// Constants for mach_header_64 magic:

/**
 * Mach magic number, 64-bit.
 */
export const MH_MAGIC_64 = 0xfeedfacf;

/**
 * Mach magic number, 64-bit, byte swapped.
 */
export const MH_CIGAM_64 = 0xcffaedfe;

// Constants for mach_header filetype:

/**
 * Object file.
 */
export const MH_OBJECT = 0x1;

/**
 * Executable file.
 */
export const MH_EXECUTE = 0x2;

/**
 * Fixed VM shared library file.
 */
export const MH_FVMLIB = 0x3;

/**
 * Core file.
 */
export const MH_CORE = 0x4;

/**
 * Preload file.
 */
export const MH_PRELOAD = 0x5;

/**
 * Dynamically bound shared library.
 */
export const MH_DYLIB = 0x6;

/**
 * Dynamic link editor.
 */
export const MH_DYLINKER = 0x7;

/**
 * Dynamically bound bundle file.
 */
export const MH_BUNDLE = 0x8;

/**
 * Shared library stub for static linking.
 */
export const MH_DYLIB_STUB = 0x9;

/**
 * Debug symbols file.
 */
export const MH_DSYM = 0xa;

/**
 * Kext bundle.
 */
export const MH_KEXT_BUNDLE = 0xb;

/**
 * Multiple Mach-Os files sharing a linkedit.
 */
export const MH_FILESET = 0xc;

/**
 * GPU program.
 */
export const MH_GPU_EXECUTE = 0xd;

/**
 * GPU library.
 */
export const MH_GPU_DYLIB = 0xe;

// Constants for mach_header flags:

/**
 * No undefined references.
 */
export const MH_NOUNDEFS = 0x1;

/**
 * Incremental link edit.
 */
export const MH_INCRLINK = 0x2;

/**
 * Dynamic link edit.
 */
export const MH_DYLDLINK = 0x4;

/**
 * Bind undefined references at load time.
 */
export const MH_BINDATLOAD = 0x8;

/**
 * Prebound undefined references.
 */
export const MH_PREBOUND = 0x10;

/**
 * Split segements.
 */
export const MH_SPLIT_SEGS = 0x20;

/**
 * Shared library init routine is lazy.
 */
export const MH_LAZY_INIT = 0x40;

/**
 * Using two-level namespace binding.
 */
export const MH_TWOLEVEL = 0x80;

/**
 * Force flat namespace binding.
 */
export const MH_FORCE_FLAT = 0x100;

/**
 * No multiple definitions in subimages.
 */
export const MH_NOMULTIDEFS = 0x200;

/**
 * Do not have dyld notify the prebinding agent.
 */
export const MH_NOFIXPREBINDING = 0x400;

/**
 * Binary is not prebound but can have prebindings redone.
 */
export const MH_PREBINDABLE = 0x800;

/**
 * Binary binds to all two-level namespace modules.
 */
export const MH_ALLMODSBOUND = 0x1000;

/**
 * Safe to divide sections into subsections via symbols.
 */
export const MH_SUBSECTIONS_VIA_SYMBOLS = 0x2000;

/**
 * Binary has been made canonical by unprebind operation.
 */
export const MH_CANONICAL = 0x4000;

/**
 * Final lined image contains external weak symbols.
 */
export const MH_WEAK_DEFINES = 0x8000;

/**
 * Final linked image uses weak symbols.
 */
export const MH_BINDS_TO_WEAK = 0x10000;

/**
 * All stacks are given stack execution permission.
 */
export const MH_ALLOW_STACK_EXECUTION = 0x20000;

/**
 * Safe for use in a process with uid 0.
 */
export const MH_ROOT_SAFE = 0x40000;

/**
 * Safe for use in a setuid process.
 */
export const MH_SETUID_SAFE = 0x80000;

/**
 * No re-exported dylibs.
 */
export const MH_NO_REEXPORTED_DYLIBS = 0x100000;

/**
 * Position independent executable.
 */
export const MH_PIE = 0x200000;

/**
 * Allow no LC_LOAD_DYLIB command if unused.
 */
export const MH_DEAD_STRIPPABLE_DYLIB = 0x400000;

/**
 * Contains a S_THREAD_LOCAL_VARIABLES section.
 */
export const MH_HAS_TLV_DESCRIPTORS = 0x800000;

/**
 * Run main executable with non-executable heap.
 */
export const MH_NO_HEAP_EXECUTION = 0x1000000;

/**
 * Linked for us in an application extension.
 */
export const MH_APP_EXTENSION_SAFE = 0x02000000;

/**
 * External symbols in nlist do not include all symbols in dyld info.
 */
export const MH_NLIST_OUTOFSYNC_WITH_DYLDINFO = 0x04000000;

/**
 * Allow simulator support.
 */
export const MH_SIM_SUPPORT = 0x08000000;

/**
 * Has no __PAGEZERO segment.
 */
export const MH_IMPLICIT_PAGEZERO = 0x10000000;

/**
 * Dylib is part of the dyld chared cache.
 */
export const MH_DYLIB_IN_CACHE = 0x80000000;

/**
 * Load command.
 */
export class load_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	static {
		toStringTag(this, 'load_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		constant(this, 'BYTE_LENGTH');
	}
}

// Constants for load_command cmd values:

/**
 * Requires dynamic linker to support command.
 */
export const LC_REQ_DYLD = 0x80000000;

/**
 * Segment to me mapped.
 */
export const LC_SEGMENT = 0x1;

/**
 * Link-edit stabl symbol table.
 */
export const LC_SYMTAB = 0x2;

/**
 * Link-edit gdb symbol table.
 */
export const LC_SYMSEG = 0x3;

/**
 * Thread.
 */
export const LC_THREAD = 0x4;

/**
 * Unix thread.
 */
export const LC_UNIXTHREAD = 0x5;

/**
 * Load a fixed VM shared library.
 */
export const LC_LOADFVMLIB = 0x6;

/**
 * Fixed VM shared library identification.
 */
export const LC_IDFVMLIB = 0x7;

/**
 * Object identification.
 */
export const LC_IDENT = 0x8;

/**
 * Fixed VM file inclusion.
 */
export const LC_FVMFILE = 0x9;

/**
 * Prepage command.
 */
export const LC_PREPAGE = 0xa;

/**
 * Dynamic link-edit symbol table.
 */
export const LC_DYSYMTAB = 0xb;

/**
 * Load a dynamically linked shared library.
 */
export const LC_LOAD_DYLIB = 0xc;

/**
 * Dynamically linked shared library identification.
 */
export const LC_ID_DYLIB = 0xd;

/**
 * Load a dynamic linker.
 */
export const LC_LOAD_DYLINKER = 0xe;

/**
 * Dynamic linker identification.
 */
export const LC_ID_DYLINKER = 0xf;

/**
 * Prebound for dynamically linked shared library.
 */
export const LC_PREBOUND_DYLIB = 0x10;

/**
 * Image routines.
 */
export const LC_ROUTINES = 0x11;

/**
 * Sub-framework.
 */
export const LC_SUB_FRAMEWORK = 0x12;

/**
 * Sub-umbrella.
 */
export const LC_SUB_UMBRELLA = 0x13;

/**
 * Sub-client.
 */
export const LC_SUB_CLIENT = 0x14;

/**
 * Sub-library.
 */
export const LC_SUB_LIBRARY = 0x15;

/**
 * Two-level namespace lookup hints.
 */
export const LC_TWOLEVEL_HINTS = 0x16;

/**
 * Prebind checksum.
 */
export const LC_PREBIND_CKSUM = 0x17;

/**
 * Load a dylib that is allow to be missing.
 *
 * `0x18 | LC_REQ_DYLD`
 */
export const LC_LOAD_WEAK_DYLIB = 0x80000018;

/**
 * 64-bit segment to be mapped.
 */
export const LC_SEGMENT_64 = 0x19;

/**
 * 64-bit image routines.
 */
export const LC_ROUTINES_64 = 0x1a;

/**
 * The UUID.
 */
export const LC_UUID = 0x1b;

/**
 * Runpath additions.
 *
 * `0x1c | LC_REQ_DYLD`
 */
export const LC_RPATH = 0x8000001c;

/**
 * Code signature.
 */
export const LC_CODE_SIGNATURE = 0x1d;

/**
 * Split segments info.
 */
export const LC_SEGMENT_SPLIT_INFO = 0x1e;

/**
 * Re-export dylib.
 *
 * `0x1f | LC_REQ_DYLD`
 */
export const LC_REEXPORT_DYLIB = 0x8000001f;

/**
 * Lazy load dylib on first use.
 */
export const LC_LAZY_LOAD_DYLIB = 0x20;

/**
 * Encrypted segment info.
 */
export const LC_ENCRYPTION_INFO = 0x21;

/**
 * Compressed dyld info.
 */
export const LC_DYLD_INFO = 0x22;

/**
 * Compressed dyld info only.
 *
 * `0x22 | LC_REQ_DYLD`
 */
export const LC_DYLD_INFO_ONLY = 0x80000022;

/**
 * Load upward dylib.
 *
 * `0x23 | LC_REQ_DYLD`
 */
export const LC_LOAD_UPWARD_DYLIB = 0x80000023;

/**
 * Minimum macOS version.
 */
export const LC_VERSION_MIN_MACOSX = 0x24;

/**
 * Minimum iPhoneOS version.
 */
export const LC_VERSION_MIN_IPHONEOS = 0x25;

/**
 * Compressed table of function start addresses.
 */
export const LC_FUNCTION_STARTS = 0x26;

/**
 * Dyld environment variable string.
 */
export const LC_DYLD_ENVIRONMENT = 0x27;

/**
 * Replacement for LC_UNIXTHREAD.
 *
 * `0x28 | LC_REQ_DYLD`
 */
export const LC_MAIN = 0x80000028;

/**
 * Table of non-instructions in __text.
 */
export const LC_DATA_IN_CODE = 0x29;

/**
 * Source version used to generate binary.
 */
export const LC_SOURCE_VERSION = 0x2a;

/**
 * Code signing DRs from linked dylibs.
 */
export const LC_DYLIB_CODE_SIGN_DRS = 0x2b;

/**
 * 64-bit encrypted segment info.
 */
export const LC_ENCRYPTION_INFO_64 = 0x2c;

/**
 * Linker options.
 */
export const LC_LINKER_OPTION = 0x2d;

/**
 * Linker optimization hints.
 */
export const LC_LINKER_OPTIMIZATION_HINT = 0x2e;

/**
 * Minimum tvOS version.
 */
export const LC_VERSION_MIN_TVOS = 0x2f;

/**
 * Minimum watchOS version.
 */
export const LC_VERSION_MIN_WATCHOS = 0x30;

/**
 * Arbitrary data.
 */
export const LC_NOTE = 0x31;

/**
 * Build for platform min OS version.
 */
export const LC_BUILD_VERSION = 0x32;

/**
 * Used with linkedit_data_command.
 *
 * `0x33 | LC_REQ_DYLD`
 */
export const LC_DYLD_EXPORTS_TRIE = 0x80000033;

/**
 * Used with linkedit_data_command.
 *
 * `0x34 | LC_REQ_DYLD`
 */
export const LC_DYLD_CHAINED_FIXUPS = 0x80000034;

/**
 * Used with fileset_entry_command.
 *
 * `0x35 | LC_REQ_DYLD`
 */
export const LC_FILESET_ENTRY = 0x80000035;

/**
 * Used with linkedit_data_command.
 */
export const LC_ATOM_INFO = 0x36;

/**
 * Used with linkedit_data_command.
 */
export const LC_FUNCTION_VARIANTS = 0x37;

/**
 * Used with linkedit_data_command.
 */
export const LC_FUNCTION_VARIANT_FIXUPS = 0x38;

/**
 * Target triple used to compile.
 */
export const LC_TARGET_TRIPLE = 0x39;

/**
 * Load command string union.
 */
export class lc_str extends Union {
	/**
	 * String offset.
	 */
	declare public offset: uint32_t;

	static {
		toStringTag(this, 'lc_str');
		uint32(this, 'offset');
		// Union because there was a 32-bit char *ptr.
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Segment command, 32-bit.
 */
export class segment_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<char>;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: uint32_t;

	/**
	 * Virtual memory size.
	 */
	declare public vmsize: uint32_t;

	/**
	 * File offset.
	 */
	declare public fileoff: uint32_t;

	/**
	 * File size.
	 */
	declare public filesize: uint32_t;

	/**
	 * Maximum virtual memory protection.
	 */
	declare public maxprot: int32_t;

	/**
	 * Initial virtual memory protection.
	 */
	declare public initprot: int32_t;

	/**
	 * Number of sections.
	 */
	declare public nsects: uint32_t;

	/**
	 * Flags.
	 */
	declare public flags: uint32_t;

	static {
		toStringTag(this, 'segment_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Int8Ptr, 16), this, 'segname');
		uint32(this, 'vmaddr');
		uint32(this, 'vmsize');
		uint32(this, 'fileoff');
		uint32(this, 'filesize');
		int32(this, 'maxprot');
		int32(this, 'initprot');
		uint32(this, 'nsects');
		uint32(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Segment command, 64-bit.
 */
export class segment_command_64 extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<char>;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: uint64_t;

	/**
	 * Virtual memory size.
	 */
	declare public vmsize: uint64_t;

	/**
	 * File offset.
	 */
	declare public fileoff: uint64_t;

	/**
	 * File size.
	 */
	declare public filesize: uint64_t;

	/**
	 * Maximum virtual memory protection.
	 */
	declare public maxprot: int32_t;

	/**
	 * Initial virtual memory protection.
	 */
	declare public initprot: int32_t;

	/**
	 * Number of sections.
	 */
	declare public nsects: uint32_t;

	/**
	 * Flags.
	 */
	declare public flags: uint32_t;

	static {
		toStringTag(this, 'segment_command_64');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Int8Ptr, 16), this, 'segname');
		uint64(this, 'vmaddr');
		uint64(this, 'vmsize');
		uint64(this, 'fileoff');
		uint64(this, 'filesize');
		int32(this, 'maxprot');
		int32(this, 'initprot');
		uint32(this, 'nsects');
		uint32(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}

// Constants for segment_command flags:

/**
 * Segment is for high part of the VM space.
 */
export const SG_HIGHVM = 0x1;

/**
 * Segment is the VM for a fixed VM library.
 */
export const SG_FVMLIB = 0x2;

/**
 * Segment is not relocated and has no relocations.
 */
export const SG_NORELOC = 0x4;

/**
 * Segment is protected.
 */
export const SG_PROTECTED_VERSION_1 = 0x8;

/**
 * Segment is read-only after fixups.
 */
export const SG_READ_ONLY = 0x10;

/**
 * Section, 32-bit.
 */
export class section extends Struct {
	/**
	 * Section name.
	 */
	declare public sectname: Arr<char>;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<char>;

	/**
	 * Memory address.
	 */
	declare public addr: uint32_t;

	/**
	 * Size in bytes.
	 */
	declare public size: uint32_t;

	/**
	 * File offset.
	 */
	declare public offset: uint32_t;

	/**
	 * Alignment (power of 2).
	 */
	declare public align: uint32_t;

	/**
	 * File offset of relocations.
	 */
	declare public reloff: uint32_t;

	/**
	 * Number of relocations.
	 */
	declare public nreloc: uint32_t;

	/**
	 * Flags.
	 */
	declare public flags: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved1: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved2: uint32_t;

	static {
		toStringTag(this, 'section');
		member(array(Int8Ptr, 16), this, 'sectname');
		member(array(Int8Ptr, 16), this, 'segname');
		uint32(this, 'addr');
		uint32(this, 'size');
		uint32(this, 'offset');
		uint32(this, 'align');
		uint32(this, 'reloff');
		uint32(this, 'nreloc');
		uint32(this, 'flags');
		uint32(this, 'reserved1');
		uint32(this, 'reserved2');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Section, 64-bit.
 */
export class section_64 extends Struct {
	/**
	 * Section name.
	 */
	declare public sectname: Arr<char>;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<char>;

	/**
	 * Memory address.
	 */
	declare public addr: uint64_t;

	/**
	 * Size in bytes.
	 */
	declare public size: uint64_t;

	/**
	 * File offset.
	 */
	declare public offset: uint32_t;

	/**
	 * Alignment (power of 2).
	 */
	declare public align: uint32_t;

	/**
	 * File offset of relocations.
	 */
	declare public reloff: uint32_t;

	/**
	 * Number of relocations.
	 */
	declare public nreloc: uint32_t;

	/**
	 * Flags.
	 */
	declare public flags: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved1: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved2: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved3: uint32_t;

	static {
		toStringTag(this, 'section_64');
		member(array(Int8Ptr, 16), this, 'sectname');
		member(array(Int8Ptr, 16), this, 'segname');
		uint64(this, 'addr');
		uint64(this, 'size');
		uint32(this, 'offset');
		uint32(this, 'align');
		uint32(this, 'reloff');
		uint32(this, 'nreloc');
		uint32(this, 'flags');
		uint32(this, 'reserved1');
		uint32(this, 'reserved2');
		uint32(this, 'reserved3');
		constant(this, 'BYTE_LENGTH');
	}
}

// Masks for section flags:

/**
 * Section type mask.
 */
export const SECTION_TYPE = 0x000000ff;

/**
 * Section attributes mask.
 */
export const SECTION_ATTRIBUTES = 0xffffff00;

// Constants for section type:

/**
 * Regular section.
 */
export const S_REGULAR = 0x0;

/**
 * Zero fill on demand section.
 */
export const S_ZEROFILL = 0x1;

/**
 * Section of only literal C-strings.
 */
export const S_CSTRING_LITERALS = 0x2;

/**
 * Section of only 4-byte literals.
 */
export const S_4BYTE_LITERALS = 0x3;

/**
 * Section of only 8-byte literals.
 */
export const S_8BYTE_LITERALS = 0x4;

/**
 * Section with only pointer to literals.
 */
export const S_LITERAL_POINTERS = 0x5;

/**
 * Section with only non-lazy symbol pointers.
 */
export const S_NON_LAZY_SYMBOL_POINTERS = 0x6;

/**
 * Section with only lazy symbol pointers.
 */
export const S_LAZY_SYMBOL_POINTERS = 0x7;

/**
 * Section with only symbol stubs.
 */
export const S_SYMBOL_STUBS = 0x8;

/**
 * Section with only function pointers for initialization.
 */
export const S_MOD_INIT_FUNC_POINTERS = 0x9;

/**
 * Section with only function pointers for termination.
 */
export const S_MOD_TERM_FUNC_POINTERS = 0xa;

/**
 * Section contains coalesced symbols.
 */
export const S_COALESCED = 0xb;

/**
 * Zero fill on demand section (can be larger than 4GB).
 */
export const S_GB_ZEROFILL = 0xc;

/**
 * Section with only interposing function pointer pairs.
 */
export const S_INTERPOSING = 0xd;

/**
 * Section with only 16-byte literals.
 */
export const S_16BYTE_LITERALS = 0xe;

/**
 * Section contains DTrace Object Format objects.
 */
export const S_DTRACE_DOF = 0xf;

/**
 * Section with only lazy symbol pointers to lazy loaded dylibs.
 */
export const S_LAZY_DYLIB_SYMBOL_POINTERS = 0x10;

/**
 * Template of initial values for regular thread local variables.
 */
export const S_THREAD_LOCAL_REGULAR = 0x11;

/**
 * Template of initial values for zerofill thread local variables.
 */
export const S_THREAD_LOCAL_ZEROFILL = 0x12;

/**
 * Thread local variable descriptors.
 */
export const S_THREAD_LOCAL_VARIABLES = 0x13;

/**
 * Pointers to thread local variable descriptors.
 */
export const S_THREAD_LOCAL_VARIABLE_POINTERS = 0x14;

/**
 * Functions to call to initialize thread local variables.
 */
export const S_THREAD_LOCAL_INIT_FUNCTION_POINTERS = 0x15;

/**
 * Offsets to initializer functions.
 */
export const S_INIT_FUNC_OFFSETS = 0x16;

// Constants for section attributes:

/**
 * User setable attributes.
 */
export const SECTION_ATTRIBUTES_USR = 0xff000000;

/**
 * Section is pure machine instructions.
 */
export const S_ATTR_PURE_INSTRUCTIONS = 0x80000000;

/**
 * Section contains coalsed symbols not in a ranlib table of contents.
 */
export const S_ATTR_NO_TOC = 0x40000000;

/**
 * Allow stripping static symbols.
 */
export const S_ATTR_STRIP_STATIC_SYMS = 0x20000000;

/**
 * Prevent dead stripping.
 */
export const S_ATTR_NO_DEAD_STRIP = 0x10000000;

/**
 * Blocks are live is they reference live blocks.
 */
export const S_ATTR_LIVE_SUPPORT = 0x08000000;

/**
 * Allos self modifying code.
 */
export const S_ATTR_SELF_MODIFYING_CODE = 0x04000000;

/**
 * Debug section.
 */
export const S_ATTR_DEBUG = 0x02000000;

/**
 * System setable attributes.
 */
export const SECTION_ATTRIBUTES_SYS = 0x00ffff00;

/**
 * Section contains some machine instructions.
 */
export const S_ATTR_SOME_INSTRUCTIONS = 0x00000400;

/**
 * Section has external relocation entries.
 */
export const S_ATTR_EXT_RELOC = 0x00000200;

/**
 * Section has local relocation entries.
 */
export const S_ATTR_LOC_RELOC = 0x00000100;

// Names for known segments and sections:

/**
 * The pagezero segment.
 */
export const SEG_PAGEZERO = '__PAGEZERO';

/**
 * UNIX text segment.
 */
export const SEG_TEXT = '__TEXT';

/**
 * Real text part of text segment.
 */
export const SECT_TEXT = '__text';

/**
 * The fvmlib initialization section.
 */
export const SECT_FVMLIB_INIT0 = '__fvmlib_init0';

/**
 * Section following fvmlib initialization.
 */
export const SECT_FVMLIB_INIT1 = '__fvmlib_init1';

/**
 * UNIX data segment.
 */
export const SEG_DATA = '__DATA';

/**
 * Real initialized data section.
 */
export const SECT_DATA = '__data';

/**
 * Real uninitialized data section.
 */
export const SECT_BSS = '__bss';

/**
 * Section common symbols.
 */
export const SECT_COMMON = '__common';

/**
 * Objective-C runtime segment.
 */
export const SEG_OBJC = '__OBJC';

/**
 * Objective-C symbol table.
 */
export const SECT_OBJC_SYMBOLS = '__symbol_table';

/**
 * Objective-C module information.
 */
export const SECT_OBJC_MODULES = '__module_info';

/**
 * Objective-C selector strings table.
 */
export const SECT_OBJC_STRINGS = '__selector_strs';

/**
 * Objective-C reference string table.
 */
export const SECT_OBJC_REFS = '__selector_refs';

/**
 * Icon segment.
 */
export const SEG_ICON = '__ICON';

/**
 * Icon header.
 */
export const SECT_ICON_HEADER = '__header';

/**
 * Icon images in TIFF format.
 */
export const SECT_ICON_TIFF = '__tiff';

/**
 * Link editor segment.
 */
export const SEG_LINKEDIT = '__LINKEDIT';

/**
 * UNIX stack segment.
 */
export const SEG_UNIXSTACK = '__UNIXSTACK';

/**
 * Segment for self modifying code stubs.
 */
export const SEG_IMPORT = '__IMPORT';

/**
 * Fixed virtual memory shared library.
 */
export class fvmlib extends Struct {
	/**
	 * Target pathname.
	 */
	declare public name: lc_str;

	/**
	 * Minor version.
	 */
	declare public minor_version: uint32_t;

	/**
	 * Header address.
	 */
	declare public header_addr: uint32_t;

	static {
		toStringTag(this, 'fvmlib');
		member(lc_str, this, 'name');
		uint32(this, 'minor_version');
		uint32(this, 'header_addr');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Fixed virtual memory shared library command.
 */
export class fvmlib_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Library identification.
	 */
	declare public fvmlib: fvmlib;

	static {
		toStringTag(this, 'fvmlib_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(fvmlib, this, 'fvmlib');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dynamically linked shared library.
 */
export class dylib extends Struct {
	/**
	 * Pathname.
	 */
	declare public name: lc_str;

	/**
	 * Build timestamp.
	 */
	declare public timestamp: uint32_t;

	/**
	 * Current version.
	 */
	declare public current_version: uint32_t;

	/**
	 * Compatibility version.
	 */
	declare public compatibility_version: uint32_t;

	static {
		toStringTag(this, 'dylib');
		member(lc_str, this, 'name');
		uint32(this, 'timestamp');
		uint32(this, 'current_version');
		uint32(this, 'compatibility_version');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dynamically linked shared library command.
 */
export class dylib_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Library identification.
	 */
	declare public dylib: dylib;

	static {
		toStringTag(this, 'dylib_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(dylib, this, 'dylib');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dynamically linked shared library use command.
 */
export class dylib_use_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Path offset.
	 */
	declare public nameoff: uint32_t;

	/**
	 * Use marker.
	 */
	declare public marker: uint32_t;

	/**
	 * Current version.
	 */
	declare public current_version: uint32_t;

	/**
	 * Compatibility version.
	 */
	declare public compat_version: uint32_t;

	/**
	 * Flags.
	 */
	declare public flags: uint32_t;

	static {
		toStringTag(this, 'dylib_use_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'nameoff');
		uint32(this, 'marker');
		uint32(this, 'current_version');
		uint32(this, 'compat_version');
		uint32(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}

// Dylib flags:

/**
 * Dylib use weak link.
 */
export const DYLIB_USE_WEAK_LINK = 0x01;

/**
 * Dylib use re-export.
 */
export const DYLIB_USE_REEXPORT = 0x02;

/**
 * Dylib use upward.
 */
export const DYLIB_USE_UPWARD = 0x04;

/**
 * Dylib use delayed init.
 */
export const DYLIB_USE_DELAYED_INIT = 0x08;

/**
 * Dylib use marker.
 */
export const DYLIB_USE_MARKER = 0x1a741800;

/**
 * Sub framework command.
 */
export class sub_framework_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * The umbrella framework name.
	 */
	declare public umbrella: lc_str;

	static {
		toStringTag(this, 'sub_framework_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'umbrella');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Sub client command.
 */
export class sub_client_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * The client name.
	 */
	declare public client: lc_str;

	static {
		toStringTag(this, 'sub_client_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'client');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Sub client command.
 */
export class sub_umbrella_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * The framework name.
	 */
	declare public sub_umbrella: lc_str;

	static {
		toStringTag(this, 'sub_umbrella_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'sub_umbrella');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Sub library command.
 */
export class sub_library_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * The sub_library name.
	 */
	declare public sub_library: lc_str;

	static {
		toStringTag(this, 'sub_library_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'sub_library');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Prebound dynamic library command.
 */
export class prebound_dylib_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Path of library.
	 */
	declare public name: lc_str;

	/**
	 * Number of modules in library.
	 */
	declare public nmodules: uint32_t;

	/**
	 * Bit vector of linked modules.
	 */
	declare public linked_modules: lc_str;

	static {
		toStringTag(this, 'prebound_dylib_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'name');
		uint32(this, 'nmodules');
		member(lc_str, this, 'linked_modules');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dynamic linker command.
 */
export class dylinker_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Path name.
	 */
	declare public name: lc_str;

	static {
		toStringTag(this, 'dylinker_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'name');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Thread command.
 */
export class thread_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	static {
		toStringTag(this, 'thread_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		// Contains machine specific data.
		// uint32_t flavor
		// uint32_t count
		// struct XXX_thread_state state
		// ...
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Routines command, 32-bit.
 */
export class routines_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Address of initialization routine.
	 */
	declare public init_address: uint32_t;

	/**
	 * Index of initialization routine in module table.
	 */
	declare public init_module: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved1: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved2: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved3: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved4: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved5: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved6: uint32_t;

	static {
		toStringTag(this, 'routines_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'init_address');
		uint32(this, 'init_module');
		uint32(this, 'reserved1');
		uint32(this, 'reserved2');
		uint32(this, 'reserved3');
		uint32(this, 'reserved4');
		uint32(this, 'reserved5');
		uint32(this, 'reserved6');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Routines command, 64-bit.
 */
export class routines_command_64 extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Address of initialization routine.
	 */
	declare public init_address: uint64_t;

	/**
	 * Index of initialization routine in module table.
	 */
	declare public init_module: uint64_t;

	/**
	 * Reserved.
	 */
	declare public reserved1: uint64_t;

	/**
	 * Reserved.
	 */
	declare public reserved2: uint64_t;

	/**
	 * Reserved.
	 */
	declare public reserved3: uint64_t;

	/**
	 * Reserved.
	 */
	declare public reserved4: uint64_t;

	/**
	 * Reserved.
	 */
	declare public reserved5: uint64_t;

	/**
	 * Reserved.
	 */
	declare public reserved6: uint64_t;

	static {
		toStringTag(this, 'routines_command_64');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'init_address');
		uint64(this, 'init_module');
		uint64(this, 'reserved1');
		uint64(this, 'reserved2');
		uint64(this, 'reserved3');
		uint64(this, 'reserved4');
		uint64(this, 'reserved5');
		uint64(this, 'reserved6');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Symtab command.
 */
export class symtab_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Symbol table offset.
	 */
	declare public symoff: uint32_t;

	/**
	 * Symbol table entries.
	 */
	declare public nsyms: uint32_t;

	/**
	 * String table offset.
	 */
	declare public stroff: uint32_t;

	/**
	 * String table byte length.
	 */
	declare public strsize: uint32_t;

	static {
		toStringTag(this, 'symtab_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'symoff');
		uint32(this, 'nsyms');
		uint32(this, 'stroff');
		uint32(this, 'strsize');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dysymtab command.
 */
export class dysymtab_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Index of local symbols.
	 */
	declare public ilocalsym: uint32_t;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: uint32_t;

	/**
	 * Index of externally defined symbols.
	 */
	declare public iextdefsym: uint32_t;

	/**
	 * Number of externally defined symbols.
	 */
	declare public nextdefsym: uint32_t;

	/**
	 * Index of undefined symbols.
	 */
	declare public iundefsym: uint32_t;

	/**
	 * Number of undefined symbols.
	 */
	declare public nundefsym: uint32_t;

	/**
	 * Table of contents file offset.
	 */
	declare public tocoff: uint32_t;

	/**
	 * Number of table of contents entries.
	 */
	declare public ntoc: uint32_t;

	/**
	 * Module table file offset.
	 */
	declare public modtaboff: uint32_t;

	/**
	 * Number of module table entries.
	 */
	declare public nmodtab: uint32_t;

	/**
	 * Offset of referenced symbol table.
	 */
	declare public extrefsymoff: uint32_t;

	/**
	 * Number of referenced symbol table entries.
	 */
	declare public nextrefsyms: uint32_t;

	/**
	 * Indirect symbol table file offset.
	 */
	declare public indirectsymoff: uint32_t;

	/**
	 * Number of indirect symbol table entries.
	 */
	declare public nindirectsyms: uint32_t;

	/**
	 * Offset of external relocation entries.
	 */
	declare public extreloff: uint32_t;

	/**
	 * Number of external relocation entries.
	 */
	declare public nextrel: uint32_t;

	/**
	 * Offset of local relocation entries.
	 */
	declare public locreloff: uint32_t;

	/**
	 * Number of local relocation entries.
	 */
	declare public nlocrel: uint32_t;

	static {
		toStringTag(this, 'dysymtab_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'ilocalsym');
		uint32(this, 'nlocalsym');
		uint32(this, 'iextdefsym');
		uint32(this, 'nextdefsym');
		uint32(this, 'iundefsym');
		uint32(this, 'nundefsym');
		uint32(this, 'tocoff');
		uint32(this, 'ntoc');
		uint32(this, 'modtaboff');
		uint32(this, 'nmodtab');
		uint32(this, 'extrefsymoff');
		uint32(this, 'nextrefsyms');
		uint32(this, 'indirectsymoff');
		uint32(this, 'nindirectsyms');
		uint32(this, 'extreloff');
		uint32(this, 'nextrel');
		uint32(this, 'locreloff');
		uint32(this, 'nlocrel');
		constant(this, 'BYTE_LENGTH');
	}
}

// Indirect symbol table constants:

/**
 * Indirect symbol local.
 */
export const INDIRECT_SYMBOL_LOCAL = 0x80000000;

/**
 * Indirect symbol absolute.
 */
export const INDIRECT_SYMBOL_ABS = 0x40000000;

/**
 * Dylib table of contents entry.
 */
export class dylib_table_of_contents extends Struct {
	/**
	 * External symbol index in symbol table.
	 */
	declare public symbol_index: uint32_t;

	/**
	 * Index in module table.
	 */
	declare public module_index: uint32_t;

	static {
		toStringTag(this, 'dylib_table_of_contents');
		uint32(this, 'symbol_index');
		uint32(this, 'module_index');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dylib module table entry, 32-bit.
 */
export class dylib_module extends Struct {
	/**
	 * Module name index in string table.
	 */
	declare public module_name: uint32_t;

	/**
	 * Index in external symbols.
	 */
	declare public iextdefsym: uint32_t;

	/**
	 * Number of external symbols.
	 */
	declare public nextdefsym: uint32_t;

	/**
	 * Index in reference symbol table.
	 */
	declare public irefsym: uint32_t;

	/**
	 * Number of reference symbol table.
	 */
	declare public nrefsym: uint32_t;

	/**
	 * Index in local symbols.
	 */
	declare public ilocalsym: uint32_t;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: uint32_t;

	/**
	 * Index in external relocations.
	 */
	declare public iextrel: uint32_t;

	/**
	 * Number of external relocations.
	 */
	declare public nextrel: uint32_t;

	/**
	 * Low 16 bits index of init section.
	 * High 16 bits index of term section.
	 */
	declare public iinit_iterm: uint32_t;

	/**
	 * Low 16 bits number of init section.
	 * High 16 bits number of term section.
	 */
	declare public ninit_nterm: uint32_t;

	/**
	 * Address of start of module info section.
	 */
	declare public objc_module_info_addr: uint32_t;

	/**
	 * Size of module info section.
	 */
	declare public objc_module_info_size: uint32_t;

	static {
		toStringTag(this, 'dylib_module');
		uint32(this, 'module_name');
		uint32(this, 'iextdefsym');
		uint32(this, 'nextdefsym');
		uint32(this, 'irefsym');
		uint32(this, 'nrefsym');
		uint32(this, 'ilocalsym');
		uint32(this, 'nlocalsym');
		uint32(this, 'iextrel');
		uint32(this, 'nextrel');
		uint32(this, 'iinit_iterm');
		uint32(this, 'ninit_nterm');
		uint32(this, 'objc_module_info_addr');
		uint32(this, 'objc_module_info_size');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dylib module table entry, 64-bit.
 */
export class dylib_module_64 extends Struct {
	/**
	 * Module name index in string table.
	 */
	declare public module_name: uint32_t;

	/**
	 * Index in external symbols.
	 */
	declare public iextdefsym: uint32_t;

	/**
	 * Number of external symbols.
	 */
	declare public nextdefsym: uint32_t;

	/**
	 * Index in reference symbol table.
	 */
	declare public irefsym: uint32_t;

	/**
	 * Number of reference symbol table.
	 */
	declare public nrefsym: uint32_t;

	/**
	 * Index in local symbols.
	 */
	declare public ilocalsym: uint32_t;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: uint32_t;

	/**
	 * Index in external relocations.
	 */
	declare public iextrel: uint32_t;

	/**
	 * Number of external relocations.
	 */
	declare public nextrel: uint32_t;

	/**
	 * Low 16 bits index of init section.
	 * High 16 bits index of term section.
	 */
	declare public iinit_iterm: uint32_t;

	/**
	 * Low 16 bits number of init section.
	 * High 16 bits number of term section.
	 */
	declare public ninit_nterm: uint32_t;

	/**
	 * Size of module info section.
	 */
	declare public objc_module_info_size: uint32_t;

	/**
	 * Address of start of module info section.
	 */
	declare public objc_module_info_addr: uint64_t;

	static {
		toStringTag(this, 'dylib_module_64');
		uint32(this, 'module_name');
		uint32(this, 'iextdefsym');
		uint32(this, 'nextdefsym');
		uint32(this, 'irefsym');
		uint32(this, 'nrefsym');
		uint32(this, 'ilocalsym');
		uint32(this, 'nlocalsym');
		uint32(this, 'iextrel');
		uint32(this, 'nextrel');
		uint32(this, 'iinit_iterm');
		uint32(this, 'ninit_nterm');
		uint32(this, 'objc_module_info_size');
		uint64(this, 'objc_module_info_addr');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Reference symbol table entry.
 */
export class dylib_reference extends Struct {
	/**
	 * Index in symbol table.
	 */
	declare public isym: bitfield<uint32_t, 24>;

	/**
	 * Flags for reference type.
	 */
	declare public flags: bitfield<uint32_t, 8>;

	static {
		toStringTag(this, 'dylib_reference');
		uint24(this, 'isym');
		uint8(this, 'flags');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Two-level namespace lookup hints table command.
 */
export class twolevel_hints_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Hints table offset.
	 */
	declare public offset: uint32_t;

	/**
	 * Number of hints in table.
	 */
	declare public nhints: uint32_t;

	static {
		toStringTag(this, 'twolevel_hints_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'offset');
		uint32(this, 'nhints');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Two-level namespace lookup hints table entry.
 */
export class twolevel_hint extends Struct {
	/**
	 * Index in symbol table.
	 */
	declare public isub_image: bitfield<uint32_t, 8>;

	/**
	 * Flags for reference type.
	 */
	declare public itoc: bitfield<uint32_t, 24>;

	static {
		toStringTag(this, 'twolevel_hint');
		uint8(this, 'isub_image');
		uint24(this, 'itoc');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Prebind checksum command.
 */
export class prebind_cksum_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Checksum or zero.
	 */
	declare public cksum: uint32_t;

	static {
		toStringTag(this, 'prebind_cksum_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'cksum');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * UUID command.
 */
export class uuid_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * 128-bit UUID.
	 */
	declare public uuid: Arr<uint8_t>;

	static {
		toStringTag(this, 'uuid_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Uint8Ptr, 16), this, 'uuid');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Rpath command.
 */
export class rpath_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Path to add to run path.
	 */
	declare public path: lc_str;

	static {
		toStringTag(this, 'rpath_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'path');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Target triple command.
 */
export class target_triple_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Target triple string.
	 */
	declare public triple: lc_str;

	static {
		toStringTag(this, 'target_triple_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'triple');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Linkedit data command.
 */
export class linkedit_data_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * File offset of data in __LINKEDIT segment.
	 */
	declare public dataoff: uint32_t;

	/**
	 * File size of data in __LINKEDIT segment.
	 */
	declare public datasize: uint32_t;

	static {
		toStringTag(this, 'linkedit_data_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'dataoff');
		uint32(this, 'datasize');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Encryption info command, 32-bit.
 */
export class encryption_info_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * File offset of encrypted range.
	 */
	declare public cryptoff: uint32_t;

	/**
	 * File size of encrypted range.
	 */
	declare public cryptsize: uint32_t;

	/**
	 * Encryption system ID, 0 for not encrypted yet.
	 */
	declare public cryptid: uint32_t;

	static {
		toStringTag(this, 'encryption_info_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'cryptoff');
		uint32(this, 'cryptsize');
		uint32(this, 'cryptid');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Encryption info command, 64-bit.
 */
export class encryption_info_command_64 extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * File offset of encrypted range.
	 */
	declare public cryptoff: uint32_t;

	/**
	 * File size of encrypted range.
	 */
	declare public cryptsize: uint32_t;

	/**
	 * Encryption system ID, 0 for not encrypted yet.
	 */
	declare public cryptid: uint32_t;

	/**
	 * Padding to align to 8 bytes.
	 */
	declare public pad: uint32_t;

	static {
		toStringTag(this, 'encryption_info_command_64');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'cryptoff');
		uint32(this, 'cryptsize');
		uint32(this, 'cryptid');
		uint32(this, 'pad');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Minimum OS version command.
 */
export class version_min_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public version: uint32_t;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public sdk: uint32_t;

	static {
		toStringTag(this, 'version_min_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'version');
		uint32(this, 'sdk');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Minimum OS build version command.
 */
export class build_version_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Platform.
	 */
	declare public platform: uint32_t;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public minos: uint32_t;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public sdk: uint32_t;

	/**
	 * Number of tool entries that follow.
	 */
	declare public ntools: uint32_t;

	static {
		toStringTag(this, 'build_version_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'platform');
		uint32(this, 'minos');
		uint32(this, 'sdk');
		uint32(this, 'ntools');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Build tool version.
 */
export class build_tool_version extends Struct {
	/**
	 * Tool ID.
	 */
	declare public tool: uint32_t;

	/**
	 * Version number.
	 */
	declare public version: uint32_t;

	static {
		toStringTag(this, 'build_tool_version');
		uint32(this, 'tool');
		uint32(this, 'version');
		constant(this, 'BYTE_LENGTH');
	}
}

// Known platforms:

/**
 * Unknown platform.
 */
export const PLATFORM_UNKNOWN = 0;

/**
 * Any platform.
 */
export const PLATFORM_ANY = 0xffffffff;

/**
 * Platform: macOS.
 */
export const PLATFORM_MACOS = 1;

/**
 * Platform: iOS.
 */
export const PLATFORM_IOS = 2;

/**
 * Platform: tvOS.
 */
export const PLATFORM_TVOS = 3;

/**
 * Platform: watchOS.
 */
export const PLATFORM_WATCHOS = 4;

/**
 * Platform: bridgeOS.
 */
export const PLATFORM_BRIDGEOS = 5;

/**
 * Platform: macOS Catalyst.
 */
export const PLATFORM_MACCATALYST = 6;

/**
 * Platform: iOS Simulator.
 */
export const PLATFORM_IOSSIMULATOR = 7;

/**
 * Platform: tvOS Simulator.
 */
export const PLATFORM_TVOSSIMULATOR = 8;

/**
 * Platform: watchOS Simulator.
 */
export const PLATFORM_WATCHOSSIMULATOR = 9;

/**
 * Platform: DriverKit.
 */
export const PLATFORM_DRIVERKIT = 10;

/**
 * Platform: VisionOS.
 */
export const PLATFORM_VISIONOS = 11;

/**
 * Platform: VisionOS Simulator.
 */
export const PLATFORM_VISIONOSSIMULATOR = 12;

/**
 * Platform: Firmware.
 */
export const PLATFORM_FIRMWARE = 13;

/**
 * Platform: SEPOS.
 */
export const PLATFORM_SEPOS = 14;

/**
 * Platform: macOS ExclaveCore.
 */
export const PLATFORM_MACOS_EXCLAVECORE = 15;

/**
 * Platform: macOS ExclaveKit.
 */
export const PLATFORM_MACOS_EXCLAVEKIT = 16;

/**
 * Platform: iOS ExclaveCore.
 */
export const PLATFORM_IOS_EXCLAVECORE = 17;

/**
 * Platform: iOS ExclaveKit.
 */
export const PLATFORM_IOS_EXCLAVEKIT = 18;

/**
 * Platform: tvOS ExclaveCore.
 */
export const PLATFORM_TVOS_EXCLAVECORE = 19;

/**
 * Platform: tvOS ExclaveKit.
 */
export const PLATFORM_TVOS_EXCLAVEKIT = 20;

/**
 * Platform: watchOS ExclaveCore.
 */
export const PLATFORM_WATCHOS_EXCLAVECORE = 21;

/**
 * Platform: watchOS ExclaveKit.
 */
export const PLATFORM_WATCHOS_EXCLAVEKIT = 22;

/**
 * Platform: VisionOS ExclaveCore.
 */
export const PLATFORM_VISIONOS_EXCLAVECORE = 23;

/**
 * Platform: VisionOS ExclaveKit.
 */
export const PLATFORM_VISIONOS_EXCLAVEKIT = 24;

// Known tools:

/**
 * Tool: Clang.
 */
export const TOOL_CLANG = 1;

/**
 * Tool: Swift.
 */
export const TOOL_SWIFT = 2;

/**
 * Tool: ld.
 */
export const TOOL_LD = 3;

/**
 * Tool: lld.
 */
export const TOOL_LLD = 4;

// Known GPU tools:

/**
 * Tool: Metal.
 */
export const TOOL_METAL = 1024;

/**
 * Tool: AirLLD.
 */
export const TOOL_AIRLLD = 1025;

/**
 * Tool: AirNT.
 */
export const TOOL_AIRNT = 1026;

/**
 * Tool: AirNT plugin.
 */
export const TOOL_AIRNT_PLUGIN = 1027;

/**
 * Tool: AirPack.
 */
export const TOOL_AIRPACK = 1028;

/**
 * Tool: GPUArchiver.
 */
export const TOOL_GPUARCHIVER = 1031;

/**
 * Tool: Metal Framework.
 */
export const TOOL_METAL_FRAMEWORK = 1032;

/**
 * Dyld info command.
 */
export class dyld_info_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * File offset of rebase info.
	 */
	declare public rebase_off: uint32_t;

	/**
	 * Size of rebase info.
	 */
	declare public rebase_size: uint32_t;

	/**
	 * File offset of binding info.
	 */
	declare public bind_off: uint32_t;

	/**
	 * Size of binding info.
	 */
	declare public bind_size: uint32_t;

	/**
	 * File offset of weak binding info.
	 */
	declare public weak_bind_off: uint32_t;

	/**
	 * Size of weak binding info.
	 */
	declare public weak_bind_size: uint32_t;

	/**
	 * File offset of lazy binding info.
	 */
	declare public lazy_bind_off: uint32_t;

	/**
	 * Size of lazy binding info.
	 */
	declare public lazy_bind_size: uint32_t;

	/**
	 * File offset of export info.
	 */
	declare public export_off: uint32_t;

	/**
	 * Size of export info.
	 */
	declare public export_size: uint32_t;

	static {
		toStringTag(this, 'dyld_info_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'rebase_off');
		uint32(this, 'rebase_size');
		uint32(this, 'bind_off');
		uint32(this, 'bind_size');
		uint32(this, 'weak_bind_off');
		uint32(this, 'weak_bind_size');
		uint32(this, 'lazy_bind_off');
		uint32(this, 'lazy_bind_size');
		uint32(this, 'export_off');
		uint32(this, 'export_size');
		constant(this, 'BYTE_LENGTH');
	}
}

// Rebasing information:

/**
 * Rebase type: pointer.
 */
export const REBASE_TYPE_POINTER = 1;

/**
 * Rebase type: text absolute 32.
 */
export const REBASE_TYPE_TEXT_ABSOLUTE32 = 2;

/**
 * Rebase type: text pcrel 32.
 */
export const REBASE_TYPE_TEXT_PCREL32 = 3;

/**
 * Rebase opcode mask.
 */
export const REBASE_OPCODE_MASK = 0xf0;

/**
 * Rebase immediate mask.
 */
export const REBASE_IMMEDIATE_MASK = 0x0f;

/**
 * Rebase opcode: done.
 */
export const REBASE_OPCODE_DONE = 0x00;

/**
 * Rebase opcode: set type imm.
 */
export const REBASE_OPCODE_SET_TYPE_IMM = 0x10;

/**
 * Rebase opcode: set segment and offset uleb.
 */
export const REBASE_OPCODE_SET_SEGMENT_AND_OFFSET_ULEB = 0x20;

/**
 * Rebase opcode: add addr uleb.
 */
export const REBASE_OPCODE_ADD_ADDR_ULEB = 0x30;

/**
 * Rebase opcode: add addr imm scaled.
 */
export const REBASE_OPCODE_ADD_ADDR_IMM_SCALED = 0x40;

/**
 * Rebase opcode: do rebase imm times.
 */
export const REBASE_OPCODE_DO_REBASE_IMM_TIMES = 0x50;

/**
 * Rebase opcode: do rebase uleb times.
 */
export const REBASE_OPCODE_DO_REBASE_ULEB_TIMES = 0x60;

/**
 * Rebase opcode: do rebase add addr uleb.
 */
export const REBASE_OPCODE_DO_REBASE_ADD_ADDR_ULEB = 0x70;

/**
 * Rebase opcode: do rebase uleb times skipping uleb.
 */
export const REBASE_OPCODE_DO_REBASE_ULEB_TIMES_SKIPPING_ULEB = 0x80;

// Binding information:

/**
 * Bind type: pointer.
 */
export const BIND_TYPE_POINTER = 1;

/**
 * Bind type: text absolute 32.
 */
export const BIND_TYPE_TEXT_ABSOLUTE32 = 2;

/**
 * Bind type: text pcrel 32.
 */
export const BIND_TYPE_TEXT_PCREL32 = 3;

/**
 * Bind special: dylib self.
 */
export const BIND_SPECIAL_DYLIB_SELF = 0;

/**
 * Bind special: dylib main executable.
 */
export const BIND_SPECIAL_DYLIB_MAIN_EXECUTABLE = -1;

/**
 * Bind special: dylib flat lookup.
 */
export const BIND_SPECIAL_DYLIB_FLAT_LOOKUP = -2;

/**
 * Bind special: dylib weak lookup.
 */
export const BIND_SPECIAL_DYLIB_WEAK_LOOKUP = -3;

/**
 * Bind symbol flags: weak import.
 */
export const BIND_SYMBOL_FLAGS_WEAK_IMPORT = 0x1;

/**
 * Bind symbol flags: non-weak definition.
 */
export const BIND_SYMBOL_FLAGS_NON_WEAK_DEFINITION = 0x8;

/**
 * Bind opcode mask.
 */
export const BIND_OPCODE_MASK = 0xf0;

/**
 * Bind immediate mask.
 */
export const BIND_IMMEDIATE_MASK = 0x0f;

/**
 * Bind opcode: done.
 */
export const BIND_OPCODE_DONE = 0x00;

/**
 * Bind opcode: set dylib ordinal imm.
 */
export const BIND_OPCODE_SET_DYLIB_ORDINAL_IMM = 0x10;

/**
 * Bind opcode: set dylib ordinal uleb.
 */
export const BIND_OPCODE_SET_DYLIB_ORDINAL_ULEB = 0x20;

/**
 * Bind opcode: set dylib special imm.
 */
export const BIND_OPCODE_SET_DYLIB_SPECIAL_IMM = 0x30;

/**
 * Bind opcode: set symbol flags trailing flags imm.
 */
export const BIND_OPCODE_SET_SYMBOL_TRAILING_FLAGS_IMM = 0x40;

/**
 * Bind opcode: set type imm.
 */
export const BIND_OPCODE_SET_TYPE_IMM = 0x50;

/**
 * Bind opcode: set addend sleb.
 */
export const BIND_OPCODE_SET_ADDEND_SLEB = 0x60;

/**
 * Bind opcode: set segment and offset uleb.
 */
export const BIND_OPCODE_SET_SEGMENT_AND_OFFSET_ULEB = 0x70;

/**
 * Bind opcode: add addr uleb.
 */
export const BIND_OPCODE_ADD_ADDR_ULEB = 0x80;

/**
 * Bind opcode: do bind.
 */
export const BIND_OPCODE_DO_BIND = 0x90;

/**
 * Bind opcode: do bind add addr uleb.
 */
export const BIND_OPCODE_DO_BIND_ADD_ADDR_ULEB = 0xa0;

/**
 * Bind opcode: do bind add addr imm scaled.
 */
export const BIND_OPCODE_DO_BIND_ADD_ADDR_IMM_SCALED = 0xb0;

/**
 * Bind opcode: do bind uleb times skipping uleb.
 */
export const BIND_OPCODE_DO_BIND_ULEB_TIMES_SKIPPING_ULEB = 0xc0;

/**
 * Bind opcode: threaded.
 */
export const BIND_OPCODE_THREADED = 0xd0;

/**
 * Bind subopcode threaded: set bind ordinal table size uleb.
 */
export const BIND_SUBOPCODE_THREADED_SET_BIND_ORDINAL_TABLE_SIZE_ULEB = 0x00;

/**
 * Bind subopcode threaded: apply.
 */
export const BIND_SUBOPCODE_THREADED_APPLY = 0x01;

// Export info:

/**
 * Export symbol flags kind mask.
 */
export const EXPORT_SYMBOL_FLAGS_KIND_MASK = 0x03;

/**
 * Export symbol flags kind: regular.
 */
export const EXPORT_SYMBOL_FLAGS_KIND_REGULAR = 0x00;

/**
 * Export symbol flags kind: thread local.
 */
export const EXPORT_SYMBOL_FLAGS_KIND_THREAD_LOCAL = 0x01;

/**
 * Export symbol flags kind: absolute.
 */
export const EXPORT_SYMBOL_FLAGS_KIND_ABSOLUTE = 0x02;

/**
 * Export symbol flags kind: weak definition.
 */
export const EXPORT_SYMBOL_FLAGS_WEAK_DEFINITION = 0x04;

/**
 * Export symbol flags: re-export.
 */
export const EXPORT_SYMBOL_FLAGS_REEXPORT = 0x08;

/**
 * Export symbol flags: stub and resolver.
 */
export const EXPORT_SYMBOL_FLAGS_STUB_AND_RESOLVER = 0x10;

/**
 * Export symbol flags: static resolver.
 */
export const EXPORT_SYMBOL_FLAGS_STATIC_RESOLVER = 0x20;

/**
 * Linker option command.
 */
export class linker_option_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Number of following strings.
	 */
	declare public count: uint32_t;

	static {
		toStringTag(this, 'linker_option_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'count');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Symbol table command.
 */
export class symseg_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Segment offset.
	 */
	declare public offset: uint32_t;

	/**
	 * Segment size.
	 */
	declare public size: uint32_t;

	static {
		toStringTag(this, 'symseg_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint32(this, 'offset');
		uint32(this, 'size');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Ident command.
 */
export class ident_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	static {
		toStringTag(this, 'ident_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Fixed virtual memory file command.
 */
export class fvmfile_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * File pathname.
	 */
	declare public name: lc_str;

	/**
	 * File virtual address.
	 */
	declare public header_addr: uint32_t;

	static {
		toStringTag(this, 'fvmfile_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(lc_str, this, 'name');
		uint32(this, 'header_addr');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Entry point command.
 */
export class entry_point_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * File __TEXT offset of main entry point.
	 */
	declare public entryoff: uint64_t;

	/**
	 * Initial stack size, if non-zero.
	 */
	declare public stacksize: uint64_t;

	static {
		toStringTag(this, 'entry_point_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'entryoff');
		uint64(this, 'stacksize');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Source version command.
 */
export class source_version_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * A.B.C.D.E packed as a24.b10.c10.d10.e10.
	 */
	declare public version: uint64_t;

	static {
		toStringTag(this, 'source_version_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'version');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Data in code entry.
 */
export class data_in_code_entry extends Struct {
	/**
	 * Offset from mach_header to start of data range.
	 */
	declare public offset: uint32_t;

	/**
	 * Data range byte length.
	 */
	declare public length: uint16_t;

	/**
	 * Kind (DICE_KIND_*).
	 */
	declare public kind: uint16_t;

	static {
		toStringTag(this, 'data_in_code_entry');
		uint32(this, 'offset');
		uint16(this, 'length');
		uint16(this, 'kind');
		constant(this, 'BYTE_LENGTH');
	}
}

// Data in code entries:

/**
 * Data in code entry kind: data.
 */
export const DICE_KIND_DATA = 0x0001;

/**
 * Data in code entry kind: jump table 8.
 */
export const DICE_KIND_JUMP_TABLE8 = 0x0002;

/**
 * Data in code entry kind: jump table 16.
 */
export const DICE_KIND_JUMP_TABLE16 = 0x0003;

/**
 * Data in code entry kind: jump table 32.
 */
export const DICE_KIND_JUMP_TABLE32 = 0x0004;

/**
 * Data in code entry kind: absolute jump table 32.
 */
export const DICE_KIND_ABS_JUMP_TABLE32 = 0x0005;

/**
 * Thread local variable entry, 32-bit.
 */
export class tlv_descriptor extends Struct {
	/**
	 * A pointer.
	 */
	declare public thunk: uint32_t;

	/**
	 * Unsigned long.
	 */
	declare public key: uint32_t;

	/**
	 * Unsigned long.
	 */
	declare public offset: uint32_t;

	static {
		toStringTag(this, 'tlv_descriptor');
		uint32(this, 'thunk');
		uint32(this, 'key');
		uint32(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Thread local variable entry, 64-bit.
 */
export class tlv_descriptor_64 extends Struct {
	/**
	 * A pointer.
	 */
	declare public thunk: uint64_t;

	/**
	 * Unsigned long.
	 */
	declare public key: uint64_t;

	/**
	 * Unsigned long.
	 */
	declare public offset: uint64_t;

	static {
		toStringTag(this, 'tlv_descriptor_64');
		uint64(this, 'thunk');
		uint64(this, 'key');
		uint64(this, 'offset');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Note command.
 */
export class note_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Owner name.
	 */
	declare public data_owner: Arr<char>;

	/**
	 * File offset.
	 */
	declare public offset: uint64_t;

	/**
	 * Byte length.
	 */
	declare public size: uint64_t;

	static {
		toStringTag(this, 'note_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Int8Ptr, 16), this, 'data_owner');
		uint64(this, 'offset');
		uint64(this, 'size');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Fileset entry command.
 */
export class fileset_entry_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: uint32_t;

	/**
	 * Command size.
	 */
	declare public cmdsize: uint32_t;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: uint64_t;

	/**
	 * File offset.
	 */
	declare public fileoff: uint64_t;

	/**
	 * File pathname.
	 */
	declare public entry_id: lc_str;

	/**
	 * Reserved.
	 */
	declare public reserved: uint32_t;

	static {
		toStringTag(this, 'fileset_entry_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		uint64(this, 'vmaddr');
		uint64(this, 'fileoff');
		member(lc_str, this, 'entry_id');
		uint32(this, 'reserved');
		constant(this, 'BYTE_LENGTH');
	}
}
