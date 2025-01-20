import {
	assertEquals,
	assertGreater,
	assertLess,
	assertLessOrEqual,
	assertRejects,
	assertThrows,
} from '@std/assert';
import {
	CPU_ARCH_ABI64,
	CPU_SUBTYPE_ARM_ALL,
	CPU_SUBTYPE_ARM_V7,
	CPU_SUBTYPE_ARM_V8,
	CPU_SUBTYPE_LIB64,
	CPU_SUBTYPE_X86_ALL,
	CPU_TYPE_ARM,
	CPU_TYPE_X86,
	FAT_MAGIC,
	MH_DYLIB,
	MH_EXECUTE,
	MH_MAGIC_64,
} from '../const.ts';
import { FatArch } from '../mach/fatarch.ts';
import { FatHeader } from '../mach/fatheader.ts';
import { LoadCommand } from '../mach/loadcommand.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { fixtureMacho, fixtureMachos } from '../spec/fixture.ts';
import { Architecture } from './architecture.ts';
import { Universal } from './universal.ts';

const fixtures = fixtureMachos();

for (const { kind, arch, file, archs } of fixtures) {
	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const uni = new Universal();
		assertEquals(uni.offset(), 0);
		assertEquals(uni.length(), 0);
		assertEquals(uni.isOpen(), false);
		assertEquals(uni.narrowed(), false);
		assertEquals(uni.isUniversal(), false);
		assertEquals(uni.isSuspicious(), false);

		const blob = new Blob([macho]);
		await uni.open(blob);
		assertEquals(uni.offset(), 0);
		assertEquals(uni.length(), 0);
		assertEquals(uni.isOpen(), true);
		assertEquals(uni.narrowed(), false);
		assertEquals(uni.isUniversal(), archs.size > 1);
		assertEquals(uni.isSuspicious(), false);

		const architectures = new Set<Architecture>();
		uni.architectures(architectures);
		assertEquals(architectures.size, archs.size);
		uni.architectures(architectures);
		assertEquals(architectures.size, archs.size);

		for (const a of architectures) {
			const offset = uni.archOffset(a);
			const length = uni.archLength(a);
			if (uni.isUniversal()) {
				assertGreater(offset, 0);
				assertLess(length, blob.size);
				assertLessOrEqual(offset + length, blob.size);
				assertEquals(uni.lengthOfSlice(offset), length);
			} else {
				assertEquals(offset, 0);
				assertEquals(length, blob.size);
			}

			// deno-lint-ignore no-await-in-loop
			const ma = await uni.architecture(a);
			assertEquals(ma.offset(), offset);

			// deno-lint-ignore no-await-in-loop
			const mo = await uni.architecture(offset);
			assertEquals(mo.offset(), offset);
		}
		assertThrows(
			() => uni.archOffset(new Architecture()),
			RangeError,
			'Architecture not found',
		);
		assertThrows(
			() => uni.archLength(new Architecture()),
			RangeError,
			'Architecture not found',
		);
		assertThrows(
			() => uni.lengthOfSlice(0),
			RangeError,
			'Offset not found',
		);
		await assertRejects(
			() => uni.architecture(new Architecture()),
			RangeError,
			'Architecture not found',
		);
		await assertRejects(
			() => uni.architecture(1),
			RangeError,
			uni.isUniversal() ? 'Offset not found' : 'Architecture not found',
		);

		if (/\.dylib$|\.framework\//i.test(file)) {
			assertEquals(await Universal.typeOf(blob), MH_DYLIB);
		} else {
			assertEquals(await Universal.typeOf(blob), MH_EXECUTE);
		}
	});
}

Deno.test('open under header', async () => {
	const blob = new Blob([new ArrayBuffer(3)]);
	const uni = new Universal();
	await assertRejects(
		() => uni.open(blob),
		RangeError,
		'Invalid header',
	);
});

Deno.test('open unknown magic', async () => {
	const data = new ArrayBuffer(
		Math.max(FatHeader.BYTE_LENGTH, MachHeader.BYTE_LENGTH),
	);
	const blob = new Blob([data]);
	const uni = new Universal();
	await assertRejects(
		() => uni.open(blob),
		RangeError,
		'Unknown magic: 0x0',
	);
});

Deno.test('open under arch', async () => {
	const data = new ArrayBuffer(
		Math.max(FatHeader.BYTE_LENGTH, MachHeader.BYTE_LENGTH),
	);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 1;
	const blob = new Blob([data]);
	const uni = new Universal();
	await assertRejects(
		() => uni.open(blob),
		RangeError,
		'Invalid architectures',
	);
});

Deno.test('open under count archs', async () => {
	const data = new ArrayBuffer(
		Math.max(FatHeader.BYTE_LENGTH, MachHeader.BYTE_LENGTH) +
			FatArch.BYTE_LENGTH * 2 + 512,
	);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 1;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.cputype = CPU_TYPE_ARM;
	arch1.offset = data.byteLength - 512;
	arch1.size = 0;

	const arch2 = new FatArch(data, arch1.byteOffset + arch1.byteLength);
	arch2.cputype = CPU_ARCH_ABI64 | CPU_TYPE_ARM;
	arch2.offset = data.byteLength - 256;
	arch2.size = 0;

	const blob = new Blob([data]);
	const uni = new Universal();
	await uni.open(blob);

	const archs = new Set<Architecture>();
	uni.architectures(archs);
	assertEquals(archs.size, 2);
});

