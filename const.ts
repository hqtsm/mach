// deno-lint-ignore-file camelcase

// Highest number value before approximation, 2^53-1.
export const INT_LIMIT = 0x1fffffffffffff;

export const UINT32_MAX = 0xffffffff;

// FAT mach magic numbers:
export const FAT_MAGIC = 0xcafebabe;
export const FAT_CIGAM = 0xbebafeca;
export const FAT_MAGIC_64 = 0xcafebabf;
export const FAT_CIGAM_64 = 0xbfbafeca;

// Mach header magic numbers:
export const MH_MAGIC = 0xfeedface;
export const MH_CIGAM = 0xcefaedfe;
export const MH_MAGIC_64 = 0xfeedfacf;
export const MH_CIGAM_64 = 0xcffaedfe;

// Mach header filetypes:
export const MH_OBJECT = 0x1;
export const MH_EXECUTE = 0x2;
export const MH_FVMLIB = 0x3;
export const MH_CORE = 0x4;
export const MH_PRELOAD = 0x5;
export const MH_DYLIB = 0x6;
export const MH_DYLINKER = 0x7;
export const MH_BUNDLE = 0x8;
export const MH_DYLIB_STUB = 0x9;
export const MH_DSYM = 0xa;
export const MH_KEXT_BUNDLE = 0xb;
export const MH_FILESET = 0xc;
export const MH_GPU_EXECUTE = 0xd;
export const MH_GPU_DYLIB = 0xe;

// Mach header flags:
export const MH_NOUNDEFS = 0x1;
export const MH_INCRLINK = 0x2;
export const MH_DYLDLINK = 0x4;
export const MH_BINDATLOAD = 0x8;
export const MH_PREBOUND = 0x10;
export const MH_SPLIT_SEGS = 0x20;
export const MH_LAZY_INIT = 0x40;
export const MH_TWOLEVEL = 0x80;
export const MH_FORCE_FLAT = 0x100;
export const MH_NOMULTIDEFS = 0x200;
export const MH_NOFIXPREBINDING = 0x400;
export const MH_PREBINDABLE = 0x800;
export const MH_ALLMODSBOUND = 0x1000;
export const MH_SUBSECTIONS_VIA_SYMBOLS = 0x2000;
export const MH_CANONICAL = 0x4000;
export const MH_WEAK_DEFINES = 0x8000;
export const MH_BINDS_TO_WEAK = 0x10000;
export const MH_ALLOW_STACK_EXECUTION = 0x20000;
export const MH_ROOT_SAFE = 0x40000;
export const MH_SETUID_SAFE = 0x80000;
export const MH_NO_REEXPORTED_DYLIBS = 0x100000;
export const MH_PIE = 0x200000;
export const MH_DEAD_STRIPPABLE_DYLIB = 0x400000;
export const MH_HAS_TLV_DESCRIPTORS = 0x800000;
export const MH_NO_HEAP_EXECUTION = 0x1000000;
export const MH_APP_EXTENSION_SAFE = 0x02000000;
export const MH_NLIST_OUTOFSYNC_WITH_DYLDINFO = 0x04000000;
export const MH_SIM_SUPPORT = 0x08000000;
export const MH_IMPLICIT_PAGEZERO = 0x10000000;
export const MH_DYLIB_IN_CACHE = 0x80000000;

// Requires dynamic linker to support it:
export const LC_REQ_DYLD = 0x80000000;

