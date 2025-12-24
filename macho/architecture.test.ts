import { assertEquals } from '@std/assert';
import {
	CPU_SUBTYPE_LIB64,
	CPU_SUBTYPE_MULTIPLE,
	CPU_SUBTYPE_X86_64_H,
	CPU_TYPE_I386,
	CPU_TYPE_X86_64,
} from '../const.ts';
import { FatArch } from '../mach/fatarch.ts';
import { FatArch64 } from '../mach/fatarch64.ts';
import { Architecture } from './architecture.ts';

Deno.test('constructor()', () => {
	const a = new Architecture();
	assertEquals(Architecture.cpuType(a), 0);
	assertEquals(Architecture.cpuSubtype(a), 0);
	assertEquals(Architecture.cpuSubtypeFull(a), 0);
});

Deno.test('constructor(type)', () => {
	const a = new Architecture(0x12345678);
	assertEquals(Architecture.cpuType(a), 0x12345678);
	assertEquals(Architecture.cpuSubtype(a), 0xffffff);
	assertEquals(Architecture.cpuSubtypeFull(a), -1);
});

Deno.test('constructor(type, sub)', () => {
	const a = new Architecture(0x12345678, 0x23456789);
	assertEquals(Architecture.cpuType(a), 0x12345678);
	assertEquals(Architecture.cpuSubtype(a), 0x456789);
	assertEquals(Architecture.cpuSubtypeFull(a), 0x23456789);
});

Deno.test('constructor(archInFile: FatArch)', () => {
	const f = new FatArch(new ArrayBuffer(FatArch.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Architecture(f);
	assertEquals(Architecture.cpuType(a), 0x12345678);
	assertEquals(Architecture.cpuSubtype(a), 0x456789);
	assertEquals(Architecture.cpuSubtypeFull(a), 0x23456789);
});

Deno.test('constructor(archInFile: FatArch64)', () => {
	const f = new FatArch64(new ArrayBuffer(FatArch64.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Architecture(f);
	assertEquals(Architecture.cpuType(a), 0x12345678);
	assertEquals(Architecture.cpuSubtype(a), 0x456789);
	assertEquals(Architecture.cpuSubtypeFull(a), 0x23456789);
});

Deno.test('bool', () => {
	assertEquals(Architecture.bool(new Architecture(0, 0)), false);
	assertEquals(Architecture.bool(new Architecture(0, 1)), false);
	assertEquals(Architecture.bool(new Architecture(1, 0)), true);
	assertEquals(Architecture.bool(new Architecture(1, 1)), true);
});

Deno.test('equals', () => {
	assertEquals(
		Architecture.equals(new Architecture(1, 2), new Architecture(1, 2)),
		true,
	);
	assertEquals(
		Architecture.equals(new Architecture(1, 2), new Architecture(1, 3)),
		false,
	);
	assertEquals(
		Architecture.equals(new Architecture(2, 2), new Architecture(1, 2)),
		false,
	);
});

Deno.test('lessThan', () => {
	assertEquals(
		Architecture.lessThan(new Architecture(1, 2), new Architecture(2, 2)),
		true,
	);
	assertEquals(
		Architecture.lessThan(new Architecture(1, 2), new Architecture(1, 3)),
		true,
	);
	assertEquals(
		Architecture.lessThan(new Architecture(1, 2), new Architecture(1, 2)),
		false,
	);
	assertEquals(
		Architecture.lessThan(new Architecture(2, 2), new Architecture(1, 2)),
		false,
	);
	assertEquals(
		Architecture.lessThan(new Architecture(1, 2), new Architecture(1, 2)),
		false,
	);
});

Deno.test('matches', () => {
	{
		const arch = new Architecture(CPU_TYPE_X86_64, CPU_SUBTYPE_MULTIPLE);
		const tmpl = new Architecture(CPU_TYPE_I386, CPU_SUBTYPE_MULTIPLE);
		assertEquals(Architecture.matches(arch, tmpl), false);
	}
	{
		const arch = new Architecture(CPU_TYPE_X86_64, CPU_SUBTYPE_X86_64_H);
		const tmpl = new Architecture(CPU_TYPE_X86_64, CPU_SUBTYPE_MULTIPLE);
		assertEquals(Architecture.matches(arch, tmpl), true);

		// Not symmetric.
		assertEquals(Architecture.matches(tmpl, arch), false);
	}
	{
		const arch = new Architecture(
			CPU_TYPE_X86_64,
			CPU_SUBTYPE_X86_64_H | CPU_SUBTYPE_LIB64,
		);
		const tmpl = new Architecture(
			CPU_TYPE_X86_64,
			CPU_SUBTYPE_X86_64_H,
		);
		assertEquals(Architecture.matches(arch, tmpl), true);
	}
});