Deno.test('open duplicate offset', async () => {
	const data = new ArrayBuffer(
		Math.max(FatHeader.BYTE_LENGTH, MachHeader.BYTE_LENGTH) +
			FatArch.BYTE_LENGTH * 2,
	);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = data.byteLength;
	arch1.size = 0;

	const arch2 = new FatArch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = data.byteLength;
	arch2.size = 0;

	const blob = new Blob([data]);
	const uni = new Universal();
	await assertRejects(
		() => uni.open(blob),
		RangeError,
		`Multiple architectures at offset: 0x${data.byteLength.toString(16)}`,
	);
});

Deno.test('open suspicious gap', async () => {
	const data = new ArrayBuffer(1024);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 1;

	const arch = new FatArch(data, header.byteLength);
	arch.offset = 512;
	arch.size = 512;

	new Uint8Array(data)[256] = 1;

	const blob = new Blob([data]);
	const uni = new Universal();
	await uni.open(blob);
	assertEquals(uni.isSuspicious(), true);
});

Deno.test('open suspicious read align', async () => {
	const data = new ArrayBuffer(1024);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;

	const arch2 = new FatArch(data, header.byteLength + arch1.byteLength);
	arch2.offset = 256 * 3;
	arch2.size = 256;
	arch2.align = 8;

	const blob = new Blob([data]);
	const uni = new Universal();
	await uni.open(blob);
	assertEquals(uni.isSuspicious(), true);
});

Deno.test('open suspicious read after', async () => {
	const data = new ArrayBuffer(1024 + 1);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256 + 1;
	arch1.align = 8;

	const arch2 = new FatArch(data, header.byteLength + arch1.byteLength);
	arch2.offset = 256 * 3;
	arch2.size = 256;
	arch2.align = 8;

	const blob = new Blob([data]);
	const uni = new Universal();
	await uni.open(blob);
	assertEquals(uni.isSuspicious(), true);
});

Deno.test('open suspicious read error', async () => {
	const data = new ArrayBuffer(512 + 1);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256 + 1;
	arch1.align = 8;

	const arch2 = new FatArch(data, header.byteLength + arch1.byteLength);
	arch2.offset = 256 * 3;
	arch2.size = 256;
	arch2.align = 8;

	const blob = new Blob([data]);
	const uni = new Universal();
	await uni.open(blob);
	assertEquals(uni.isSuspicious(), true);
});

Deno.test('findArch case 1: prefer full exact match', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_ARM;
	arch1.cpusubtype = CPU_SUBTYPE_ARM_V8;

	const arch2 = new FatArch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_V8;

	const uni = new Universal();
	await uni.open(new Blob([data]));

	assertEquals(
		uni.archOffset(
			new Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('findArch case 2: prefer masked subtype equal to all', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_ARM;
	arch1.cpusubtype = CPU_SUBTYPE_ARM_ALL;

	const arch2 = new FatArch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_ARM_V8;

	const uni = new Universal();
	await uni.open(new Blob([data]));

	assertEquals(
		uni.archOffset(
			new Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('findArch case 3: prefer all subtype to mismatch', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_ARM;
	arch1.cpusubtype = CPU_SUBTYPE_ARM_V7;

	const arch2 = new FatArch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_ALL;

	const uni = new Universal();
	await uni.open(new Blob([data]));

	assertEquals(
		uni.archOffset(
			new Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('findArch case 4: accept equal type as last resort', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 2;

	const arch1 = new FatArch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_X86;
	arch1.cpusubtype = CPU_SUBTYPE_X86_ALL;

	const arch2 = new FatArch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_ARM_V7;

	const uni = new Universal();
	await uni.open(new Blob([data]));

	assertEquals(
		uni.archOffset(
			new Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('make unknown type', async () => {
	const data = new ArrayBuffer(512);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 1;

	const arch = new FatArch(data, header.byteLength);
	arch.offset = 256;
	arch.size = 256;
	arch.align = 8;

	const mach = new MachHeader64(data, 256);
	mach.magic = MH_MAGIC_64;
	mach.sizeofcmds = 8;
	const command = new LoadCommand(data, 256 + MachHeader64.BYTE_LENGTH);
	command.cmdsize = 8;

	const uni = new Universal();
	await uni.open(new Blob([data]));

	await assertRejects(
		() => uni.architecture(256),
		RangeError,
		'Unknown type',
	);
});

Deno.test('typeOf under header', async () => {
	const blob = new Blob([new ArrayBuffer(MachHeader.BYTE_LENGTH - 1)]);
	assertEquals(await Universal.typeOf(blob), 0);
});

Deno.test('typeOf unknown magic', async () => {
	const blob = new Blob([new ArrayBuffer(MachHeader.BYTE_LENGTH)]);
	assertEquals(await Universal.typeOf(blob), 0);
});

Deno.test('typeOf fat arch under', async () => {
	const data = new ArrayBuffer(FatHeader.BYTE_LENGTH + FatArch.BYTE_LENGTH);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 1;
	const arch = new FatArch(data, FatHeader.BYTE_LENGTH);
	arch.offset = data.byteLength;
	const blob = new Blob([data]);
	assertEquals(await Universal.typeOf(blob), 0);
});

Deno.test('typeOf fat infinite loop', async () => {
	const data = new ArrayBuffer(FatHeader.BYTE_LENGTH + FatArch.BYTE_LENGTH);
	const header = new FatHeader(data);
	header.magic = FAT_MAGIC;
	header.nfatArch = 1;
	const blob = new Blob([data]);
	assertEquals(await Universal.typeOf(blob), 0);
});
