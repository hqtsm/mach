import { assertEquals } from '@std/assert';
import { Architecture } from './architecture.ts';
import { FatArch } from '../mach/fatarch.ts';
import { FatArch64 } from '../mach/fatarch64.ts';

Deno.test('constructor()', () => {
	const a = new Architecture();
	assertEquals(a.cpuType, 0);
	assertEquals(a.cpuSubType, 0);
	assertEquals(a.cpuSubtypeFull, 0);
});

Deno.test('constructor(type)', () => {
	const a = new Architecture(0x12345678);
	assertEquals(a.cpuType, 0x12345678);
	assertEquals(a.cpuSubType, 0xffffff);
	assertEquals(a.cpuSubtypeFull, -1);
});

Deno.test('constructor(type, sub)', () => {
	const a = new Architecture(0x12345678, 0x23456789);
	assertEquals(a.cpuType, 0x12345678);
	assertEquals(a.cpuSubType, 0x456789);
	assertEquals(a.cpuSubtypeFull, 0x23456789);
});

Deno.test('constructor(archInFile: FatArch)', () => {
	const f = new FatArch(new ArrayBuffer(FatArch.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Architecture(f);
	assertEquals(a.cpuType, 0x12345678);
	assertEquals(a.cpuSubType, 0x456789);
	assertEquals(a.cpuSubtypeFull, 0x23456789);
});

Deno.test('constructor(archInFile: FatArch64)', () => {
	const f = new FatArch64(new ArrayBuffer(FatArch64.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Architecture(f);
	assertEquals(a.cpuType, 0x12345678);
	assertEquals(a.cpuSubType, 0x456789);
	assertEquals(a.cpuSubtypeFull, 0x23456789);
});
