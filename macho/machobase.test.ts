import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';
import { type BufferPointer, LITTLE_ENDIAN } from '@hqtsm/struct';
import { MH_MAGIC, MH_MAGIC_64 } from '../const.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { MachOBase } from './machobase.ts';
import { LoadCommand } from '../mod.ts';

class MachOBaseTest extends MachOBase {
	public override initHeader(header: BufferPointer): void {
		super.initHeader(header);
	}

	public override initCommands(commands: BufferPointer): void {
		super.initCommands(commands);
	}

	public override headerSize(): number {
		return super.headerSize();
	}

	public override commandSize(): number {
		return super.commandSize();
	}
}

Deno.test('init', () => {
	let macho = new MachOBaseTest();

	assertEquals(macho.header(), null);
	assertEquals(macho.loadCommands(), null);
	assertEquals(macho.is64(), false);
	assertEquals(macho.isFlipped(), false);

	// Should work with 32-bit size of 64-bit header.
	const headerSize = MachHeader.BYTE_LENGTH;
	const lcSize = LoadCommand.BYTE_LENGTH;
	const FLIP = !LITTLE_ENDIAN;

	const commandN = new LoadCommand(new ArrayBuffer(lcSize));
	commandN.cmd = 1;
	commandN.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandF = new LoadCommand(new ArrayBuffer(lcSize), 0, FLIP);
	commandF.cmd = 1;
	commandF.cmdsize = LoadCommand.BYTE_LENGTH;

	const header32N = new MachHeader(new ArrayBuffer(headerSize));
	header32N.cputype = 2;
	header32N.cpusubtype = 3;
	header32N.filetype = 4;
	header32N.flags = 5;
	header32N.ncmds = 1;
	header32N.sizeofcmds = commandN.cmdsize;

	const header64N = new MachHeader64(new ArrayBuffer(headerSize));
	header64N.cputype = 2;
	header64N.cpusubtype = 3;
	header64N.filetype = 4;
	header64N.flags = 5;
	header64N.ncmds = 1;
	header64N.sizeofcmds = commandN.cmdsize;

	const header32F = new MachHeader(new ArrayBuffer(headerSize), 0, FLIP);
	header32F.cputype = 2;
	header32F.cpusubtype = 3;
	header32F.filetype = 4;
	header32F.flags = 5;
	header32F.ncmds = 1;
	header32F.sizeofcmds = commandF.cmdsize;

	const header64F = new MachHeader64(new ArrayBuffer(headerSize), 0, FLIP);
	header64F.cputype = 2;
	header64F.cpusubtype = 3;
	header64F.filetype = 4;
	header64F.flags = 5;
	header64F.ncmds = 1;
	header64F.sizeofcmds = commandF.cmdsize;

	assertThrows(() => macho.initHeader(header32N));
	assertThrows(() => macho.initHeader(header64N));

	header32N.magic = MH_MAGIC;
	header32F.magic = MH_MAGIC;
	header64N.magic = MH_MAGIC_64;
	header64F.magic = MH_MAGIC_64;

	for (
		const [bits, flip, header, command] of [
			[32, false, header32N, commandN],
			[32, true, header32F, commandF],
			[64, false, header64N, commandN],
			[64, true, header64F, commandF],
		] as const
	) {
		const tag = `bits=${bits} flip=${flip}`;

		macho = new MachOBaseTest();
		macho.initHeader(header satisfies BufferPointer);

		assertStrictEquals(macho.header()?.buffer, header.buffer, tag);
		assertEquals(macho.isFlipped(), flip, tag);
		assertEquals(macho.is64(), bits === 64, tag);
		assertEquals(macho.architecture().cpuType(), 2, tag);
		assertEquals(macho.architecture().cpuSubType(), 3, tag);
		assertEquals(macho.type(), 4, tag);
		assertEquals(macho.flags(), 5, tag);
		assertEquals(macho.headerSize(), header.byteLength, tag);
		assertEquals(macho.commandLength(), header.sizeofcmds, tag);
		assertEquals(macho.commandSize(), header.sizeofcmds, tag);
		assertEquals(macho.loadCommands(), null, tag);

		macho.initCommands(command satisfies BufferPointer);
		assertStrictEquals(macho.loadCommands()?.buffer, command.buffer, tag);
	}
});
