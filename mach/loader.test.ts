import { assertEquals } from '@std/assert';
import {
	LC_DYLD_CHAINED_FIXUPS,
	LC_DYLD_EXPORTS_TRIE,
	LC_DYLD_INFO_ONLY,
	LC_FILESET_ENTRY,
	LC_LOAD_UPWARD_DYLIB,
	LC_LOAD_WEAK_DYLIB,
	LC_MAIN,
	LC_REEXPORT_DYLIB,
	LC_REQ_DYLD,
	LC_RPATH,
} from './loader.ts';
import * as loader from './loader.ts';

const BYTE_LENGTH = {
	build_tool_version: 8,
	build_version_command: 24,
	data_in_code_entry: 8,
	dyld_info_command: 48,
	dylib: 16,
	dylib_command: 24,
	dylib_module: 52,
	dylib_module_64: 56,
	dylib_reference: 4,
	dylib_table_of_contents: 8,
	dylib_use_command: 28,
	dylinker_command: 12,
	dysymtab_command: 80,
	encryption_info_command: 20,
	encryption_info_command_64: 24,
	entry_point_command: 24,
	fileset_entry_command: 32,
	fvmfile_command: 16,
	fvmlib: 12,
	fvmlib_command: 20,
	ident_command: 8,
	lc_str: 4,
	linkedit_data_command: 16,
	linker_option_command: 12,
	load_command: 8,
	mach_header: 28,
	mach_header_64: 32,
	note_command: 40,
	prebind_cksum_command: 12,
	prebound_dylib_command: 20,
	routines_command: 40,
	routines_command_64: 72,
	rpath_command: 12,
	section: 68,
	section_64: 80,
	segment_command: 56,
	segment_command_64: 72,
	source_version_command: 16,
	sub_client_command: 12,
	sub_framework_command: 12,
	sub_library_command: 12,
	sub_umbrella_command: 12,
	symseg_command: 16,
	symtab_command: 24,
	target_triple_command: 12,
	thread_command: 8,
	tlv_descriptor: 12,
	tlv_descriptor_64: 24,
	twolevel_hint: 4,
	twolevel_hints_command: 16,
	uuid_command: 24,
	version_min_command: 16,
} as const;

Deno.test('BYTE_LENGTH', () => {
	for (
		const [key, value] of Object.entries(BYTE_LENGTH) as [
			keyof typeof BYTE_LENGTH,
			number,
		][]
	) {
		assertEquals(loader[key].BYTE_LENGTH, value);
	}
});

Deno.test('constant expressions', () => {
	assertEquals(LC_LOAD_WEAK_DYLIB, (0x18 | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_RPATH, (0x1c | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_REEXPORT_DYLIB, (0x1f | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_DYLD_INFO_ONLY, (0x22 | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_LOAD_UPWARD_DYLIB, (0x23 | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_MAIN, (0x28 | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_DYLD_EXPORTS_TRIE, (0x33 | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_DYLD_CHAINED_FIXUPS, (0x34 | LC_REQ_DYLD) >>> 0);
	assertEquals(LC_FILESET_ENTRY, (0x35 | LC_REQ_DYLD) >>> 0);
});