// Load command cmd types:
export const LC_SEGMENT = 0x1;
export const LC_SYMTAB = 0x2;
export const LC_SYMSEG = 0x3;
export const LC_THREAD = 0x4;
export const LC_UNIXTHREAD = 0x5;
export const LC_LOADFVMLIB = 0x6;
export const LC_IDFVMLIB = 0x7;
export const LC_IDENT = 0x8;
export const LC_FVMFILE = 0x9;
export const LC_PREPAGE = 0xa;
export const LC_DYSYMTAB = 0xb;
export const LC_LOAD_DYLIB = 0xc;
export const LC_ID_DYLIB = 0xd;
export const LC_LOAD_DYLINKER = 0xe;
export const LC_ID_DYLINKER = 0xf;
export const LC_PREBOUND_DYLIB = 0x10;
export const LC_ROUTINES = 0x11;
export const LC_SUB_FRAMEWORK = 0x12;
export const LC_SUB_UMBRELLA = 0x13;
export const LC_SUB_CLIENT = 0x14;
export const LC_SUB_LIBRARY = 0x15;
export const LC_TWOLEVEL_HINTS = 0x16;
export const LC_PREBIND_CKSUM = 0x17;
export const LC_LOAD_WEAK_DYLIB = (0x18 | LC_REQ_DYLD) >>> 0;
export const LC_SEGMENT_64 = 0x19;
export const LC_ROUTINES_64 = 0x1a;
export const LC_UUID = 0x1b;
export const LC_RPATH = (0x1c | LC_REQ_DYLD) >>> 0;
export const LC_CODE_SIGNATURE = 0x1d;
export const LC_SEGMENT_SPLIT_INFO = 0x1e;
export const LC_REEXPORT_DYLIB = (0x1f | LC_REQ_DYLD) >>> 0;
export const LC_LAZY_LOAD_DYLIB = 0x20;
export const LC_ENCRYPTION_INFO = 0x21;
export const LC_DYLD_INFO = 0x22;
export const LC_DYLD_INFO_ONLY = (0x22 | LC_REQ_DYLD) >>> 0;
export const LC_LOAD_UPWARD_DYLIB = (0x23 | LC_REQ_DYLD) >>> 0;
export const LC_VERSION_MIN_MACOSX = 0x24;
export const LC_VERSION_MIN_IPHONEOS = 0x25;
export const LC_FUNCTION_STARTS = 0x26;
export const LC_DYLD_ENVIRONMENT = 0x27;
export const LC_MAIN = (0x28 | LC_REQ_DYLD) >>> 0;
export const LC_DATA_IN_CODE = 0x29;
export const LC_SOURCE_VERSION = 0x2a;
export const LC_DYLIB_CODE_SIGN_DRS = 0x2b;
export const LC_ENCRYPTION_INFO_64 = 0x2c;
export const LC_LINKER_OPTION = 0x2d;
export const LC_LINKER_OPTIMIZATION_HINT = 0x2e;
export const LC_VERSION_MIN_TVOS = 0x2f;
export const LC_VERSION_MIN_WATCHOS = 0x30;
export const LC_NOTE = 0x31;
export const LC_BUILD_VERSION = 0x32;
export const LC_DYLD_EXPORTS_TRIE = (0x33 | LC_REQ_DYLD) >>> 0;
export const LC_DYLD_CHAINED_FIXUPS = (0x34 | LC_REQ_DYLD) >>> 0;
export const LC_FILESET_ENTRY = (0x35 | LC_REQ_DYLD) >>> 0;
export const LC_ATOM_INFO = 0x36;

// Segment flags.
export const SG_HIGHVM = 0x1;
export const SG_FVMLIB = 0x2;
export const SG_NORELOC = 0x4;
export const SG_PROTECTED_VERSION_1 = 0x8;
export const SG_READ_ONLY = 0x10;

// Section flags type and attributes mask.
export const SECTION_TYPE = 0x000000ff;
export const SECTION_ATTRIBUTES = 0xffffff00;

// Section types:
export const S_REGULAR = 0x0;
export const S_ZEROFILL = 0x1;
export const S_CSTRING_LITERALS = 0x2;
export const S_4BYTE_LITERALS = 0x3;
export const S_8BYTE_LITERALS = 0x4;
export const S_LITERAL_POINTERS = 0x5;
export const S_NON_LAZY_SYMBOL_POINTERS = 0x6;
export const S_LAZY_SYMBOL_POINTERS = 0x7;
export const S_SYMBOL_STUBS = 0x8;
export const S_MOD_INIT_FUNC_POINTERS = 0x9;
export const S_MOD_TERM_FUNC_POINTERS = 0xa;
export const S_COALESCED = 0xb;
export const S_GB_ZEROFILL = 0xc;
export const S_INTERPOSING = 0xd;
export const S_16BYTE_LITERALS = 0xe;
export const S_DTRACE_DOF = 0xf;
export const S_LAZY_DYLIB_SYMBOL_POINTERS = 0x10;
export const S_THREAD_LOCAL_REGULAR = 0x11;
export const S_THREAD_LOCAL_ZEROFILL = 0x12;
export const S_THREAD_LOCAL_VARIABLES = 0x13;
export const S_THREAD_LOCAL_VARIABLE_POINTERS = 0x14;
export const S_THREAD_LOCAL_INIT_FUNCTION_POINTERS = 0x15;
export const S_INIT_FUNC_OFFSETS = 0x16;

// Section attributes:
export const SECTION_ATTRIBUTES_USR = 0xff000000;
export const S_ATTR_PURE_INSTRUCTIONS = 0x80000000;
export const S_ATTR_NO_TOC = 0x40000000;
export const S_ATTR_STRIP_STATIC_SYMS = 0x20000000;
export const S_ATTR_NO_DEAD_STRIP = 0x10000000;
export const S_ATTR_LIVE_SUPPORT = 0x08000000;
export const S_ATTR_SELF_MODIFYING_CODE = 0x04000000;
export const S_ATTR_DEBUG = 0x02000000;
export const SECTION_ATTRIBUTES_SYS = 0x00ffff00;
export const S_ATTR_SOME_INSTRUCTIONS = 0x00000400;
export const S_ATTR_EXT_RELOC = 0x00000200;
export const S_ATTR_LOC_RELOC = 0x00000100;

