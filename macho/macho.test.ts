import { assertEquals } from '@std/assert/equals';
import {
	CPU_ARCHITECTURES,
	fixtureMacho,
	fixtureMachos,
} from '../spec/fixture.ts';
import { thin } from '../spec/macho.ts';
import { MachO } from './macho.ts';

const fixtures = fixtureMachos();

for (const { kind, arch, file, archs } of fixtures) {
	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const blob = new Blob([macho]);
		for (const [arc, info] of archs) {
			const m = new MachO();

			assertEquals(m.isOpen(), false, arc);
			assertEquals(m.offset(), 0, arc);
			assertEquals(m.length(), 0, arc);
			assertEquals(m.signingExtent(), 0, arc);

			const bin = thin(macho, ...CPU_ARCHITECTURES.get(arc)!);
			const offset = bin.byteOffset;
			const length = offset ? bin.byteLength : blob.size;
			if (offset) {
				// deno-lint-ignore no-await-in-loop
				await m.open(blob, offset, length);
			} else {
				// deno-lint-ignore no-await-in-loop
				await m.open(blob);
			}

			assertEquals(m.isOpen(), true, arc);
			assertEquals(m.offset(), offset, arc);
			assertEquals(m.length(), length, arc);

			if (info) {
				assertEquals(m.signingExtent(), info.offset, arc);
			} else {
				assertEquals(m.signingExtent(), length, arc);
			}
		}
	});
}
