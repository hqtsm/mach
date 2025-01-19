import { assertEquals } from '@std/assert';
import { fixtureMacho, fixtureMachos } from '../spec/fixture.ts';
import type { Architecture } from './architecture.ts';
import { Universal } from './universal.ts';

const fixtures = fixtureMachos();

for (const [index, { kind, arch, file, archs }] of fixtures.entries()) {
	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const uni = new Universal();
		assertEquals(uni.offset(), 0);
		assertEquals(uni.length(), 0);
		assertEquals(uni.isOpen(), false);
		assertEquals(uni.isUniversal(), false);
		assertEquals(uni.isSuspicious(), false);

		switch (index % 4) {
			case 0: {
				const blob = new Blob([macho]);
				await uni.open(blob);
				assertEquals(uni.offset(), 0);
				assertEquals(uni.length(), 0);
				break;
			}
			case 1: {
				const blob = new Blob([macho]);
				await uni.open(blob, 0, blob.size);
				assertEquals(uni.offset(), 0);
				assertEquals(uni.length(), blob.size);
				break;
			}
			case 2: {
				const pad = new ArrayBuffer(3);
				const blob = new Blob([pad, macho, pad]);
				await uni.open(blob, pad.byteLength);
				assertEquals(uni.offset(), pad.byteLength);
				assertEquals(uni.length(), 0);
				break;
			}
			case 3: {
				const pad = new ArrayBuffer(3);
				const blob = new Blob([pad, macho, pad]);
				await uni.open(blob, pad.byteLength, macho.byteLength);
				assertEquals(uni.offset(), pad.byteLength);
				assertEquals(uni.length(), macho.byteLength);
				break;
			}
		}
		assertEquals(uni.isOpen(), true);
		assertEquals(uni.isUniversal(), archs.size > 1);
		// assertEquals(uni.isSuspicious(), false);

		const architectures = new Set<Architecture>();
		uni.architectures(architectures);
		assertEquals(architectures.size, archs.size);
		uni.architectures(architectures);
		assertEquals(architectures.size, archs.size);
	});
}