// Names for known segments and sections:
export const SEG_PAGEZERO = '__PAGEZERO';
export const SEG_TEXT = '__TEXT';
export const SECT_TEXT = '__text';
export const SECT_FVMLIB_INIT0 = '__fvmlib_init0';
export const SECT_FVMLIB_INIT1 = '__fvmlib_init1';
export const SEG_DATA = '__DATA';
export const SECT_DATA = '__data';
export const SECT_BSS = '__bss';
export const SECT_COMMON = '__common';
export const SEG_OBJC = '__OBJC';
export const SECT_OBJC_SYMBOLS = '__symbol_table';
export const SECT_OBJC_MODULES = '__module_info';
export const SECT_OBJC_STRINGS = '__selector_strs';
export const SECT_OBJC_REFS = '__selector_refs';
export const SEG_ICON = '__ICON';
export const SECT_ICON_HEADER = '__header';
export const SECT_ICON_TIFF = '__tiff';
export const SEG_LINKEDIT = '__LINKEDIT';
export const SEG_UNIXSTACK = '__UNIXSTACK';
export const SEG_IMPORT = '__IMPORT';

// Dylib flags:
export const DYLIB_USE_WEAK_LINK = 0x01;
export const DYLIB_USE_REEXPORT = 0x02;
export const DYLIB_USE_UPWARD = 0x04;
export const DYLIB_USE_DELAYED_INIT = 0x08;
export const DYLIB_USE_MARKER = 0x1a741800;

// Indirect symbol table constants:
export const INDIRECT_SYMBOL_LOCAL = 0x80000000;
export const INDIRECT_SYMBOL_ABS = 0x40000000;

// Platform types:
export const PLATFORM_UNKNOWN = 0;
export const PLATFORM_ANY = 0xffffffff;
export const PLATFORM_MACOS = 1;
export const PLATFORM_IOS = 2;
export const PLATFORM_TVOS = 3;
export const PLATFORM_WATCHOS = 4;
export const PLATFORM_BRIDGEOS = 5;
export const PLATFORM_MACCATALYST = 6;
export const PLATFORM_IOSSIMULATOR = 7;
export const PLATFORM_TVOSSIMULATOR = 8;
export const PLATFORM_WATCHOSSIMULATOR = 9;
export const PLATFORM_DRIVERKIT = 10;
export const PLATFORM_VISIONOS = 11;
export const PLATFORM_VISIONOSSIMULATOR = 12;
export const PLATFORM_FIRMWARE = 13;
export const PLATFORM_SEPOS = 14;

// Known tools:
export const TOOL_CLANG = 1;
export const TOOL_SWIFT = 2;
export const TOOL_LD = 3;
export const TOOL_LLD = 4;

// Known GPU tools:
export const TOOL_METAL = 1024;
export const TOOL_AIRLLD = 1025;
export const TOOL_AIRNT = 1026;
export const TOOL_AIRNT_PLUGIN = 1027;
export const TOOL_AIRPACK = 1028;
export const TOOL_GPUARCHIVER = 1031;
export const TOOL_METAL_FRAMEWORK = 1032;

// Rebase info:
export const REBASE_TYPE_POINTER = 1;
export const REBASE_TYPE_TEXT_ABSOLUTE32 = 2;
export const REBASE_TYPE_TEXT_PCREL32 = 3;
export const REBASE_OPCODE_MASK = 0xf0;
export const REBASE_IMMEDIATE_MASK = 0x0f;
export const REBASE_OPCODE_DONE = 0x00;
export const REBASE_OPCODE_SET_TYPE_IMM = 0x10;
export const REBASE_OPCODE_SET_SEGMENT_AND_OFFSET_ULEB = 0x20;
export const REBASE_OPCODE_ADD_ADDR_ULEB = 0x30;
export const REBASE_OPCODE_ADD_ADDR_IMM_SCALED = 0x40;
export const REBASE_OPCODE_DO_REBASE_IMM_TIMES = 0x50;
export const REBASE_OPCODE_DO_REBASE_ULEB_TIMES = 0x60;
export const REBASE_OPCODE_DO_REBASE_ADD_ADDR_ULEB = 0x70;
export const REBASE_OPCODE_DO_REBASE_ULEB_TIMES_SKIPPING_ULEB = 0x80;

