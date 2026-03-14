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

/**
 * Mach-O header, 32-bit.
 */
export class mach_header extends Struct {
	/**
	 * Mach magic.
	 */
	declare public magic: number;

	/**
	 * CPU type.
	 */
	declare public cputype: number;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: number;

	/**
	 * File type.
	 */
	declare public filetype: number;

	/**
	 * Number of load commands.
	 */
	declare public ncmds: number;

	/**
	 * Size of load commands.
	 */
	declare public sizeofcmds: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

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

/**
 * Mach-O header, 64-bit.
 */
export class mach_header_64 extends Struct {
	/**
	 * Mach magic.
	 */
	declare public magic: number;

	/**
	 * CPU type.
	 */
	declare public cputype: number;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: number;

	/**
	 * File type.
	 */
	declare public filetype: number;

	/**
	 * Number of load commands.
	 */
	declare public ncmds: number;

	/**
	 * Size of load commands.
	 */
	declare public sizeofcmds: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

	/**
	 * Reserved.
	 */
	declare public reserved: number;

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

/**
 * Load command.
 */
export class load_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	static {
		toStringTag(this, 'load_command');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Load command string union.
 */
export class lc_str extends Union {
	/**
	 * String offset.
	 */
	declare public offset: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<number>;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: number;

	/**
	 * Virtual memory size.
	 */
	declare public vmsize: number;

	/**
	 * File offset.
	 */
	declare public fileoff: number;

	/**
	 * File size.
	 */
	declare public filesize: number;

	/**
	 * Maximum virtual memory protection.
	 */
	declare public maxprot: number;

	/**
	 * Initial virtual memory protection.
	 */
	declare public initprot: number;

	/**
	 * Number of sections.
	 */
	declare public nsects: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<number>;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: bigint;

	/**
	 * Virtual memory size.
	 */
	declare public vmsize: bigint;

	/**
	 * File offset.
	 */
	declare public fileoff: bigint;

	/**
	 * File size.
	 */
	declare public filesize: bigint;

	/**
	 * Maximum virtual memory protection.
	 */
	declare public maxprot: number;

	/**
	 * Initial virtual memory protection.
	 */
	declare public initprot: number;

	/**
	 * Number of sections.
	 */
	declare public nsects: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

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

/**
 * Section, 32-bit.
 */
export class section extends Struct {
	/**
	 * Section name.
	 */
	declare public sectname: Arr<number>;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<number>;

	/**
	 * Memory address.
	 */
	declare public addr: number;

	/**
	 * Size in bytes.
	 */
	declare public size: number;

	/**
	 * File offset.
	 */
	declare public offset: number;

	/**
	 * Alignment (power of 2).
	 */
	declare public align: number;

	/**
	 * File offset of relocations.
	 */
	declare public reloff: number;

	/**
	 * Number of relocations.
	 */
	declare public nreloc: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

	/**
	 * Reserved.
	 */
	declare public reserved1: number;

	/**
	 * Reserved.
	 */
	declare public reserved2: number;

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
	declare public sectname: Arr<number>;

	/**
	 * Segment name.
	 */
	declare public segname: Arr<number>;

	/**
	 * Memory address.
	 */
	declare public addr: bigint;

	/**
	 * Size in bytes.
	 */
	declare public size: bigint;

	/**
	 * File offset.
	 */
	declare public offset: number;

	/**
	 * Alignment (power of 2).
	 */
	declare public align: number;

	/**
	 * File offset of relocations.
	 */
	declare public reloff: number;

	/**
	 * Number of relocations.
	 */
	declare public nreloc: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

	/**
	 * Reserved.
	 */
	declare public reserved1: number;

	/**
	 * Reserved.
	 */
	declare public reserved2: number;

	/**
	 * Reserved.
	 */
	declare public reserved3: number;

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
	declare public minor_version: number;

	/**
	 * Header address.
	 */
	declare public header_addr: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public timestamp: number;

	/**
	 * Current version.
	 */
	declare public current_version: number;

	/**
	 * Compatibility version.
	 */
	declare public compatibility_version: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path offset.
	 */
	declare public nameoff: number;

	/**
	 * Use marker.
	 */
	declare public marker: number;

	/**
	 * Current version.
	 */
	declare public current_version: number;

	/**
	 * Compatibility version.
	 */
	declare public compat_version: number;

	/**
	 * Flags.
	 */
	declare public flags: number;

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

/**
 * Sub framework command.
 */
export class sub_framework_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Path of library.
	 */
	declare public name: lc_str;

	/**
	 * Number of modules in library.
	 */
	declare public nmodules: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Address of initialization routine.
	 */
	declare public init_address: number;

	/**
	 * Index of initialization routine in module table.
	 */
	declare public init_module: number;

	/**
	 * Reserved.
	 */
	declare public reserved1: number;

