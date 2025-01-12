import { assertEquals, assertRejects } from '@std/assert';
import { LC_SYMTAB, MH_MAGIC, MH_MAGIC_64 } from '../const.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { SymtabCommand } from '../mach/symtabcommand.ts';
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
			assertEquals(m.isSuspicious(), false, arc);

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
			assertEquals(m.isSuspicious(), false, arc);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				new Uint8Array(await m.dataAt(0, 4)),
				bin.slice(0, 4),
				arc,
			);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				new Uint8Array(await m.dataAt(4, 4)),
				bin.slice(4, 8),
				arc,
			);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				(await m.dataAt(4, 0)).byteLength,
				0,
				arc,
			);

			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => m.dataAt(blob.size - 1, 2),
				RangeError,
				`Invalid data range: ${blob.size - 1}:2`,
			);
		}
	});
}

Deno.test('open under', async () => {
	const macho = new MachO();

	let mh = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH - 1));

	await assertRejects(
		() => macho.open(new Blob([mh.buffer])),
		RangeError,
		'Invalid header',
	);

	mh = new MachHeader64(new ArrayBuffer(MachHeader64.BYTE_LENGTH - 1));
	mh.magic = MH_MAGIC_64;

	await assertRejects(
		() => macho.open(new Blob([mh.buffer])),
		RangeError,
		'Invalid header',
	);

	mh = new MachHeader64(new ArrayBuffer(MachHeader64.BYTE_LENGTH + 1));
	mh.magic = MH_MAGIC_64;
	mh.ncmds = 1;
	mh.sizeofcmds = 2;

	await assertRejects(
		() => macho.open(new Blob([mh.buffer])),
		RangeError,
		'Invalid commands',
	);
});

Deno.test('validateStructure LC_SYMTAB', async () => {
	const extra = 0xff;
	const buffer = new ArrayBuffer(
		MachHeader.BYTE_LENGTH + SymtabCommand.BYTE_LENGTH + extra,
	);

	const mh = new MachHeader(buffer, 0, false);
	mh.magic = MH_MAGIC;
	mh.ncmds = 1;
	mh.sizeofcmds = SymtabCommand.BYTE_LENGTH;

	const cmd = new SymtabCommand(buffer, MachHeader.BYTE_LENGTH, false);
	cmd.cmd = LC_SYMTAB;
	cmd.cmdsize = SymtabCommand.BYTE_LENGTH;
	cmd.stroff = MachHeader.BYTE_LENGTH + SymtabCommand.BYTE_LENGTH;
	cmd.strsize = extra;

	let macho = new MachO();
	await macho.open(new Blob([buffer]));

	assertEquals(macho.isSuspicious(), false);

	macho = new MachO();
	await macho.open(new Blob([buffer, new ArrayBuffer(1)]));

	assertEquals(macho.isSuspicious(), true);

	macho = new MachO();
	await macho.open(new Blob([buffer.slice(0, buffer.byteLength - 1)]));

	assertEquals(macho.isSuspicious(), true);
});