// Binding info:
export const BIND_TYPE_POINTER = 1;
export const BIND_TYPE_TEXT_ABSOLUTE32 = 2;
export const BIND_TYPE_TEXT_PCREL32 = 3;
export const BIND_SPECIAL_DYLIB_SELF = 0;
export const BIND_SPECIAL_DYLIB_MAIN_EXECUTABLE = -1;
export const BIND_SPECIAL_DYLIB_FLAT_LOOKUP = -2;
export const BIND_SPECIAL_DYLIB_WEAK_LOOKUP = -3;
export const BIND_SYMBOL_FLAGS_WEAK_IMPORT = 0x1;
export const BIND_SYMBOL_FLAGS_NON_WEAK_DEFINITION = 0x8;
export const BIND_OPCODE_MASK = 0xf0;
export const BIND_IMMEDIATE_MASK = 0x0f;
export const BIND_OPCODE_DONE = 0x00;
export const BIND_OPCODE_SET_DYLIB_ORDINAL_IMM = 0x10;
export const BIND_OPCODE_SET_DYLIB_ORDINAL_ULEB = 0x20;
export const BIND_OPCODE_SET_DYLIB_SPECIAL_IMM = 0x30;
export const BIND_OPCODE_SET_SYMBOL_TRAILING_FLAGS_IMM = 0x40;
export const BIND_OPCODE_SET_TYPE_IMM = 0x50;
export const BIND_OPCODE_SET_ADDEND_SLEB = 0x60;
export const BIND_OPCODE_SET_SEGMENT_AND_OFFSET_ULEB = 0x70;
export const BIND_OPCODE_ADD_ADDR_ULEB = 0x80;
export const BIND_OPCODE_DO_BIND = 0x90;
export const BIND_OPCODE_DO_BIND_ADD_ADDR_ULEB = 0xa0;
export const BIND_OPCODE_DO_BIND_ADD_ADDR_IMM_SCALED = 0xb0;
export const BIND_OPCODE_DO_BIND_ULEB_TIMES_SKIPPING_ULEB = 0xc0;
export const BIND_OPCODE_THREADED = 0xd0;
export const BIND_SUBOPCODE_THREADED_SET_BIND_ORDINAL_TABLE_SIZE_ULEB = 0x00;
export const BIND_SUBOPCODE_THREADED_APPLY = 0x01;

// Export info:
export const EXPORT_SYMBOL_FLAGS_KIND_MASK = 0x03;
export const EXPORT_SYMBOL_FLAGS_KIND_REGULAR = 0x00;
export const EXPORT_SYMBOL_FLAGS_KIND_THREAD_LOCAL = 0x01;
export const EXPORT_SYMBOL_FLAGS_KIND_ABSOLUTE = 0x02;
export const EXPORT_SYMBOL_FLAGS_WEAK_DEFINITION = 0x04;
export const EXPORT_SYMBOL_FLAGS_REEXPORT = 0x08;
export const EXPORT_SYMBOL_FLAGS_STUB_AND_RESOLVER = 0x10;
export const EXPORT_SYMBOL_FLAGS_STATIC_RESOLVER = 0x20;

// Data in code entries:
export const DICE_KIND_DATA = 0x0001;
export const DICE_KIND_JUMP_TABLE8 = 0x0002;
export const DICE_KIND_JUMP_TABLE16 = 0x0003;
export const DICE_KIND_JUMP_TABLE32 = 0x0004;
export const DICE_KIND_ABS_JUMP_TABLE32 = 0x0005;

// CPU types:
export const CPU_ARCH_MASK = 0xff000000;
export const CPU_ARCH_ABI64 = 0x01000000;
export const CPU_ARCH_ABI64_32 = 0x02000000;

export const CPU_TYPE_ANY = -1;
export const CPU_TYPE_VAX = 1;
export const CPU_TYPE_MC680x0 = 6;
export const CPU_TYPE_X86 = 7;
export const CPU_TYPE_I386 = CPU_TYPE_X86;
export const CPU_TYPE_X86_64 = CPU_TYPE_X86 | CPU_ARCH_ABI64;
export const CPU_TYPE_MC98000 = 10;
export const CPU_TYPE_HPPA = 11;
export const CPU_TYPE_ARM = 12;
export const CPU_TYPE_ARM64 = CPU_TYPE_ARM | CPU_ARCH_ABI64;
export const CPU_TYPE_ARM64_32 = CPU_TYPE_ARM | CPU_ARCH_ABI64_32;
export const CPU_TYPE_MC88000 = 13;
export const CPU_TYPE_SPARC = 14;
export const CPU_TYPE_I860 = 15;
export const CPU_TYPE_POWERPC = 18;
export const CPU_TYPE_POWERPC64 = CPU_TYPE_POWERPC | CPU_ARCH_ABI64;

// CPU subtypes:
export const CPU_SUBTYPE_MASK = 0xff000000;
export const CPU_SUBTYPE_LIB64 = 0x80000000;
export const CPU_SUBTYPE_PTRAUTH_ABI = 0x80000000;