	/**
	 * Reserved.
	 */
	declare public reserved2: number;

	/**
	 * Reserved.
	 */
	declare public reserved3: number;

	/**
	 * Reserved.
	 */
	declare public reserved4: number;

	/**
	 * Reserved.
	 */
	declare public reserved5: number;

	/**
	 * Reserved.
	 */
	declare public reserved6: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Address of initialization routine.
	 */
	declare public init_address: bigint;

	/**
	 * Index of initialization routine in module table.
	 */
	declare public init_module: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved1: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved2: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved3: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved4: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved5: bigint;

	/**
	 * Reserved.
	 */
	declare public reserved6: bigint;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Symbol table offset.
	 */
	declare public symoff: number;

	/**
	 * Symbol table entries.
	 */
	declare public nsyms: number;

	/**
	 * String table offset.
	 */
	declare public stroff: number;

	/**
	 * String table byte length.
	 */
	declare public strsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Index of local symbols.
	 */
	declare public ilocalsym: number;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: number;

	/**
	 * Index of externally defined symbols.
	 */
	declare public iextdefsym: number;

	/**
	 * Number of externally defined symbols.
	 */
	declare public nextdefsym: number;

	/**
	 * Index of undefined symbols.
	 */
	declare public iundefsym: number;

	/**
	 * Number of undefined symbols.
	 */
	declare public nundefsym: number;

	/**
	 * Table of contents file offset.
	 */
	declare public tocoff: number;

	/**
	 * Number of table of contents entries.
	 */
	declare public ntoc: number;

	/**
	 * Module table file offset.
	 */
	declare public modtaboff: number;

	/**
	 * Number of module table entries.
	 */
	declare public nmodtab: number;

	/**
	 * Offset of referenced symbol table.
	 */
	declare public extrefsymoff: number;

	/**
	 * Number of referenced symbol table entries.
	 */
	declare public nextrefsyms: number;

	/**
	 * Indirect symbol table file offset.
	 */
	declare public indirectsymoff: number;

	/**
	 * Number of indirect symbol table entries.
	 */
	declare public nindirectsyms: number;

	/**
	 * Offset of external relocation entries.
	 */
	declare public extreloff: number;

	/**
	 * Number of external relocation entries.
	 */
	declare public nextrel: number;

	/**
	 * Offset of local relocation entries.
	 */
	declare public locreloff: number;

	/**
	 * Number of local relocation entries.
	 */
	declare public nlocrel: number;

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

/**
 * Dylib table of contents entry.
 */
export class dylib_table_of_contents extends Struct {
	/**
	 * External symbol index in symbol table.
	 */
	declare public symbol_index: number;

	/**
	 * Index in module table.
	 */
	declare public module_index: number;

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
	declare public module_name: number;

	/**
	 * Index in external symbols.
	 */
	declare public iextdefsym: number;

	/**
	 * Number of external symbols.
	 */
	declare public nextdefsym: number;

	/**
	 * Index in reference symbol table.
	 */
	declare public irefsym: number;

	/**
	 * Number of reference symbol table.
	 */
	declare public nrefsym: number;

	/**
	 * Index in local symbols.
	 */
	declare public ilocalsym: number;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: number;

	/**
	 * Index in external relocations.
	 */
	declare public iextrel: number;

	/**
	 * Number of external relocations.
	 */
	declare public nextrel: number;

	/**
	 * Low 16 bits index of init section.
	 * High 16 bits index of term section.
	 */
	declare public iinit_iterm: number;

	/**
	 * Low 16 bits number of init section.
	 * High 16 bits number of term section.
	 */
	declare public ninit_nterm: number;

	/**
	 * Address of start of module info section.
	 */
	declare public objc_module_info_addr: number;

	/**
	 * Size of module info section.
	 */
	declare public objc_module_info_size: number;

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
	declare public module_name: number;

	/**
	 * Index in external symbols.
	 */
	declare public iextdefsym: number;

	/**
	 * Number of external symbols.
	 */
	declare public nextdefsym: number;

	/**
	 * Index in reference symbol table.
	 */
	declare public irefsym: number;

	/**
	 * Number of reference symbol table.
	 */
	declare public nrefsym: number;

	/**
	 * Index in local symbols.
	 */
	declare public ilocalsym: number;

	/**
	 * Number of local symbols.
	 */
	declare public nlocalsym: number;

	/**
	 * Index in external relocations.
	 */
	declare public iextrel: number;

	/**
	 * Number of external relocations.
	 */
	declare public nextrel: number;

	/**
	 * Low 16 bits index of init section.
	 * High 16 bits index of term section.
	 */
	declare public iinit_iterm: number;

	/**
	 * Low 16 bits number of init section.
	 * High 16 bits number of term section.
	 */
	declare public ninit_nterm: number;

