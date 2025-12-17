import { assertEquals, assertStrictEquals, assertThrows } from '@std/assert';
import {
	type Arr,
	type ArrayBufferPointer,
	type Const,
	LITTLE_ENDIAN,
	Uint8Ptr,
} from '@hqtsm/struct';
import {
	LC_BUILD_VERSION,
	LC_CODE_SIGNATURE,
	LC_DYLIB_CODE_SIGN_DRS,
	LC_SEGMENT,
	LC_SEGMENT_64,
	LC_VERSION_MIN_IPHONEOS,
	LC_VERSION_MIN_MACOSX,
	LC_VERSION_MIN_TVOS,
	LC_VERSION_MIN_WATCHOS,
	MH_MAGIC,
	MH_MAGIC_64,
	PLATFORM_IOS,
	PLATFORM_MACOS,
	PLATFORM_TVOS,
	PLATFORM_WATCHOS,
} from '../const.ts';
import { BuildVersionCommand } from '../mach/buildversioncommand.ts';
import { LinkeditDataCommand } from '../mach/linkeditdatacommand.ts';
import { LoadCommand } from '../mach/loadcommand.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachHeader64 } from '../mach/machheader64.ts';
import { RpathCommand } from '../mach/rpathcommand.ts';
import { Section } from '../mach/section.ts';
import { Section64 } from '../mach/section64.ts';
import { SegmentCommand } from '../mach/segmentcommand.ts';
import { SegmentCommand64 } from '../mach/segmentcommand64.ts';
import { VersionMinCommand } from '../mach/versionmincommand.ts';
import { MachOBase } from './machobase.ts';

class MachOBaseTest extends MachOBase {
	public override initHeader(
		header: ArrayBufferPointer | ArrayBufferLike,
	): void {
		super.initHeader(header);
	}

	public override initCommands(
		commands: ArrayBufferLike | ArrayBufferPointer,
	): void {
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
	assertThrows(
		() => macho.initHeader(header32N),
		RangeError,
		'Unknown magic: 0x0',
	);
	assertStrictEquals(macho.header()!.buffer, header32N.buffer);
	assertThrows(
		() => macho.initHeader(header64N),
		RangeError,
		'Unknown magic: 0x0',
	);
	assertStrictEquals(macho.header()!.buffer, header64N.buffer);

	header32N.magic = 0xabcd1234;
	header32N.sizeofcmds = 1;

	assertThrows(
		() => macho.initHeader(header32N),
		RangeError,
		'Unknown magic: 0x',
	);
	assertThrows(
		() => macho.initCommands(commandN),
		RangeError,
		'Invalid commands size',
	);

	header32N.sizeofcmds = commandN.cmdsize;

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
		macho.initHeader(flip ? header.buffer : header);

		assertStrictEquals(macho.header()!.buffer, header.buffer, tag);
		assertEquals(macho.isFlipped(), flip, tag);
		assertEquals(macho.is64(), bits === 64, tag);
		assertEquals(macho.architecture().cpuType(), 2, tag);
		assertEquals(macho.architecture().cpuSubtype(), 3, tag);
		assertEquals(macho.type(), 4, tag);
		assertEquals(macho.flags(), 5, tag);
		assertEquals(macho.headerSize(), header.byteLength, tag);
		assertEquals(macho.commandLength(), header.sizeofcmds, tag);
		assertEquals(macho.commandSize(), header.sizeofcmds, tag);
		assertEquals(macho.loadCommands(), null, tag);

		macho.initCommands(flip ? command : command.buffer);
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
	macho.initCommands(commands);

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
	macho.initCommands(commands);

	const cmdA = macho.loadCommands()!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrows(
		() => macho.nextCommand(cmdA),
		RangeError,
		'Invalid command size',
	);
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
	macho.initCommands(commands);

	const cmdA = macho.loadCommands()!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrows(
		() => macho.nextCommand(cmdA),
		RangeError,
		'Invalid command size',
	);
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
	macho.initCommands(commands);

	const cmdA = macho.loadCommands()!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrows(
		() => macho.nextCommand(cmdA),
		RangeError,
		'Invalid command size',
	);
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
	macho.initCommands(commands);

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
		macho.initCommands(commands);

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
		macho.initCommands(commands);

		assertThrows(
			() => macho[method](),
			RangeError,
			'Invalid command size',
			tag,
		);
	}
});