export const CPU_SUBTYPE_ANY = -1;
export const CPU_SUBTYPE_MULTIPLE = -1;
export const CPU_SUBTYPE_LITTLE_ENDIAN = 0;
export const CPU_SUBTYPE_BIG_ENDIAN = 1;

export const CPU_SUBTYPE_VAX_ALL = 0;
export const CPU_SUBTYPE_VAX780 = 1;
export const CPU_SUBTYPE_VAX785 = 2;
export const CPU_SUBTYPE_VAX750 = 3;
export const CPU_SUBTYPE_VAX730 = 4;
export const CPU_SUBTYPE_UVAXI = 5;
export const CPU_SUBTYPE_UVAXII = 6;
export const CPU_SUBTYPE_VAX8200 = 7;
export const CPU_SUBTYPE_VAX8500 = 8;
export const CPU_SUBTYPE_VAX8600 = 9;
export const CPU_SUBTYPE_VAX8650 = 10;
export const CPU_SUBTYPE_VAX8800 = 11;
export const CPU_SUBTYPE_UVAXIII = 12;

export const CPU_SUBTYPE_MC680x0_ALL = 1;
export const CPU_SUBTYPE_MC68030 = 1;
export const CPU_SUBTYPE_MC68040 = 2;
export const CPU_SUBTYPE_MC68030_ONLY = 3;

// const CPU_SUBTYPE_INTEL = (f: number, m: number) => f + (m << 4);
export const CPU_SUBTYPE_I386_ALL = 3; // CPU_SUBTYPE_INTEL(3, 0);
export const CPU_SUBTYPE_386 = 3; // CPU_SUBTYPE_INTEL(3, 0);
export const CPU_SUBTYPE_486 = 4; // CPU_SUBTYPE_INTEL(4, 0);
export const CPU_SUBTYPE_486SX = 132; // CPU_SUBTYPE_INTEL(4, 8);
export const CPU_SUBTYPE_586 = 5; // CPU_SUBTYPE_INTEL(5, 0);
export const CPU_SUBTYPE_PENT = 5; // CPU_SUBTYPE_INTEL(5, 0);
export const CPU_SUBTYPE_PENTPRO = 22; // CPU_SUBTYPE_INTEL(6, 1);
export const CPU_SUBTYPE_PENTII_M3 = 54; // CPU_SUBTYPE_INTEL(6, 3);
export const CPU_SUBTYPE_PENTII_M5 = 86; // CPU_SUBTYPE_INTEL(6, 5);
export const CPU_SUBTYPE_CELERON = 103; // CPU_SUBTYPE_INTEL(7, 6);
export const CPU_SUBTYPE_CELERON_MOBILE = 119; // CPU_SUBTYPE_INTEL(7, 7);
export const CPU_SUBTYPE_PENTIUM_3 = 8; // CPU_SUBTYPE_INTEL(8, 0);
export const CPU_SUBTYPE_PENTIUM_3_M = 24; // CPU_SUBTYPE_INTEL(8, 1);
export const CPU_SUBTYPE_PENTIUM_3_XEON = 40; // CPU_SUBTYPE_INTEL(8, 2);
export const CPU_SUBTYPE_PENTIUM_M = 9; // CPU_SUBTYPE_INTEL(9, 0);
export const CPU_SUBTYPE_PENTIUM_4 = 10; // CPU_SUBTYPE_INTEL(10, 0);
export const CPU_SUBTYPE_PENTIUM_4_M = 26; // CPU_SUBTYPE_INTEL(10, 1);
export const CPU_SUBTYPE_ITANIUM = 11; // CPU_SUBTYPE_INTEL(11, 0);
export const CPU_SUBTYPE_ITANIUM_2 = 27; // CPU_SUBTYPE_INTEL(11, 1);
export const CPU_SUBTYPE_XEON = 12; // CPU_SUBTYPE_INTEL(12, 0);
export const CPU_SUBTYPE_XEON_MP = 28; // CPU_SUBTYPE_INTEL(12, 1);

export const CPU_SUBTYPE_X86_ALL = 3;
export const CPU_SUBTYPE_X86_64_ALL = 3;
export const CPU_SUBTYPE_X86_ARCH1 = 4;
export const CPU_SUBTYPE_X86_64_H = 8;

export const CPU_SUBTYPE_MIPS_ALL = 0;
export const CPU_SUBTYPE_MIPS_R2300 = 1;
export const CPU_SUBTYPE_MIPS_R2600 = 2;
export const CPU_SUBTYPE_MIPS_R2800 = 3;
export const CPU_SUBTYPE_MIPS_R2000a = 4;
export const CPU_SUBTYPE_MIPS_R2000 = 5;
export const CPU_SUBTYPE_MIPS_R3000a = 6;
export const CPU_SUBTYPE_MIPS_R3000 = 7;

