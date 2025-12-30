import { assertEquals } from '@std/assert';
import * as C from './const.ts';

const signed = new Set([
	'BIND_SPECIAL_DYLIB_FLAT_LOOKUP',
	'BIND_SPECIAL_DYLIB_MAIN_EXECUTABLE',
	'BIND_SPECIAL_DYLIB_WEAK_LOOKUP',
	'CPU_TYPE_ANY',
	'CPU_SUBTYPE_ANY',
	'CPU_SUBTYPE_MULTIPLE',
]);

Deno.test('constants sign', () => {
	for (const k of Object.keys(C)) {
		const v = (C as { [k: string]: unknown })[k];
		if (typeof v === 'number' && v < 0 && !signed.has(k)) {
			throw new Error(`Invalid constant: ${k}`);
		}
	}
});

Deno.test('constants expressions', () => {
	assertEquals(C.LC_LOAD_WEAK_DYLIB, (0x18 | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_RPATH, (0x1c | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_REEXPORT_DYLIB, (0x1f | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_DYLD_INFO_ONLY, (0x22 | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_LOAD_UPWARD_DYLIB, (0x23 | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_MAIN, (0x28 | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_DYLD_EXPORTS_TRIE, (0x33 | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_DYLD_CHAINED_FIXUPS, (0x34 | C.LC_REQ_DYLD) >>> 0);
	assertEquals(C.LC_FILESET_ENTRY, (0x35 | C.LC_REQ_DYLD) >>> 0);

	assertEquals(C.CPU_TYPE_X86_64, C.CPU_TYPE_X86 | C.CPU_ARCH_ABI64);
	assertEquals(C.CPU_TYPE_ARM64, C.CPU_TYPE_ARM | C.CPU_ARCH_ABI64);
	assertEquals(C.CPU_TYPE_ARM64_32, C.CPU_TYPE_ARM | C.CPU_ARCH_ABI64_32);
	assertEquals(C.CPU_TYPE_POWERPC64, C.CPU_TYPE_POWERPC | C.CPU_ARCH_ABI64);

	assertEquals(C.CPU_SUBTYPE_I386_ALL, C.CPU_SUBTYPE_INTEL(3, 0));
	assertEquals(C.CPU_SUBTYPE_386, C.CPU_SUBTYPE_INTEL(3, 0));
	assertEquals(C.CPU_SUBTYPE_486, C.CPU_SUBTYPE_INTEL(4, 0));
	assertEquals(C.CPU_SUBTYPE_486SX, C.CPU_SUBTYPE_INTEL(4, 8));
	assertEquals(C.CPU_SUBTYPE_586, C.CPU_SUBTYPE_INTEL(5, 0));
	assertEquals(C.CPU_SUBTYPE_PENT, C.CPU_SUBTYPE_INTEL(5, 0));
	assertEquals(C.CPU_SUBTYPE_PENTPRO, C.CPU_SUBTYPE_INTEL(6, 1));
	assertEquals(C.CPU_SUBTYPE_PENTII_M3, C.CPU_SUBTYPE_INTEL(6, 3));
	assertEquals(C.CPU_SUBTYPE_PENTII_M5, C.CPU_SUBTYPE_INTEL(6, 5));
	assertEquals(C.CPU_SUBTYPE_CELERON, C.CPU_SUBTYPE_INTEL(7, 6));
	assertEquals(C.CPU_SUBTYPE_CELERON_MOBILE, C.CPU_SUBTYPE_INTEL(7, 7));
	assertEquals(C.CPU_SUBTYPE_PENTIUM_3, C.CPU_SUBTYPE_INTEL(8, 0));
	assertEquals(C.CPU_SUBTYPE_PENTIUM_3_M, C.CPU_SUBTYPE_INTEL(8, 1));
	assertEquals(C.CPU_SUBTYPE_PENTIUM_3_XEON, C.CPU_SUBTYPE_INTEL(8, 2));
	assertEquals(C.CPU_SUBTYPE_PENTIUM_M, C.CPU_SUBTYPE_INTEL(9, 0));
	assertEquals(C.CPU_SUBTYPE_PENTIUM_4, C.CPU_SUBTYPE_INTEL(10, 0));
	assertEquals(C.CPU_SUBTYPE_PENTIUM_4_M, C.CPU_SUBTYPE_INTEL(10, 1));
	assertEquals(C.CPU_SUBTYPE_ITANIUM, C.CPU_SUBTYPE_INTEL(11, 0));
	assertEquals(C.CPU_SUBTYPE_ITANIUM_2, C.CPU_SUBTYPE_INTEL(11, 1));
	assertEquals(C.CPU_SUBTYPE_XEON, C.CPU_SUBTYPE_INTEL(12, 0));
	assertEquals(C.CPU_SUBTYPE_XEON_MP, C.CPU_SUBTYPE_INTEL(12, 1));

	assertEquals(C.VM_PROT_DEFAULT, C.VM_PROT_READ | C.VM_PROT_WRITE);
	assertEquals(
		C.VM_PROT_ALL,
		C.VM_PROT_READ | C.VM_PROT_WRITE | C.VM_PROT_EXECUTE,
	);
	assertEquals(
		C.VM_PROT_EXECUTE_ONLY,
		C.VM_PROT_EXECUTE | C.VM_PROT_STRIP_READ,
	);
	assertEquals(C.VM_PROT_ALLEXEC_X86_64, C.VM_PROT_EXECUTE | C.VM_PROT_UEXEC);

	assertEquals(
		C.CSSLOT_ALTERNATE_CODEDIRECTORY_LIMIT,
		C.CSSLOT_ALTERNATE_CODEDIRECTORIES +
			C.CSSLOT_ALTERNATE_CODEDIRECTORY_MAX,
	);
});

Deno.test('constant: CPU_SUBTYPE_INTEL', () => {
	const subtype = C.CPU_SUBTYPE_INTEL(0x8, 0xfedcba9);
	assertEquals(subtype, 0xfedcba98);

	const family = C.CPU_SUBTYPE_INTEL_FAMILY(subtype);
	assertEquals(family, 0x8);

	const model = C.CPU_SUBTYPE_INTEL_MODEL(subtype);
	assertEquals(model, 0xfedcba9);
});

Deno.test('constant: CPU_SUBTYPE_ARM64', () => {
	assertEquals(C.CPU_SUBTYPE_ARM64_PTR_AUTH_VERSION(0x00000000), 0);
	assertEquals(C.CPU_SUBTYPE_ARM64_PTR_AUTH_VERSION(0x01000000), 1);
	assertEquals(C.CPU_SUBTYPE_ARM64_PTR_AUTH_VERSION(0x0f000000), 15);
});