Deno.test('find version', () => {
	const p = new Uint8Ptr(new ArrayBuffer(4));

	const commands = new ArrayBuffer(
		LoadCommand.BYTE_LENGTH +
			BuildVersionCommand.BYTE_LENGTH +
			VersionMinCommand.BYTE_LENGTH,
	);

	const commandA = new LoadCommand(commands);
	commandA.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandB = new BuildVersionCommand(commands, LoadCommand.BYTE_LENGTH);
	commandB.cmdsize = BuildVersionCommand.BYTE_LENGTH;

	const commandC = new VersionMinCommand(
		commands,
		LoadCommand.BYTE_LENGTH + BuildVersionCommand.BYTE_LENGTH,
	);
	commandC.cmdsize = VersionMinCommand.BYTE_LENGTH;

	const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 3;
	header.sizeofcmds = commands.byteLength;

	const macho = new MachOBaseTest();
	macho.initHeader(header);
	macho.initCommands(commands);

	assertEquals(macho.version(null, null, null), false);
	assertEquals(macho.platform(), 0);
	assertEquals(macho.minVersion(), 0);
	assertEquals(macho.sdkVersion(), 0);

	for (
		const [LC, PL] of [
			[LC_VERSION_MIN_MACOSX, PLATFORM_MACOS],
			[LC_VERSION_MIN_IPHONEOS, PLATFORM_IOS],
			[LC_VERSION_MIN_WATCHOS, PLATFORM_WATCHOS],
			[LC_VERSION_MIN_TVOS, PLATFORM_TVOS],
		] as const
	) {
		commandC.cmd = LC;
		assertEquals(macho.version(null, null, null), true);
		assertEquals(macho.platform(), PL);

		commandC.version = 12;
		assertEquals(macho.minVersion(), 12);

		commandC.sdk = 23;
		assertEquals(macho.sdkVersion(), 23);
	}

	commandB.cmd = LC_BUILD_VERSION;
	commandB.platform = PLATFORM_MACOS;
	commandB.minos = 34;
	commandB.sdk = 45;

	assertEquals(macho.version(null, null, null), true);
	assertEquals(macho.platform(), PLATFORM_MACOS);
	assertEquals(macho.minVersion(), 34);
	assertEquals(macho.sdkVersion(), 45);

	// Testing the default case if findMinVersion returns something not cased.
	// The default case should be unreachable.
	commandB.cmd = 0x12345678;
	p[0] = 1;
	const desc = Object.getOwnPropertyDescriptor(
		MachOBase.prototype,
		'findMinVersion',
	)!;
	Object.defineProperty(MachOBase.prototype, 'findMinVersion', {
		...desc,
		value: function findMinVersion(): Const<VersionMinCommand> | null {
			return new VersionMinCommand(
				commandB.buffer,
				commandB.byteOffset,
				commandB.littleEndian,
			);
		},
	});
	try {
		assertEquals(macho.platform(), 0);
		assertEquals(macho.version(p, null, null), true);
		assertEquals(p[0], 0);
	} finally {
		Object.defineProperty(MachOBase.prototype, 'findMinVersion', desc);
	}
});

