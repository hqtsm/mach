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
	assertEquals(a.cpuType(), 0);
	assertEquals(a.cpuSubType(), 0);
	assertEquals(a.cpuSubtypeFull(), 0);
});

Deno.test('constructor(type)', () => {
	const a = new Architecture(0x12345678);
	assertEquals(a.cpuType(), 0x12345678);
	assertEquals(a.cpuSubType(), 0xffffff);
	assertEquals(a.cpuSubtypeFull(), -1);
});

Deno.test('constructor(type, sub)', () => {
	const a = new Architecture(0x12345678, 0x23456789);
	assertEquals(a.cpuType(), 0x12345678);
	assertEquals(a.cpuSubType(), 0x456789);
	assertEquals(a.cpuSubtypeFull(), 0x23456789);
});

Deno.test('constructor(archInFile: FatArch)', () => {
	const f = new FatArch(new ArrayBuffer(FatArch.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Architecture(f);
	assertEquals(a.cpuType(), 0x12345678);
	assertEquals(a.cpuSubType(), 0x456789);
	assertEquals(a.cpuSubtypeFull(), 0x23456789);
});

Deno.test('constructor(archInFile: FatArch64)', () => {
	const f = new FatArch64(new ArrayBuffer(FatArch64.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Architecture(f);
	assertEquals(a.cpuType(), 0x12345678);
	assertEquals(a.cpuSubType(), 0x456789);
	assertEquals(a.cpuSubtypeFull(), 0x23456789);
});

Deno.test('bool', () => {
	assertEquals(new Architecture(0, 0).bool(), false);
	assertEquals(new Architecture(0, 1).bool(), false);
	assertEquals(new Architecture(1, 0).bool(), true);
	assertEquals(new Architecture(1, 1).bool(), true);
});

Deno.test('equals', () => {
	assertEquals(new Architecture(1, 2).equals(new Architecture(1, 2)), true);
	assertEquals(new Architecture(1, 2).equals(new Architecture(1, 3)), false);
	assertEquals(new Architecture(2, 2).equals(new Architecture(1, 2)), false);
});

Deno.test('lessThan', () => {
	assertEquals(
		new Architecture(1, 2).lessThan(new Architecture(2, 2)),
		true,
	);
	assertEquals(
		new Architecture(1, 2).lessThan(new Architecture(1, 3)),
		true,
	);
	assertEquals(
		new Architecture(1, 2).lessThan(new Architecture(1, 2)),
		false,
	);
	assertEquals(
		new Architecture(2, 2).lessThan(new Architecture(1, 2)),
		false,
	);
	assertEquals(
		new Architecture(1, 2).lessThan(new Architecture(1, 2)),
		false,
	);
});

Deno.test('matches', () => {
	{
		const arch = new Architecture(CPU_TYPE_X86_64, CPU_SUBTYPE_MULTIPLE);
		const tmpl = new Architecture(CPU_TYPE_I386, CPU_SUBTYPE_MULTIPLE);
		assertEquals(arch.matches(tmpl), false);
	}
	{
		const arch = new Architecture(CPU_TYPE_X86_64, CPU_SUBTYPE_X86_64_H);
		const tmpl = new Architecture(CPU_TYPE_X86_64, CPU_SUBTYPE_MULTIPLE);
		assertEquals(arch.matches(tmpl), true);

		// Not symmetric.
		assertEquals(tmpl.matches(arch), false);
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
		assertEquals(arch.matches(tmpl), true);
	}
});