export const CPU_SUBTYPE_MC98000_ALL = 0;
export const CPU_SUBTYPE_MC98601 = 1;

export const CPU_SUBTYPE_HPPA_ALL = 0;
export const CPU_SUBTYPE_HPPA_7100 = 0;
export const CPU_SUBTYPE_HPPA_7100LC = 1;

export const CPU_SUBTYPE_MC88000_ALL = 0;
export const CPU_SUBTYPE_MC88100 = 1;
export const CPU_SUBTYPE_MC88110 = 2;

export const CPU_SUBTYPE_SPARC_ALL = 0;

export const CPU_SUBTYPE_I860_ALL = 0;
export const CPU_SUBTYPE_I860_860 = 1;

export const CPU_SUBTYPE_POWERPC_ALL = 0;
export const CPU_SUBTYPE_POWERPC_601 = 1;
export const CPU_SUBTYPE_POWERPC_602 = 2;
export const CPU_SUBTYPE_POWERPC_603 = 3;
export const CPU_SUBTYPE_POWERPC_603e = 4;
export const CPU_SUBTYPE_POWERPC_603ev = 5;
export const CPU_SUBTYPE_POWERPC_604 = 6;
export const CPU_SUBTYPE_POWERPC_604e = 7;
export const CPU_SUBTYPE_POWERPC_620 = 8;
export const CPU_SUBTYPE_POWERPC_750 = 9;
export const CPU_SUBTYPE_POWERPC_7400 = 10;
export const CPU_SUBTYPE_POWERPC_7450 = 11;
export const CPU_SUBTYPE_POWERPC_970 = 100;

export const CPU_SUBTYPE_ARM_ALL = 0;
export const CPU_SUBTYPE_ARM_V4T = 5;
export const CPU_SUBTYPE_ARM_V6 = 6;
export const CPU_SUBTYPE_ARM_V5TEJ = 7;
export const CPU_SUBTYPE_ARM_XSCALE = 8;
export const CPU_SUBTYPE_ARM_V7 = 9;
export const CPU_SUBTYPE_ARM_V7F = 10;
export const CPU_SUBTYPE_ARM_V7S = 11;
export const CPU_SUBTYPE_ARM_V7K = 12;
export const CPU_SUBTYPE_ARM_V8 = 13;
export const CPU_SUBTYPE_ARM_V6M = 14;
export const CPU_SUBTYPE_ARM_V7M = 15;
export const CPU_SUBTYPE_ARM_V7EM = 16;
export const CPU_SUBTYPE_ARM_V8M = 17;

export const CPU_SUBTYPE_ARM64_ALL = 0;
export const CPU_SUBTYPE_ARM64_V8 = 1;
export const CPU_SUBTYPE_ARM64E = 2;

export const CPU_SUBTYPE_ARM64_32_ALL = 0;
export const CPU_SUBTYPE_ARM64_32_V8 = 1;

// Executable segment flags:
export const CS_EXECSEG_MAIN_BINARY = 0x1;
export const CS_EXECSEG_ALLOW_UNSIGNED = 0x10;
export const CS_EXECSEG_DEBUGGER = 0x20;
export const CS_EXECSEG_JIT = 0x40;
export const CS_EXECSEG_SKIP_LV = 0x80;
export const CS_EXECSEG_CAN_LOAD_CDHASH = 0x100;
export const CS_EXECSEG_CAN_EXEC_CDHASH = 0x200;

// Magic numbers used by code signing:
export const CSMAGIC_REQUIREMENT = 0xfade0c00;
export const CSMAGIC_REQUIREMENTS = 0xfade0c01;
export const CSMAGIC_CODEDIRECTORY = 0xfade0c02;
export const CSMAGIC_EMBEDDED_SIGNATURE = 0xfade0cc0;
export const CSMAGIC_EMBEDDED_SIGNATURE_OLD = 0xfade0b02;
export const CSMAGIC_EMBEDDED_ENTITLEMENTS = 0xfade7171;
export const CSMAGIC_EMBEDDED_DER_ENTITLEMENTS = 0xfade7172;
export const CSMAGIC_DETACHED_SIGNATURE = 0xfade0cc1;
export const CSMAGIC_BLOBWRAPPER = 0xfade0b01;
export const CSMAGIC_EMBEDDED_LAUNCH_CONSTRAINT = 0xfade8181;

export const CS_SUPPORTSSCATTER = 0x20100;
export const CS_SUPPORTSTEAMID = 0x20200;
export const CS_SUPPORTSCODELIMIT64 = 0x20300;
export const CS_SUPPORTSEXECSEG = 0x20400;
export const CS_SUPPORTSRUNTIME = 0x20500;
export const CS_SUPPORTSLINKAGE = 0x20600;