	/**
	 * Size of module info section.
	 */
	declare public objc_module_info_size: number;

	/**
	 * Address of start of module info section.
	 */
	declare public objc_module_info_addr: bigint;

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
	declare public isym: number;

	/**
	 * Flags for reference type.
	 */
	declare public flags: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Hints table offset.
	 */
	declare public offset: number;

	/**
	 * Number of hints in table.
	 */
	declare public nhints: number;

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
	declare public isub_image: number;

	/**
	 * Flags for reference type.
	 */
	declare public itoc: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Checksum or zero.
	 */
	declare public cksum: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * 128-bit UUID.
	 */
	declare public uuid: Arr<number>;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of data in __LINKEDIT segment.
	 */
	declare public dataoff: number;

	/**
	 * File size of data in __LINKEDIT segment.
	 */
	declare public datasize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of encrypted range.
	 */
	declare public cryptoff: number;

	/**
	 * File size of encrypted range.
	 */
	declare public cryptsize: number;

	/**
	 * Encryption system ID, 0 for not encrypted yet.
	 */
	declare public cryptid: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of encrypted range.
	 */
	declare public cryptoff: number;

	/**
	 * File size of encrypted range.
	 */
	declare public cryptsize: number;

	/**
	 * Encryption system ID, 0 for not encrypted yet.
	 */
	declare public cryptid: number;

	/**
	 * Padding to align to 8 bytes.
	 */
	declare public pad: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public version: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public sdk: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Platform.
	 */
	declare public platform: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public minos: number;

	/**
	 * X.Y.Z in nibbles xxxx.yy.zz.
	 */
	declare public sdk: number;

	/**
	 * Number of tool entries that follow.
	 */
	declare public ntools: number;

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
	declare public tool: number;

	/**
	 * Version number.
	 */
	declare public version: number;

	static {
		toStringTag(this, 'build_tool_version');
		uint32(this, 'tool');
		uint32(this, 'version');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Dyld info command.
 */
export class dyld_info_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File offset of rebase info.
	 */
	declare public rebase_off: number;

	/**
	 * Size of rebase info.
	 */
	declare public rebase_size: number;

	/**
	 * File offset of binding info.
	 */
	declare public bind_off: number;

	/**
	 * Size of binding info.
	 */
	declare public bind_size: number;

	/**
	 * File offset of weak binding info.
	 */
	declare public weak_bind_off: number;

	/**
	 * Size of weak binding info.
	 */
	declare public weak_bind_size: number;

	/**
	 * File offset of lazy binding info.
	 */
	declare public lazy_bind_off: number;

	/**
	 * Size of lazy binding info.
	 */
	declare public lazy_bind_size: number;

	/**
	 * File offset of export info.
	 */
	declare public export_off: number;

	/**
	 * Size of export info.
	 */
	declare public export_size: number;

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

/**
 * Linker option command.
 */
export class linker_option_command extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Number of following strings.
	 */
	declare public count: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Segment offset.
	 */
	declare public offset: number;

	/**
	 * Segment size.
	 */
	declare public size: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File pathname.
	 */
	declare public name: lc_str;

	/**
	 * File virtual address.
	 */
	declare public header_addr: number;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * File __TEXT offset of main entry point.
	 */
	declare public entryoff: bigint;

	/**
	 * Initial stack size, if non-zero.
	 */
	declare public stacksize: bigint;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * A.B.C.D.E packed as a24.b10.c10.d10.e10.
	 */
	declare public version: bigint;

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
	declare public offset: number;

	/**
	 * Data range byte length.
	 */
	declare public length: number;

	/**
	 * Kind (DICE_KIND_*).
	 */
	declare public kind: number;

	static {
		toStringTag(this, 'data_in_code_entry');
		uint32(this, 'offset');
		uint16(this, 'length');
		uint16(this, 'kind');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Thread local variable entry, 32-bit.
 */
export class tlv_descriptor extends Struct {
	/**
	 * A pointer.
	 */
	declare public thunk: number;

	/**
	 * Unsigned long.
	 */
	declare public key: number;

	/**
	 * Unsigned long.
	 */
	declare public offset: number;

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
	declare public thunk: bigint;

	/**
	 * Unsigned long.
	 */
	declare public key: bigint;

	/**
	 * Unsigned long.
	 */
	declare public offset: bigint;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Owner name.
	 */
	declare public data_owner: Arr<number>;

	/**
	 * File offset.
	 */
	declare public offset: bigint;

	/**
	 * Byte length.
	 */
	declare public size: bigint;

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
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Virtual memory address.
	 */
	declare public vmaddr: bigint;

	/**
	 * File offset.
	 */
	declare public fileoff: bigint;

	/**
	 * File pathname.
	 */
	declare public entry_id: lc_str;

	/**
	 * Reserved.
	 */
	declare public reserved: number;

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
