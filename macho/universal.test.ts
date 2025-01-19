import { assertEquals } from '@std/assert';
import { fixtureMacho, fixtureMachos } from '../spec/fixture.ts';
import type { Architecture } from './architecture.ts';
import { Universal } from './universal.ts';

const fixtures = fixtureMachos();

for (const { kind, arch, file, archs } of fixtures) {
	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const blob = new Blob([macho]);
		const uni = new Universal();

		await uni.open(blob);
		assertEquals(uni.isUniversal(), archs.size > 1);

		const architectures = new Set<Architecture>();
		uni.architectures(architectures);

		assertEquals(architectures.size, archs.size);

		uni.architectures(architectures);

		assertEquals(architectures.size, archs.size);
	});
}