export const CSSLOT_CODEDIRECTORY = 0;
export const CSSLOT_INFOSLOT = 1;
export const CSSLOT_REQUIREMENTS = 2;
export const CSSLOT_RESOURCEDIR = 3;
export const CSSLOT_APPLICATION = 4;
export const CSSLOT_ENTITLEMENTS = 5;
export const CSSLOT_DER_ENTITLEMENTS = 7;
export const CSSLOT_LAUNCH_CONSTRAINT_SELF = 8;
export const CSSLOT_LAUNCH_CONSTRAINT_PARENT = 9;
export const CSSLOT_LAUNCH_CONSTRAINT_RESPONSIBLE = 10;
export const CSSLOT_LIBRARY_CONSTRAINT = 11;

export const CSSLOT_ALTERNATE_CODEDIRECTORIES = 0x1000;
export const CSSLOT_ALTERNATE_CODEDIRECTORY_MAX = 5;
export const CSSLOT_ALTERNATE_CODEDIRECTORY_LIMIT =
	CSSLOT_ALTERNATE_CODEDIRECTORIES + CSSLOT_ALTERNATE_CODEDIRECTORY_MAX;

export const CSSLOT_SIGNATURESLOT = 0x10000;
export const CSSLOT_IDENTIFICATIONSLOT = 0x10001;
export const CSSLOT_TICKETSLOT = 0x10002;

export const CSTYPE_INDEX_REQUIREMENTS = 0x00000002;
export const CSTYPE_INDEX_ENTITLEMENTS = 0x00000005;

export const CS_HASHTYPE_SHA1 = 1;
export const CS_HASHTYPE_SHA256 = 2;
export const CS_HASHTYPE_SHA256_TRUNCATED = 3;
export const CS_HASHTYPE_SHA384 = 4;

export const CS_SHA1_LEN = 20;
export const CS_SHA256_LEN = 32;
export const CS_SHA256_TRUNCATED_LEN = 20;

export const CS_CDHASH_LEN = 20;
export const CS_HASH_MAX_SIZE = 48;

export const CS_SIGNER_TYPE_UNKNOWN = 0;
export const CS_SIGNER_TYPE_LEGACYVPN = 5;
export const CS_SIGNER_TYPE_MAC_APP_STORE = 6;

export const CS_SUPPL_SIGNER_TYPE_UNKNOWN = 0;
export const CS_SUPPL_SIGNER_TYPE_TRUSTCACHE = 7;
export const CS_SUPPL_SIGNER_TYPE_LOCAL = 8;

export const CS_SIGNER_TYPE_OOPJIT = 9;

export const CS_VALIDATION_CATEGORY_INVALID = 0;
export const CS_VALIDATION_CATEGORY_PLATFORM = 1;
export const CS_VALIDATION_CATEGORY_TESTFLIGHT = 2;
export const CS_VALIDATION_CATEGORY_DEVELOPMENT = 3;
export const CS_VALIDATION_CATEGORY_APP_STORE = 4;
export const CS_VALIDATION_CATEGORY_ENTERPRISE = 5;
export const CS_VALIDATION_CATEGORY_DEVELOPER_ID = 6;
export const CS_VALIDATION_CATEGORY_LOCAL_SIGNING = 7;
export const CS_VALIDATION_CATEGORY_ROSETTA = 8;
export const CS_VALIDATION_CATEGORY_OOPJIT = 9;
export const CS_VALIDATION_CATEGORY_NONE = 10;

// Set of application types to support linkage signatures:
export const CS_LINKAGE_APPLICATION_INVALID = 0;
export const CS_LINKAGE_APPLICATION_ROSETTA = 1;
export const CS_LINKAGE_APPLICATION_XOJIT = 2;
export const CS_LINKAGE_APPLICATION_OOPJIT = 2;

// Set of application subtypes to support linkage signatures:
export const CS_LINKAGE_APPLICATION_ROSETTA_AOT = 0;
export const CS_LINKAGE_APPLICATION_XOJIT_PREVIEWS = 1;
export const CS_LINKAGE_APPLICATION_OOPJIT_INVALID = 0;
export const CS_LINKAGE_APPLICATION_OOPJIT_PREVIEWS = 1;
export const CS_LINKAGE_APPLICATION_OOPJIT_MLCOMPILER = 2;
export const CS_LINKAGE_APPLICATION_OOPJIT_TOTAL = 3;

