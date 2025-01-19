import { assertEquals } from '@std/assert';
import { fixtureMacho, fixtureMachos } from '../spec/fixture.ts';
import type { Architecture } from './architecture.ts';
import { Universal } from './universal.ts';
import { MH_DYLIB, MH_EXECUTE } from '../const.ts';

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

		if (/\.dylib$|\.framework\//i.test(file)) {
			assertEquals(await Universal.typeOf(blob), MH_DYLIB);
		} else {
			assertEquals(await Universal.typeOf(blob), MH_EXECUTE);
		}
	});
}
