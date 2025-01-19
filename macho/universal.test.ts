import { assertEquals } from '@std/assert';
import { fixtureMacho, fixtureMachos } from '../spec/fixture.ts';
import type { Architecture } from './architecture.ts';
import { Universal } from './universal.ts';

const fixtures = fixtureMachos();

for (const [index, { kind, arch, file, archs }] of fixtures.entries()) {
	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const uni = new Universal();

		assertEquals(uni.isOpen(), false);

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
				const blob = new Blob([
					new ArrayBuffer(3),
					macho,
					new ArrayBuffer(3),
				]);
				await uni.open(blob, 3);
				assertEquals(uni.offset(), 3);
				assertEquals(uni.length(), 0);
				break;
			}
			case 3: {
				const blob = new Blob([
					new ArrayBuffer(3),
					macho,
					new ArrayBuffer(3),
				]);
				await uni.open(blob, 3, macho.byteLength);
				assertEquals(uni.offset(), 3);
				assertEquals(uni.length(), macho.byteLength);
				break;
			}
		}
		assertEquals(uni.isOpen(), true);
		assertEquals(uni.isUniversal(), archs.size > 1);

		const architectures = new Set<Architecture>();
		uni.architectures(architectures);
		assertEquals(architectures.size, archs.size);
		uni.architectures(architectures);
		assertEquals(architectures.size, archs.size);
	});
}