// Blob types used for code signing:
export const kSecCodeMagicRequirement = 0xfade0c00;
export const kSecCodeMagicRequirementSet = 0xfade0c01;
export const kSecCodeMagicCodeDirectory = 0xfade0c02;
export const kSecCodeMagicEmbeddedSignature = 0xfade0cc0;
export const kSecCodeMagicDetachedSignature = 0xfade0cc1;
export const kSecCodeMagicEntitlement = 0xfade7171;
export const kSecCodeMagicEntitlementDER = 0xfade7172;
export const kSecCodeMagicLaunchConstraint = 0xfade8181;
export const kSecCodeMagicDRList = 0xfade0c05;
export const kSecCodeMagicByte = 0xfa;

// SecCodeExecSegFlags:
export const kSecCodeExecSegMainBinary = 0x0001;
export const kSecCodeExecSegAllowUnsigned = 0x0010;
export const kSecCodeExecSegDebugger = 0x0020;
export const kSecCodeExecSegJit = 0x0040;
export const kSecCodeExecSegSkipLibraryVal = 0x0080;
export const kSecCodeExecSegCanLoadCdHash = 0x0100;
export const kSecCodeExecSegCanExecCdHash = 0x0200;

// Current (fixed) cdhash size:
export const kSecCodeCDHashLength = 20;

// SecCSDigestAlgorithm:
export const kSecCodeSignatureNoHash = 0;
export const kSecCodeSignatureHashSHA1 = 1;
export const kSecCodeSignatureHashSHA256 = 2;
export const kSecCodeSignatureHashSHA256Truncated = 3;
export const kSecCodeSignatureHashSHA384 = 4;
export const kSecCodeSignatureHashSHA512 = 5;

// SecCodeSignatureFlags:
export const kSecCodeSignatureHost = 0x0001;
export const kSecCodeSignatureAdhoc = 0x0002;
export const kSecCodeSignatureForceHard = 0x0100;
export const kSecCodeSignatureForceKill = 0x0200;
export const kSecCodeSignatureForceExpiration = 0x0400;
export const kSecCodeSignatureRestrict = 0x0800;
export const kSecCodeSignatureEnforcement = 0x1000;
export const kSecCodeSignatureLibraryValidation = 0x2000;
export const kSecCodeSignatureRuntime = 0x10000;
export const kSecCodeSignatureLinkerSigned = 0x20000;

// SecRequirementType:
export const kSecHostRequirementType = 1;
export const kSecGuestRequirementType = 2;
export const kSecDesignatedRequirementType = 3;
export const kSecLibraryRequirementType = 4;
export const kSecPluginRequirementType = 5;

// Special hash slot values:
export const cdInfoSlot = 1;
export const cdRequirementsSlot = 2;
export const cdResourceDirSlot = 3;
export const cdTopDirectorySlot = 4;
export const cdEntitlementSlot = 5;
export const cdRepSpecificSlot = 6;
export const cdEntitlementDERSlot = 7;
export const cdLaunchConstraintSelf = 8;
export const cdLaunchConstraintParent = 9;
export const cdLaunchConstraintResponsible = 10;
export const cdLibraryConstraint = 11;

export const cdCodeDirectorySlot = 0;
export const cdAlternateCodeDirectorySlots = 0x1000;
export const cdAlternateCodeDirectoryLimit = 0x1005;
export const cdSignatureSlot = 0x10000;
export const cdIdentificationSlot = 0x10001;
export const cdTicketSlot = 0x10002;

// Opcodes exprForm:
export const opFlagMask = 0xff000000;
export const opGenericFalse = 0x80000000;
export const opGenericSkip = 0x40000000;

// ExprOp:
export const opFalse = 0;
export const opTrue = 1;
export const opIdent = 2;
export const opAppleAnchor = 3;
export const opAnchorHash = 4;
export const opInfoKeyValue = 5;
export const opAnd = 6;
export const opOr = 7;
export const opCDHash = 8;
export const opNot = 9;
export const opInfoKeyField = 10;
export const opCertField = 11;
export const opTrustedCert = 12;
export const opTrustedCerts = 13;
export const opCertGeneric = 14;
export const opAppleGenericAnchor = 15;
export const opEntitlementField = 16;
export const opCertPolicy = 17;
export const opNamedAnchor = 18;
export const opNamedCode = 19;
export const opPlatform = 20;
export const opNotarized = 21;
export const opCertFieldDate = 22;
export const opLegacyDevID = 23;
export const exprOpCount = 24;

// MatchOperation:
export const matchExists = 0;
export const matchEqual = 1;
export const matchContains = 2;
export const matchBeginsWith = 3;
export const matchEndsWith = 4;
export const matchLessThan = 5;
export const matchGreaterThan = 6;
export const matchLessEqual = 7;
export const matchGreaterEqual = 8;
export const matchOn = 9;
export const matchBefore = 10;
export const matchAfter = 11;
export const matchOnOrBefore = 12;
export const matchOnOrAfter = 13;
export const matchAbsent = 14;
