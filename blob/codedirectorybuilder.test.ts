import { assertEquals, assertNotEquals, assertThrows } from '@std/assert';
import {
	fixtureMachos,
	indexOf,
	machoThin,
	readMachoFiles,
} from '../util.spec.ts';
import { createCodeDirectories } from './codedirectorybuilder.spec.ts';
import { CodeDirectoryBuilder } from './codedirectorybuilder.ts';
import { kSecCodeSignatureHashSHA1 } from '../const.ts';

const fixtures = fixtureMachos();

Deno.test('codeSlots', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.codeSlots, 0);
	builder.execLength = 1;
	assertEquals(builder.codeSlots, 1);
	builder.pageSize = 1024;
	builder.execLength = 1024;
	assertEquals(builder.codeSlots, 1);
	builder.execLength = 1025;
	assertEquals(builder.codeSlots, 2);
});

Deno.test('addExecSegFlags', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	builder.addExecSegFlags(1n);
	assertEquals(builder.execSegFlags, 1n);
	builder.addExecSegFlags(2n);
	assertEquals(builder.execSegFlags, 3n);
	builder.addExecSegFlags(4n);
	assertEquals(builder.execSegFlags, 7n);
});

Deno.test('specialSlot', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.specialSlots, 0);
	builder.setSpecialSlot(1, hash);
	assertEquals(builder.specialSlots, 1);
	assertThrows(() => builder.setSpecialSlot(0, hash));
	assertThrows(() => builder.setSpecialSlot(1, new Uint8Array()));
	assertEquals(builder.specialSlots, 1);
	assertEquals(builder.getSpecialSlot(1), hash);
	assertEquals(builder.getSpecialSlot(2), null);
	assertThrows(() => builder.getSpecialSlot(0));
});

Deno.test('codeSlot', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	assertEquals(builder.codeSlots, 0);
	assertThrows(() => builder.getCodeSlot(0));
	assertThrows(() => builder.setCodeSlot(0, hash));
	builder.pageSize = 1024;
	builder.execLength = 1024;
	assertEquals(builder.getCodeSlot(0), null);
	builder.setCodeSlot(0, hash);
	assertEquals(builder.getCodeSlot(0), hash);
	assertEquals(builder.codeSlots, 1);
	assertThrows(() => builder.setCodeSlot(-1, hash));
	assertThrows(() => builder.setCodeSlot(2, hash));
	assertThrows(() => builder.setCodeSlot(0, new Uint8Array()));
	assertEquals(builder.codeSlots, 1);
	assertEquals(builder.getCodeSlot(0), hash);
});

Deno.test('createScatter', () => {
	const builder = new CodeDirectoryBuilder(kSecCodeSignatureHashSHA1);
	let scatter = builder.createScatter(NaN);
	assertEquals(scatter.length, 1);
	scatter = builder.createScatter(2);
	scatter[0].count = 1;
	scatter[1].count = 2;
	assertEquals(scatter.length, 3);
	builder.build();
});

for (const { kind, arch, file, archs } of fixtures) {
	// Skip binaries with no signed architectures.
	if (![...archs.values()].filter(Boolean).length) {
		continue;
	}

	Deno.test(`${kind}: ${arch}: ${file}`, async () => {
		const { macho, infoPlist, codeResources } = await readMachoFiles(
			kind,
			arch,
			file,
		);

		for (const [arc, info] of archs) {
			// Skip unsigned architectures in fat binaries.
			if (!info) {
				continue;
			}

			const message = (s: string) => `CD: ${arc}: ${s}`;
			const thin = machoThin(macho, info.arch[0], info.arch[1]);

			for await (
				const cd of createCodeDirectories(
					info,
					thin,
					infoPlist,
					codeResources,
				)
			) {
				const cdBuffer = new Uint8Array(
					cd.buffer,
					cd.byteOffset,
					cd.length,
				);
				const expectedWithin = new Uint8Array(
					thin.buffer,
					thin.byteOffset + info.offset,
					thin.byteLength - info.offset,
				);
				assertNotEquals(
					indexOf(expectedWithin, cdBuffer),
					-1,
					message(`hashType=${cd.hashType}: within`),
				);
			}
		}
	});
}
