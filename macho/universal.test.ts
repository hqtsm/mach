import {
	assertEquals,
	assertGreater,
	assertLess,
	assertLessOrEqual,
	assertThrows,
} from '@std/assert';
import { FAT_MAGIC, MH_DYLIB, MH_EXECUTE } from '../const.ts';
import { FatArch } from '../mach/fatarch.ts';
import { FatHeader } from '../mach/fatheader.ts';
import { MachHeader } from '../mach/machheader.ts';
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

		if (/\.dylib$|\.framework\//i.test(file)) {
			assertEquals(await Universal.typeOf(blob), MH_DYLIB);
		} else {
			assertEquals(await Universal.typeOf(blob), MH_EXECUTE);
		}
	});
}

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
