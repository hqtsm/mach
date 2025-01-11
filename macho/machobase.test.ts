import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';
import { type BufferPointer, LITTLE_ENDIAN } from '@hqtsm/struct';
import {
	LC_BUILD_VERSION,
	LC_CODE_SIGNATURE,
	LC_DYLIB_CODE_SIGN_DRS,
	LC_VERSION_MIN_IPHONEOS,
	LC_VERSION_MIN_MACOSX,
	LC_VERSION_MIN_TVOS,
	LC_VERSION_MIN_WATCHOS,
	MH_MAGIC,
	MH_MAGIC_64,
} from '../const.ts';
import { BuildVersionCommand } from '../mach/buildversioncommand.ts';
import { LinkeditDataCommand } from '../mach/linkeditdatacommand.ts';
import { LoadCommand } from '../mach/loadcommand.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { VersionMinCommand } from '../mach/versionmincommand.ts';
import { MachOBase } from './machobase.ts';

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

const findCommands = [
	['findCodeSignature', LinkeditDataCommand, LC_CODE_SIGNATURE],
	['findLibraryDependencies', LinkeditDataCommand, LC_DYLIB_CODE_SIGN_DRS],
	['findMinVersion', VersionMinCommand, LC_VERSION_MIN_MACOSX],
	['findMinVersion', VersionMinCommand, LC_VERSION_MIN_IPHONEOS],
	['findMinVersion', VersionMinCommand, LC_VERSION_MIN_WATCHOS],
	['findMinVersion', VersionMinCommand, LC_VERSION_MIN_TVOS],
	['findBuildVersion', BuildVersionCommand, LC_BUILD_VERSION],
] as const;

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

	// Throws on bad magic, but still updates mHeader.
	assertThrows(() => macho.initHeader(header32N));
	assertStrictEquals(macho.header()!.buffer, header32N.buffer);
	assertThrows(() => macho.initHeader(header64N));
	assertStrictEquals(macho.header()!.buffer, header64N.buffer);

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

		assertStrictEquals(macho.header()!.buffer, header.buffer, tag);
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
		assertStrictEquals(macho.loadCommands()!.buffer, command.buffer, tag);
	}
});

Deno.test('nextCommand valid', () => {
	const commands = new ArrayBuffer(LoadCommand.BYTE_LENGTH * 2);

	const commandA = new LoadCommand(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandB = new LoadCommand(commands, LoadCommand.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = LoadCommand.BYTE_LENGTH;

	const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new MachOBaseTest();
	macho.initHeader(header);
	macho.initCommands(new Uint8Array(commands));

	const cmdA = macho.loadCommands()!;
	assertEquals(cmdA.cmd, commandA.cmd);

	const cmdB = macho.nextCommand(cmdA)!;
	assertEquals(cmdB.cmd, commandB.cmd);

	const cmdC = macho.nextCommand(cmdB);
	assertEquals(cmdC, null);
});

Deno.test('nextCommand zero', () => {
	const commands = new ArrayBuffer(LoadCommand.BYTE_LENGTH * 2);

	const commandA = new LoadCommand(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = 0;

	const commandB = new LoadCommand(commands, LoadCommand.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = LoadCommand.BYTE_LENGTH;

	const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new MachOBaseTest();
	macho.initHeader(header);
	macho.initCommands(new Uint8Array(commands));

	const cmdA = macho.loadCommands()!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrows(() => macho.nextCommand(cmdA));
});

Deno.test('nextCommand under', () => {
	const commands = new ArrayBuffer(LoadCommand.BYTE_LENGTH * 2 - 1);

	const commandA = new LoadCommand(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandB = new LoadCommand(commands, LoadCommand.BYTE_LENGTH);
	commandB.cmd = 2;

	const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new MachOBaseTest();
	macho.initHeader(header);
	macho.initCommands(new Uint8Array(commands));

	const cmdA = macho.loadCommands()!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrows(() => macho.nextCommand(cmdA));
});

Deno.test('nextCommand over', () => {
	const commands = new ArrayBuffer(LoadCommand.BYTE_LENGTH * 2);

	const commandA = new LoadCommand(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandB = new LoadCommand(commands, LoadCommand.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = LoadCommand.BYTE_LENGTH + 1;

	const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new MachOBaseTest();
	macho.initHeader(header);
	macho.initCommands(new Uint8Array(commands));

	const cmdA = macho.loadCommands()!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrows(() => macho.nextCommand(cmdA));
});

Deno.test('findCommand', () => {
	const commands = new ArrayBuffer(LoadCommand.BYTE_LENGTH * 3);

	const commandA = new LoadCommand(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandB = new LoadCommand(commands, LoadCommand.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandC = new LoadCommand(commands, LoadCommand.BYTE_LENGTH * 2);
	commandC.cmd = 2;
	commandC.cmdsize = LoadCommand.BYTE_LENGTH;

	const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 3;
	header.sizeofcmds = commands.byteLength;

	const macho = new MachOBaseTest();
	macho.initHeader(header);
	macho.initCommands(new Uint8Array(commands));

	assertEquals(macho.findCommand(0), null);
	assertEquals(macho.findCommand(1)!.byteOffset, commandA.byteOffset);
	assertEquals(macho.findCommand(2)!.byteOffset, commandB.byteOffset);
	assertEquals(macho.findCommand(3), null);
});

Deno.test('find command valid', () => {
	for (const [method, Command, CMD] of findCommands) {
		const tag = `method=${method} Command=${Command.name} CMD=${CMD}`;

		const commands = new ArrayBuffer(
			LoadCommand.BYTE_LENGTH + Command.BYTE_LENGTH,
		);

		const commandA = new LoadCommand(commands);
		commandA.cmdsize = LoadCommand.BYTE_LENGTH;

		const commandB = new Command(commands, LoadCommand.BYTE_LENGTH);
		commandB.cmdsize = Command.BYTE_LENGTH;

		const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
		header.magic = MH_MAGIC;
		header.ncmds = 2;
		header.sizeofcmds = commands.byteLength;

		const macho = new MachOBaseTest();
		macho.initHeader(header);
		macho.initCommands(new Uint8Array(commands));

		assertEquals(macho[method](), null, tag);

		commandB.cmd = CMD;

		const found = macho[method]()!;
		assertEquals(found.cmd, CMD, tag);
		assertEquals(found.byteOffset, commandB.byteOffset, tag);
	}
});

Deno.test('find command under', () => {
	for (const [method, Command, CMD] of findCommands) {
		const tag = `method=${method} Command=${Command.name} CMD=${CMD}`;

		const commands = new ArrayBuffer(LoadCommand.BYTE_LENGTH * 2);

		const commandA = new LoadCommand(commands);
		commandA.cmdsize = LoadCommand.BYTE_LENGTH;

		const commandB = new LoadCommand(commands, LoadCommand.BYTE_LENGTH);
		commandB.cmd = CMD;
		commandB.cmdsize = LoadCommand.BYTE_LENGTH;

		const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
		header.magic = MH_MAGIC;
		header.ncmds = 2;
		header.sizeofcmds = commands.byteLength;

		const macho = new MachOBaseTest();
		macho.initHeader(header);
		macho.initCommands(new Uint8Array(commands));

		assertThrows(() => macho[method](), tag);
	}
});
