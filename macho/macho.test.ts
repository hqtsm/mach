import { assertEquals, assertRejects } from '@std/assert';
import {
	LC_SEGMENT,
	LC_SEGMENT_64,
	LC_SYMTAB,
	MH_MAGIC,
	MH_MAGIC_64,
} from '../const.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { SegmentCommand } from '../mach/segmentcommand.ts';
import { SegmentCommand64 } from '../mach/segmentcommand64.ts';
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
			const bin = thin(macho, ...CPU_ARCHITECTURES.get(arc)!);
			const offset = bin.byteOffset;
			const length = offset ? bin.byteLength : blob.size;
			const m = offset
				// deno-lint-ignore no-await-in-loop
				? await MachO.MachO(blob, offset, length)
				// deno-lint-ignore no-await-in-loop
				: await MachO.MachO(blob);

			assertEquals(MachO.isOpen(m), true, arc);
			assertEquals(MachO.offset(m), offset, arc);
			assertEquals(MachO.size(m), length, arc);
			if (info) {
				assertEquals(MachO.signingExtent(m), info.offset, arc);
			} else {
				assertEquals(MachO.signingExtent(m), length, arc);
			}
			assertEquals(MachO.isSuspicious(m), false, arc);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				new Uint8Array(await MachO.dataAt(m, 0, 4)),
				bin.slice(0, 4),
				arc,
			);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				new Uint8Array(await MachO.dataAt(m, 4, 4)),
				bin.slice(4, 8),
				arc,
			);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				(await MachO.dataAt(m, 4, 0)).byteLength,
				0,
				arc,
			);

			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => MachO.dataAt(m, blob.size - 1, 2),
				RangeError,
				`Invalid data range: ${blob.size - 1}:2`,
				arc,
			);
		}
	});
}

Deno.test('read under', async () => {
	let mh = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH - 1));

	await assertRejects(
		() => MachO.MachO(new Blob([mh.buffer as ArrayBuffer])),
		RangeError,
		'Invalid header',
	);

	mh = new MachHeader64(new ArrayBuffer(MachHeader64.BYTE_LENGTH - 1));
	mh.magic = MH_MAGIC_64;

	await assertRejects(
		() => MachO.MachO(new Blob([mh.buffer as ArrayBuffer])),
		RangeError,
		'Invalid header',
	);

	mh = new MachHeader64(new ArrayBuffer(MachHeader64.BYTE_LENGTH + 1));
	mh.magic = MH_MAGIC_64;
	mh.ncmds = 1;
	mh.sizeofcmds = 2;

	await assertRejects(
		() => MachO.MachO(new Blob([mh.buffer as ArrayBuffer])),
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

	{
		const macho = await MachO.MachO(new Blob([buffer]));
		assertEquals(MachO.isSuspicious(macho), false);
	}

	{
		const macho = await MachO.MachO(new Blob([buffer, new ArrayBuffer(1)]));
		assertEquals(MachO.isSuspicious(macho), true);
	}

	{
		const macho = await MachO.MachO(
			new Blob([buffer.slice(0, buffer.byteLength - 1)]),
		);
		assertEquals(MachO.isSuspicious(macho), true);
	}
});

Deno.test('validateStructure bad command size', async () => {
	for (
		const [LC, Command, MH, Header] of [
			[LC_SEGMENT, SegmentCommand, MH_MAGIC, MachHeader],
			[LC_SEGMENT_64, SegmentCommand64, MH_MAGIC_64, MachHeader64],
			[LC_SYMTAB, SymtabCommand, MH_MAGIC, MachHeader],
		] as const
	) {
		const tag =
			`LC=${LC} Command=${Command.name} MH=${MH} Header=${Header.name}`;

		const cmdsize = Command.BYTE_LENGTH - 1;
		const buffer = new ArrayBuffer(Header.BYTE_LENGTH + cmdsize);

		const mh = new Header(buffer);
		mh.magic = MH;
		mh.ncmds = 1;
		mh.sizeofcmds = cmdsize;

		const cmd = new Command(buffer, Header.BYTE_LENGTH);
		cmd.cmd = LC;
		cmd.cmdsize = cmdsize;

		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => MachO.MachO(new Blob([buffer])),
			RangeError,
			'Invalid command size',
			tag,
		);
	}
});