Deno.test('signingOffset signingLength', () => {
	const commands = new ArrayBuffer(
		LoadCommand.BYTE_LENGTH + LinkeditDataCommand.BYTE_LENGTH,
	);

	const commandA = new LoadCommand(commands);
	commandA.cmdsize = LoadCommand.BYTE_LENGTH;

	const commandB = new LinkeditDataCommand(commands, LoadCommand.BYTE_LENGTH);
	commandB.cmdsize = LinkeditDataCommand.BYTE_LENGTH;

	const header = new MachHeader(new ArrayBuffer(MachHeader.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new MachOBaseTest();
	macho.initHeader(header);
	macho.initCommands(commands);

	assertEquals(macho.signingOffset(), 0);
	assertEquals(macho.signingLength(), 0);

	commandB.cmd = LC_CODE_SIGNATURE;
	commandB.dataoff = 12;
	commandB.datasize = 34;

	assertEquals(macho.signingOffset(), 12);
	assertEquals(macho.signingLength(), 34);
});

Deno.test('findSegment findSection', () => {
	const cstr = (s: string) => new TextEncoder().encode(`${s}\0`);

	const strSet = (ptr: Arr<number>, str: ArrayLike<number>) => {
		new Uint8Array(ptr.buffer, ptr.byteOffset).set(str);
	};

	for (
		const [MH, Mach, LC, Seg, Sec] of [
			[
				MH_MAGIC,
				MachHeader,
				LC_SEGMENT,
				SegmentCommand,
				Section,
			],
			[
				MH_MAGIC_64,
				MachHeader64,
				LC_SEGMENT_64,
				SegmentCommand64,
				Section64,
			],
		] as const
	) {
		const tag = `Mach=${Mach.name}`;

		const commands = new ArrayBuffer(
			LoadCommand.BYTE_LENGTH + Seg.BYTE_LENGTH + Sec.BYTE_LENGTH * 2,
		);

		const lc = new LoadCommand(commands);
		lc.cmdsize = LoadCommand.BYTE_LENGTH;

		const seg = new Seg(commands, LoadCommand.BYTE_LENGTH);
		seg.cmd = LC;
		seg.nsects = 2;
		seg.cmdsize = Seg.BYTE_LENGTH + Sec.BYTE_LENGTH * seg.nsects;
		strSet(seg.segname, cstr('group'));

		const secA = new Sec(seg.buffer, seg.byteLength + seg.byteOffset);
		strSet(secA.sectname, cstr('alpha'));

		const secB = new Sec(seg.buffer, secA.byteLength + secA.byteOffset);
		strSet(secB.sectname, cstr('beta'));

		const header = new Mach(new ArrayBuffer(Mach.BYTE_LENGTH));
		header.magic = MH;
		header.ncmds = 2;
		header.sizeofcmds = commands.byteLength;

		const macho = new MachOBaseTest();
		macho.initHeader(header);
		macho.initCommands(commands);

		assertEquals(
			macho.findSegment(cstr('GROUP').buffer),
			null,
			tag,
		);
		assertEquals(
			macho.findSegment(cstr('group'))!.byteOffset,
			seg.byteOffset,
			tag,
		);

		assertEquals(
			macho.findSection(cstr('GROUP'), cstr('ALPHA')),
			null,
			tag,
		);
		assertEquals(
			macho.findSection(cstr('group'), cstr('alpha').buffer)!.byteOffset,
			secA.byteOffset,
			tag,
		);
		assertEquals(
			macho.findSection(cstr('group'), cstr('beta'))!.byteOffset,
			secB.byteOffset,
			tag,
		);
		assertEquals(
			macho.findSection(cstr('group'), cstr('gamma')),
			null,
			tag,
		);

		strSet(seg.segname, cstr('0123456789abcdef').slice(0, 16));

		assertEquals(
			macho.findSegment(cstr('0123456789abcdefg'))!.byteOffset,
			seg.byteOffset,
			tag,
		);

		strSet(seg.segname, cstr('group'));
		const { cmdsize } = seg;
		seg.cmdsize = Seg.BYTE_LENGTH - 1;

		assertThrows(
			() => macho.findSegment(cstr('group')),
			RangeError,
			'Invalid command size',
			tag,
		);

		seg.cmdsize = cmdsize;
		seg.nsects++;

		assertEquals(
			macho.findSection(cstr('group'), cstr('gamma')),
			null,
			tag,
		);
	}
});

Deno.test('string', () => {
	const cstr = new TextEncoder().encode('Some String\0');
	const data = new Uint8Array(RpathCommand.BYTE_LENGTH + cstr.byteLength);

	const command = new RpathCommand(data.buffer);
	command.cmdsize = data.byteLength;
	command.path.offset = RpathCommand.BYTE_LENGTH;
	data.set(cstr, command.path.offset);

	const macho = new MachOBaseTest();
	const chars = macho.string(command, command.path)!;
	const charsStr = new Uint8Array(
		chars.buffer,
		chars.byteOffset,
		cstr.byteLength,
	);

	assertEquals(charsStr, cstr);

	command.cmdsize--;

	assertEquals(macho.string(command, command.path), null);
});
