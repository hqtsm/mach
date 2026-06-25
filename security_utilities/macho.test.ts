import {
	assertEquals,
	assertGreater,
	assertLess,
	assertLessOrEqual,
	assertStrictEquals,
} from '@std/assert';
import {
	type Arr,
	type ArrayBufferPointer,
	LITTLE_ENDIAN,
	Uint8Ptr,
} from '@hqtsm/struct';
import { EIO, ENOEXEC } from '../libc/errno.ts';
import {
	CPU_ARCH_ABI64,
	CPU_SUBTYPE_ARM_ALL,
	CPU_SUBTYPE_ARM_V7,
	CPU_SUBTYPE_ARM_V8,
	CPU_SUBTYPE_LIB64,
	CPU_SUBTYPE_MULTIPLE,
	CPU_SUBTYPE_X86_64_H,
	CPU_SUBTYPE_X86_ALL,
	CPU_TYPE_ARM,
	CPU_TYPE_I386,
	CPU_TYPE_X86,
	CPU_TYPE_X86_64,
} from '../mach/machine.ts';
import { fat_arch, fat_arch_64, fat_header, FAT_MAGIC } from '../mach-o/fat.ts';
import {
	build_version_command,
	LC_BUILD_VERSION,
	LC_CODE_SIGNATURE,
	LC_DYLIB_CODE_SIGN_DRS,
	LC_SEGMENT,
	LC_SEGMENT_64,
	LC_SYMTAB,
	LC_VERSION_MIN_IPHONEOS,
	LC_VERSION_MIN_MACOSX,
	LC_VERSION_MIN_TVOS,
	LC_VERSION_MIN_WATCHOS,
	linkedit_data_command,
	load_command,
	mach_header,
	mach_header_64,
	MH_DYLIB,
	MH_EXECUTE,
	MH_MAGIC,
	MH_MAGIC_64,
	PLATFORM_IOS,
	PLATFORM_MACOS,
	PLATFORM_TVOS,
	PLATFORM_WATCHOS,
	rpath_command,
	section,
	section_64,
	segment_command,
	segment_command_64,
	symtab_command,
	version_min_command,
} from '../mach-o/loader.ts';
import { errSecInternalError } from '../Security/SecBase.ts';
import {
	assertRejectsMacOSError,
	assertRejectsUnixError,
	assertThrowsMacOSError,
	assertThrowsUnixError,
} from '../spec/assert.ts';
import {
	CPU_ARCHITECTURES,
	fixtureMacho,
	fixtureMachos,
} from '../spec/fixture.ts';
import { thin } from '../spec/macho.ts';
import {
	Security_Architecture,
	Security_MachO,
	Security_MachOBase,
	Security_MachOImage,
	Security_MAX_ARCH_COUNT,
	Security_Universal,
} from './macho.ts';

const fixtures = fixtureMachos();

async function tests<T>(
	cases: readonly T[],
	test: (value: T) => Promise<unknown>,
): Promise<void> {
	const remap = (p: Promise<unknown>) => p.then(() => null, (e) => e);
	const results = await Promise.all(cases.map(test).map(remap));
	const expected = cases.map(() => null);
	assertEquals(results, expected);
}

Deno.test('Security_Architecture: constructor()', () => {
	const a = new Security_Architecture();
	assertEquals(Security_Architecture.cpuType(a), 0);
	assertEquals(Security_Architecture.cpuSubtype(a), 0);
	assertEquals(Security_Architecture.cpuSubtypeFull(a), 0);
});

Deno.test('Security_Architecture: constructor(type)', () => {
	const a = new Security_Architecture(0x12345678);
	assertEquals(Security_Architecture.cpuType(a), 0x12345678);
	assertEquals(Security_Architecture.cpuSubtype(a), 0xffffff);
	assertEquals(Security_Architecture.cpuSubtypeFull(a), -1);
});

Deno.test('Security_Architecture: constructor(type, sub)', () => {
	const a = new Security_Architecture(0x12345678, 0x23456789);
	assertEquals(Security_Architecture.cpuType(a), 0x12345678);
	assertEquals(Security_Architecture.cpuSubtype(a), 0x456789);
	assertEquals(Security_Architecture.cpuSubtypeFull(a), 0x23456789);
});

Deno.test('Security_Architecture: constructor(archInFile: FatArch)', () => {
	const f = new fat_arch(new ArrayBuffer(fat_arch.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Security_Architecture(f);
	assertEquals(Security_Architecture.cpuType(a), 0x12345678);
	assertEquals(Security_Architecture.cpuSubtype(a), 0x456789);
	assertEquals(Security_Architecture.cpuSubtypeFull(a), 0x23456789);
});

Deno.test('Security_Architecture: constructor(archInFile: FatArch64)', () => {
	const f = new fat_arch_64(new ArrayBuffer(fat_arch_64.BYTE_LENGTH));
	f.cputype = 0x12345678;
	f.cpusubtype = 0x23456789;
	const a = new Security_Architecture(f);
	assertEquals(Security_Architecture.cpuType(a), 0x12345678);
	assertEquals(Security_Architecture.cpuSubtype(a), 0x456789);
	assertEquals(Security_Architecture.cpuSubtypeFull(a), 0x23456789);
});

Deno.test('Security_Architecture: bool', () => {
	assertEquals(
		Security_Architecture.bool(new Security_Architecture(0, 0)),
		false,
	);
	assertEquals(
		Security_Architecture.bool(new Security_Architecture(0, 1)),
		false,
	);
	assertEquals(
		Security_Architecture.bool(new Security_Architecture(1, 0)),
		true,
	);
	assertEquals(
		Security_Architecture.bool(new Security_Architecture(1, 1)),
		true,
	);
});

Deno.test('Security_Architecture: equals', () => {
	assertEquals(
		Security_Architecture.equals(
			new Security_Architecture(1, 2),
			new Security_Architecture(1, 2),
		),
		true,
	);
	assertEquals(
		Security_Architecture.equals(
			new Security_Architecture(1, 2),
			new Security_Architecture(1, 3),
		),
		false,
	);
	assertEquals(
		Security_Architecture.equals(
			new Security_Architecture(2, 2),
			new Security_Architecture(1, 2),
		),
		false,
	);
});

Deno.test('Security_Architecture: lessThan', () => {
	assertEquals(
		Security_Architecture.lessThan(
			new Security_Architecture(1, 2),
			new Security_Architecture(2, 2),
		),
		true,
	);
	assertEquals(
		Security_Architecture.lessThan(
			new Security_Architecture(1, 2),
			new Security_Architecture(1, 3),
		),
		true,
	);
	assertEquals(
		Security_Architecture.lessThan(
			new Security_Architecture(1, 2),
			new Security_Architecture(1, 2),
		),
		false,
	);
	assertEquals(
		Security_Architecture.lessThan(
			new Security_Architecture(2, 2),
			new Security_Architecture(1, 2),
		),
		false,
	);
	assertEquals(
		Security_Architecture.lessThan(
			new Security_Architecture(1, 2),
			new Security_Architecture(1, 2),
		),
		false,
	);
});

Deno.test('Security_Architecture: matches', () => {
	{
		const arch = new Security_Architecture(
			CPU_TYPE_X86_64,
			CPU_SUBTYPE_MULTIPLE,
		);
		const tmpl = new Security_Architecture(
			CPU_TYPE_I386,
			CPU_SUBTYPE_MULTIPLE,
		);
		assertEquals(Security_Architecture.matches(arch, tmpl), false);
	}
	{
		const arch = new Security_Architecture(
			CPU_TYPE_X86_64,
			CPU_SUBTYPE_X86_64_H,
		);
		const tmpl = new Security_Architecture(
			CPU_TYPE_X86_64,
			CPU_SUBTYPE_MULTIPLE,
		);
		assertEquals(Security_Architecture.matches(arch, tmpl), true);

		// Not symmetric.
		assertEquals(Security_Architecture.matches(tmpl, arch), false);
	}
	{
		const arch = new Security_Architecture(
			CPU_TYPE_X86_64,
			CPU_SUBTYPE_X86_64_H | CPU_SUBTYPE_LIB64,
		);
		const tmpl = new Security_Architecture(
			CPU_TYPE_X86_64,
			CPU_SUBTYPE_X86_64_H,
		);
		assertEquals(Security_Architecture.matches(arch, tmpl), true);
	}
});

class MachOBaseTest extends Security_MachOBase {
	public static override initHeader(
		_this: Security_MachOBase,
		header: ArrayBufferPointer | ArrayBufferLike,
	): void {
		Security_MachOBase.initHeader(_this, header);
	}

	public static override initCommands(
		_this: Security_MachOBase,
		commands: ArrayBufferLike | ArrayBufferPointer,
	): void {
		Security_MachOBase.initCommands(_this, commands);
	}

	public static override headerSize(_this: Security_MachOBase): number {
		return super.headerSize(_this);
	}

	public static override commandSize(_this: Security_MachOBase): number {
		return super.commandSize(_this);
	}
}

const findCommands = [
	['findCodeSignature', linkedit_data_command, LC_CODE_SIGNATURE],
	['findLibraryDependencies', linkedit_data_command, LC_DYLIB_CODE_SIGN_DRS],
	['findMinVersion', version_min_command, LC_VERSION_MIN_MACOSX],
	['findMinVersion', version_min_command, LC_VERSION_MIN_IPHONEOS],
	['findMinVersion', version_min_command, LC_VERSION_MIN_WATCHOS],
	['findMinVersion', version_min_command, LC_VERSION_MIN_TVOS],
	['findBuildVersion', build_version_command, LC_BUILD_VERSION],
] as const;

Deno.test('Security_MachOBase: init', () => {
	let macho = new Security_MachOBase();

	assertEquals(Security_MachOBase.header(macho), null);
	assertEquals(Security_MachOBase.loadCommands(macho), null);
	assertEquals(Security_MachOBase.is64(macho), false);
	assertEquals(Security_MachOBase.isFlipped(macho), false);

	// Should work with 32-bit size of 64-bit header.
	const headerSize = mach_header.BYTE_LENGTH;
	const lcSize = load_command.BYTE_LENGTH;
	const FLIP = !LITTLE_ENDIAN;

	const commandN = new load_command(new ArrayBuffer(lcSize));
	commandN.cmd = 1;
	commandN.cmdsize = load_command.BYTE_LENGTH;

	const commandF = new load_command(new ArrayBuffer(lcSize), 0, FLIP);
	commandF.cmd = 1;
	commandF.cmdsize = load_command.BYTE_LENGTH;

	const header32N = new mach_header(new ArrayBuffer(headerSize));
	header32N.cputype = 2;
	header32N.cpusubtype = 3;
	header32N.filetype = 4;
	header32N.flags = 5;
	header32N.ncmds = 1;
	header32N.sizeofcmds = commandN.cmdsize;

	const header64N = new mach_header_64(new ArrayBuffer(headerSize));
	header64N.cputype = 2;
	header64N.cpusubtype = 3;
	header64N.filetype = 4;
	header64N.flags = 5;
	header64N.ncmds = 1;
	header64N.sizeofcmds = commandN.cmdsize;

	const header32F = new mach_header(new ArrayBuffer(headerSize), 0, FLIP);
	header32F.cputype = 2;
	header32F.cpusubtype = 3;
	header32F.filetype = 4;
	header32F.flags = 5;
	header32F.ncmds = 1;
	header32F.sizeofcmds = commandF.cmdsize;

	const header64F = new mach_header_64(new ArrayBuffer(headerSize), 0, FLIP);
	header64F.cputype = 2;
	header64F.cpusubtype = 3;
	header64F.filetype = 4;
	header64F.flags = 5;
	header64F.ncmds = 1;
	header64F.sizeofcmds = commandF.cmdsize;

	// Throws on bad magic, but still updates mHeader.
	assertThrowsUnixError(
		() => MachOBaseTest.initHeader(macho, header32N),
		ENOEXEC,
	);
	assertStrictEquals(
		Security_MachOBase.header(macho)!.buffer,
		header32N.buffer,
	);
	assertThrowsUnixError(
		() => MachOBaseTest.initHeader(macho, header64N),
		ENOEXEC,
	);
	assertStrictEquals(
		Security_MachOBase.header(macho)!.buffer,
		header64N.buffer,
	);

	header32N.magic = 0xabcd1234;
	header32N.sizeofcmds = 1;

	assertThrowsUnixError(
		() => MachOBaseTest.initHeader(macho, header32N),
		ENOEXEC,
	);
	assertThrowsUnixError(
		() => MachOBaseTest.initCommands(macho, commandN),
		ENOEXEC,
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

		macho = new Security_MachOBase();
		MachOBaseTest.initHeader(macho, flip ? header.buffer : header);

		assertStrictEquals(
			Security_MachOBase.header(macho)!.buffer,
			header.buffer,
			tag,
		);
		assertEquals(Security_MachOBase.isFlipped(macho), flip, tag);
		assertEquals(Security_MachOBase.is64(macho), bits === 64, tag);
		assertEquals(
			Security_Architecture.cpuType(
				Security_MachOBase.architecture(macho),
			),
			2,
			tag,
		);
		assertEquals(
			Security_Architecture.cpuSubtype(
				Security_MachOBase.architecture(macho),
			),
			3,
			tag,
		);
		assertEquals(Security_MachOBase.type(macho), 4, tag);
		assertEquals(Security_MachOBase.flags(macho), 5, tag);
		assertEquals(MachOBaseTest.headerSize(macho), header.byteLength, tag);
		assertEquals(
			Security_MachOBase.commandLength(macho),
			header.sizeofcmds,
			tag,
		);
		assertEquals(MachOBaseTest.commandSize(macho), header.sizeofcmds, tag);
		assertEquals(Security_MachOBase.loadCommands(macho), null, tag);

		MachOBaseTest.initCommands(macho, flip ? command : command.buffer);
		assertStrictEquals(
			Security_MachOBase.loadCommands(macho)!.buffer,
			command.buffer,
			tag,
		);
	}
});

Deno.test('Security_MachOBase: nextCommand valid', () => {
	const commands = new ArrayBuffer(load_command.BYTE_LENGTH * 2);

	const commandA = new load_command(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = load_command.BYTE_LENGTH;

	const commandB = new load_command(commands, load_command.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = load_command.BYTE_LENGTH;

	const header = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new Security_MachOBase();
	MachOBaseTest.initHeader(macho, header);
	MachOBaseTest.initCommands(macho, commands);

	const cmdA = Security_MachOBase.loadCommands(macho)!;
	assertEquals(cmdA.cmd, commandA.cmd);

	const cmdB = Security_MachOBase.nextCommand(macho, cmdA)!;
	assertEquals(cmdB.cmd, commandB.cmd);

	const cmdC = Security_MachOBase.nextCommand(macho, cmdB);
	assertEquals(cmdC, null);
});

Deno.test('Security_MachOBase: nextCommand zero', () => {
	const commands = new ArrayBuffer(load_command.BYTE_LENGTH * 2);

	const commandA = new load_command(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = 0;

	const commandB = new load_command(commands, load_command.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = load_command.BYTE_LENGTH;

	const header = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new Security_MachOBase();
	MachOBaseTest.initHeader(macho, header);
	MachOBaseTest.initCommands(macho, commands);

	const cmdA = Security_MachOBase.loadCommands(macho)!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrowsUnixError(
		() => Security_MachOBase.nextCommand(macho, cmdA),
		ENOEXEC,
	);
});

Deno.test('Security_MachOBase: nextCommand under', () => {
	const commands = new ArrayBuffer(load_command.BYTE_LENGTH * 2 - 1);

	const commandA = new load_command(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = load_command.BYTE_LENGTH;

	const commandB = new load_command(commands, load_command.BYTE_LENGTH);
	commandB.cmd = 2;

	const header = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new Security_MachOBase();
	MachOBaseTest.initHeader(macho, header);
	MachOBaseTest.initCommands(macho, commands);

	const cmdA = Security_MachOBase.loadCommands(macho)!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrowsUnixError(
		() => Security_MachOBase.nextCommand(macho, cmdA),
		ENOEXEC,
	);
});

Deno.test('Security_MachOBase: nextCommand over', () => {
	const commands = new ArrayBuffer(load_command.BYTE_LENGTH * 2);

	const commandA = new load_command(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = load_command.BYTE_LENGTH;

	const commandB = new load_command(commands, load_command.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = load_command.BYTE_LENGTH + 1;

	const header = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new Security_MachOBase();
	MachOBaseTest.initHeader(macho, header);
	MachOBaseTest.initCommands(macho, commands);

	const cmdA = Security_MachOBase.loadCommands(macho)!;
	assertEquals(cmdA.cmd, commandA.cmd);

	assertThrowsUnixError(
		() => Security_MachOBase.nextCommand(macho, cmdA),
		ENOEXEC,
	);
});

Deno.test('Security_MachOBase: findCommand', () => {
	const commands = new ArrayBuffer(load_command.BYTE_LENGTH * 3);

	const commandA = new load_command(commands, 0);
	commandA.cmd = 1;
	commandA.cmdsize = load_command.BYTE_LENGTH;

	const commandB = new load_command(commands, load_command.BYTE_LENGTH);
	commandB.cmd = 2;
	commandB.cmdsize = load_command.BYTE_LENGTH;

	const commandC = new load_command(commands, load_command.BYTE_LENGTH * 2);
	commandC.cmd = 2;
	commandC.cmdsize = load_command.BYTE_LENGTH;

	const header = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 3;
	header.sizeofcmds = commands.byteLength;

	const macho = new Security_MachOBase();
	MachOBaseTest.initHeader(macho, header);
	MachOBaseTest.initCommands(macho, commands);

	assertEquals(Security_MachOBase.findCommand(macho, 0), null);
	assertEquals(
		Security_MachOBase.findCommand(macho, 1)!.byteOffset,
		commandA.byteOffset,
	);
	assertEquals(
		Security_MachOBase.findCommand(macho, 2)!.byteOffset,
		commandB.byteOffset,
	);
	assertEquals(Security_MachOBase.findCommand(macho, 3), null);
});

Deno.test('Security_MachOBase: find command valid', () => {
	for (const [method, Command, CMD] of findCommands) {
		const tag = `method=${method} Command=${Command.name} CMD=${CMD}`;

		const commands = new ArrayBuffer(
			load_command.BYTE_LENGTH + Command.BYTE_LENGTH,
		);

		const commandA = new load_command(commands);
		commandA.cmdsize = load_command.BYTE_LENGTH;

		const commandB = new Command(commands, load_command.BYTE_LENGTH);
		commandB.cmdsize = Command.BYTE_LENGTH;

		const header = new mach_header(
			new ArrayBuffer(mach_header.BYTE_LENGTH),
		);
		header.magic = MH_MAGIC;
		header.ncmds = 2;
		header.sizeofcmds = commands.byteLength;

		const macho = new Security_MachOBase();
		MachOBaseTest.initHeader(macho, header);
		MachOBaseTest.initCommands(macho, commands);

		assertEquals(Security_MachOBase[method](macho), null, tag);

		commandB.cmd = CMD;

		const found = Security_MachOBase[method](macho)!;
		assertEquals(found.cmd, CMD, tag);
		assertEquals(found.byteOffset, commandB.byteOffset, tag);
	}
});

Deno.test('Security_MachOBase: find command under', () => {
	for (const [method, Command, CMD] of findCommands) {
		const tag = `method=${method} Command=${Command.name} CMD=${CMD}`;

		const commands = new ArrayBuffer(load_command.BYTE_LENGTH * 2);

		const commandA = new load_command(commands);
		commandA.cmdsize = load_command.BYTE_LENGTH;

		const commandB = new load_command(commands, load_command.BYTE_LENGTH);
		commandB.cmd = CMD;
		commandB.cmdsize = load_command.BYTE_LENGTH;

		const header = new mach_header(
			new ArrayBuffer(mach_header.BYTE_LENGTH),
		);
		header.magic = MH_MAGIC;
		header.ncmds = 2;
		header.sizeofcmds = commands.byteLength;

		const macho = new Security_MachOBase();
		MachOBaseTest.initHeader(macho, header);
		MachOBaseTest.initCommands(macho, commands);

		assertThrowsUnixError(
			() => Security_MachOBase[method](macho),
			ENOEXEC,
			tag,
		);
	}
});

Deno.test('Security_MachOBase: find version', () => {
	const p = new Uint8Ptr(new ArrayBuffer(4));

	const commands = new ArrayBuffer(
		load_command.BYTE_LENGTH +
			build_version_command.BYTE_LENGTH +
			version_min_command.BYTE_LENGTH,
	);

	const commandA = new load_command(commands);
	commandA.cmdsize = load_command.BYTE_LENGTH;

	const commandB = new build_version_command(
		commands,
		load_command.BYTE_LENGTH,
	);
	commandB.cmdsize = build_version_command.BYTE_LENGTH;

	const commandC = new version_min_command(
		commands,
		load_command.BYTE_LENGTH + build_version_command.BYTE_LENGTH,
	);
	commandC.cmdsize = version_min_command.BYTE_LENGTH;

	const header = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 3;
	header.sizeofcmds = commands.byteLength;

	const macho = new Security_MachOBase();
	MachOBaseTest.initHeader(macho, header);
	MachOBaseTest.initCommands(macho, commands);

	assertEquals(Security_MachOBase.version(macho, null, null, null), false);
	assertEquals(Security_MachOBase.platform(macho), 0);
	assertEquals(Security_MachOBase.minVersion(macho), 0);
	assertEquals(Security_MachOBase.sdkVersion(macho), 0);

	for (
		const [LC, PL] of [
			[LC_VERSION_MIN_MACOSX, PLATFORM_MACOS],
			[LC_VERSION_MIN_IPHONEOS, PLATFORM_IOS],
			[LC_VERSION_MIN_WATCHOS, PLATFORM_WATCHOS],
			[LC_VERSION_MIN_TVOS, PLATFORM_TVOS],
		] as const
	) {
		commandC.cmd = LC;
		assertEquals(Security_MachOBase.version(macho, null, null, null), true);
		assertEquals(Security_MachOBase.platform(macho), PL);

		commandC.version = 12;
		assertEquals(Security_MachOBase.minVersion(macho), 12);

		commandC.sdk = 23;
		assertEquals(Security_MachOBase.sdkVersion(macho), 23);
	}

	commandB.cmd = LC_BUILD_VERSION;
	commandB.platform = PLATFORM_MACOS;
	commandB.minos = 34;
	commandB.sdk = 45;

	assertEquals(Security_MachOBase.version(macho, null, null, null), true);
	assertEquals(Security_MachOBase.platform(macho), PLATFORM_MACOS);
	assertEquals(Security_MachOBase.minVersion(macho), 34);
	assertEquals(Security_MachOBase.sdkVersion(macho), 45);

	// Testing the default case if findMinVersion returns something not cased.
	// The default case should be unreachable.
	commandB.cmd = 0x12345678;
	p[0] = 1;
	const desc = Object.getOwnPropertyDescriptor(
		Security_MachOBase,
		'findMinVersion',
	)!;
	Object.defineProperty(Security_MachOBase, 'findMinVersion', {
		...desc,
		value: function findMinVersion(
			_this: Security_MachOBase,
		): version_min_command | null {
			return new version_min_command(
				commandB.buffer,
				commandB.byteOffset,
				commandB.littleEndian,
			);
		},
	});
	try {
		assertEquals(Security_MachOBase.platform(macho), 0);
		assertEquals(Security_MachOBase.version(macho, p, null, null), true);
		assertEquals(p[0], 0);
	} finally {
		Object.defineProperty(Security_MachOBase, 'findMinVersion', desc);
	}
});

Deno.test('Security_MachOBase: signingOffset signingLength', () => {
	const commands = new ArrayBuffer(
		load_command.BYTE_LENGTH + linkedit_data_command.BYTE_LENGTH,
	);

	const commandA = new load_command(commands);
	commandA.cmdsize = load_command.BYTE_LENGTH;

	const commandB = new linkedit_data_command(
		commands,
		load_command.BYTE_LENGTH,
	);
	commandB.cmdsize = linkedit_data_command.BYTE_LENGTH;

	const header = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH));
	header.magic = MH_MAGIC;
	header.ncmds = 2;
	header.sizeofcmds = commands.byteLength;

	const macho = new Security_MachOBase();
	MachOBaseTest.initHeader(macho, header);
	MachOBaseTest.initCommands(macho, commands);

	assertEquals(Security_MachOBase.signingOffset(macho), 0);
	assertEquals(Security_MachOBase.signingLength(macho), 0);

	commandB.cmd = LC_CODE_SIGNATURE;
	commandB.dataoff = 12;
	commandB.datasize = 34;

	assertEquals(Security_MachOBase.signingOffset(macho), 12);
	assertEquals(Security_MachOBase.signingLength(macho), 34);
});

Deno.test('Security_MachOBase: findSegment findSection', () => {
	const cstr = (s: string) => new TextEncoder().encode(`${s}\0`);

	const strSet = (ptr: Arr<number>, str: ArrayLike<number>) => {
		new Uint8Array(ptr.buffer, ptr.byteOffset).set(str);
	};

	for (
		const [MH, Mach, LC, Seg, Sec] of [
			[
				MH_MAGIC,
				mach_header,
				LC_SEGMENT,
				segment_command,
				section,
			],
			[
				MH_MAGIC_64,
				mach_header_64,
				LC_SEGMENT_64,
				segment_command_64,
				section_64,
			],
		] as const
	) {
		const tag = `Mach=${Mach.name}`;

		const commands = new ArrayBuffer(
			load_command.BYTE_LENGTH + Seg.BYTE_LENGTH + Sec.BYTE_LENGTH * 2,
		);

		const lc = new load_command(commands);
		lc.cmdsize = load_command.BYTE_LENGTH;

		const seg = new Seg(commands, load_command.BYTE_LENGTH);
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

		const macho = new Security_MachOBase();
		MachOBaseTest.initHeader(macho, header);
		MachOBaseTest.initCommands(macho, commands);

		assertEquals(
			Security_MachOBase.findSegment(macho, cstr('GROUP').buffer),
			null,
			tag,
		);
		assertEquals(
			Security_MachOBase.findSegment(macho, cstr('group'))!.byteOffset,
			seg.byteOffset,
			tag,
		);

		assertEquals(
			Security_MachOBase.findSection(macho, cstr('GROUP'), cstr('ALPHA')),
			null,
			tag,
		);
		assertEquals(
			Security_MachOBase.findSection(
				macho,
				cstr('group'),
				cstr('alpha').buffer,
			)!.byteOffset,
			secA.byteOffset,
			tag,
		);
		assertEquals(
			Security_MachOBase.findSection(
				macho,
				cstr('group'),
				cstr('beta'),
			)!.byteOffset,
			secB.byteOffset,
			tag,
		);
		assertEquals(
			Security_MachOBase.findSection(macho, cstr('group'), cstr('gamma')),
			null,
			tag,
		);

		strSet(seg.segname, cstr('0123456789abcdef').slice(0, 16));

		assertEquals(
			Security_MachOBase.findSegment(
				macho,
				cstr('0123456789abcdefg'),
			)!.byteOffset,
			seg.byteOffset,
			tag,
		);

		strSet(seg.segname, cstr('group'));
		const { cmdsize } = seg;
		seg.cmdsize = Seg.BYTE_LENGTH - 1;

		assertThrowsUnixError(
			() => Security_MachOBase.findSegment(macho, cstr('group')),
			ENOEXEC,
			tag,
		);

		seg.cmdsize = cmdsize;
		seg.nsects++;

		assertEquals(
			Security_MachOBase.findSection(macho, cstr('group'), cstr('gamma')),
			null,
			tag,
		);
	}
});

Deno.test('Security_MachOBase: string', () => {
	const cstr = new TextEncoder().encode('Some String\0');
	const data = new Uint8Array(rpath_command.BYTE_LENGTH + cstr.byteLength);

	const command = new rpath_command(data.buffer);
	command.cmdsize = data.byteLength;
	command.path.offset = rpath_command.BYTE_LENGTH;
	data.set(cstr, command.path.offset);

	const macho = new Security_MachOBase();
	const chars = Security_MachOBase.string(macho, command, command.path)!;
	const charsStr = new Uint8Array(
		chars.buffer,
		chars.byteOffset,
		cstr.byteLength,
	);

	assertEquals(charsStr, cstr);

	command.cmdsize--;

	assertEquals(Security_MachOBase.string(macho, command, command.path), null);
});

Deno.test('Security_MachOBase: fixtures', async () => {
	await tests(fixtures, async ({ kind, arch, file, archs }) => {
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const blob = new Blob([macho]);
		for (const [arc, info] of archs) {
			const tag = `${kind}: ${arch}: ${file}: ${arc}`;
			const bin = thin(macho, ...CPU_ARCHITECTURES.get(arc)!);
			const offset = bin.byteOffset;
			const length = offset ? bin.byteLength : blob.size;
			const m = offset
				// deno-lint-ignore no-await-in-loop
				? await Security_MachO.MachO(blob, offset, length)
				// deno-lint-ignore no-await-in-loop
				: await Security_MachO.MachO(blob);

			assertEquals(Security_MachO.offset(m), offset, tag);
			assertEquals(Security_MachO.size(m), length, tag);
			if (info) {
				assertEquals(Security_MachO.signingExtent(m), info.offset, tag);
			} else {
				assertEquals(Security_MachO.signingExtent(m), length, tag);
			}
			assertEquals(Security_MachO.isSuspicious(m), false, tag);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				new Uint8Array(await Security_MachO.dataAt(m, 0, 4)),
				bin.slice(0, 4),
				tag,
			);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				new Uint8Array(await Security_MachO.dataAt(m, 4, 4)),
				bin.slice(4, 8),
				tag,
			);

			assertEquals(
				// deno-lint-ignore no-await-in-loop
				(await Security_MachO.dataAt(m, 4, 0)).byteLength,
				0,
				tag,
			);

			// deno-lint-ignore no-await-in-loop
			await assertRejectsUnixError(
				() => Security_MachO.dataAt(m, blob.size - 1, 2),
				EIO,
				tag,
			);
		}
	});
});

Deno.test('Security_MachO: read under', async () => {
	let mh = new mach_header(new ArrayBuffer(mach_header.BYTE_LENGTH - 1));

	await assertRejectsUnixError(
		() => Security_MachO.MachO(new Blob([mh.buffer as ArrayBuffer])),
		ENOEXEC,
	);

	mh = new mach_header_64(new ArrayBuffer(mach_header_64.BYTE_LENGTH - 1));
	mh.magic = MH_MAGIC_64;

	await assertRejectsUnixError(
		() => Security_MachO.MachO(new Blob([mh.buffer as ArrayBuffer])),
		ENOEXEC,
	);

	mh = new mach_header_64(new ArrayBuffer(mach_header_64.BYTE_LENGTH + 1));
	mh.magic = MH_MAGIC_64;
	mh.ncmds = 1;
	mh.sizeofcmds = 2;

	await assertRejectsUnixError(
		() => Security_MachO.MachO(new Blob([mh.buffer as ArrayBuffer])),
		ENOEXEC,
	);
});

Deno.test('Security_MachO: validateStructure LC_SYMTAB', async () => {
	const extra = 0xff;
	const buffer = new ArrayBuffer(
		mach_header.BYTE_LENGTH + symtab_command.BYTE_LENGTH + extra,
	);

	const mh = new mach_header(buffer, 0, false);
	mh.magic = MH_MAGIC;
	mh.ncmds = 1;
	mh.sizeofcmds = symtab_command.BYTE_LENGTH;

	const cmd = new symtab_command(buffer, mach_header.BYTE_LENGTH, false);
	cmd.cmd = LC_SYMTAB;
	cmd.cmdsize = symtab_command.BYTE_LENGTH;
	cmd.stroff = mach_header.BYTE_LENGTH + symtab_command.BYTE_LENGTH;
	cmd.strsize = extra;

	{
		const macho = await Security_MachO.MachO(new Blob([buffer]));
		assertEquals(Security_MachO.isSuspicious(macho), false);
	}

	{
		const macho = await Security_MachO.MachO(
			new Blob([buffer, new ArrayBuffer(1)]),
		);
		assertEquals(Security_MachO.isSuspicious(macho), true);
	}

	{
		const macho = await Security_MachO.MachO(
			new Blob([buffer.slice(0, buffer.byteLength - 1)]),
		);
		assertEquals(Security_MachO.isSuspicious(macho), true);
	}
});

Deno.test('Security_MachO: validateStructure bad command size', async () => {
	for (
		const [LC, Command, MH, Header] of [
			[LC_SEGMENT, segment_command, MH_MAGIC, mach_header],
			[LC_SEGMENT_64, segment_command_64, MH_MAGIC_64, mach_header_64],
			[LC_SYMTAB, symtab_command, MH_MAGIC, mach_header],
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
		await assertRejectsUnixError(
			() => Security_MachO.MachO(new Blob([buffer])),
			ENOEXEC,
			tag,
		);
	}
});

Deno.test('Security_MachOImage: constructor', () => {
	const buffer = new ArrayBuffer(
		mach_header.BYTE_LENGTH + load_command.BYTE_LENGTH,
	);
	const header = new mach_header(buffer);
	header.magic = MH_MAGIC;
	header.ncmds = 1;
	header.sizeofcmds = load_command.BYTE_LENGTH;

	{
		const macho = new Security_MachOImage(buffer);
		const address = Security_MachOImage.address(macho);
		assertEquals(address.byteOffset, 0);
		assertStrictEquals(address.buffer, buffer);
	}

	{
		const data = new Uint8Array(buffer.byteLength + 2);
		data.subarray(1).set(new Uint8Array(buffer));
		const macho = new Security_MachOImage(data.subarray(1));
		const address = Security_MachOImage.address(macho);
		assertEquals(address.byteOffset, 1);
		assertStrictEquals(address.buffer, data.buffer);
	}
});

Deno.test(`Universal: fixtures`, async () => {
	await tests(fixtures, async ({ kind, arch, file, archs }) => {
		const tag = `${kind}: ${arch}: ${file}`;
		const [macho] = await fixtureMacho(kind, arch, [file]);
		const blob = new Blob([macho]);
		const uni = await Security_Universal.Universal(blob);
		assertEquals(Security_Universal.offset(uni), 0, tag);
		assertEquals(Security_Universal.size(uni), 0, tag);
		assertEquals(Security_Universal.narrowed(uni), false, tag);
		assertEquals(Security_Universal.isUniversal(uni), archs.size > 1, tag);
		assertEquals(Security_Universal.isSuspicious(uni), false, tag);

		const architectures = new Set<Security_Architecture>();
		Security_Universal.architectures(uni, architectures);
		assertEquals(architectures.size, archs.size, tag);
		Security_Universal.architectures(uni, architectures);
		assertEquals(architectures.size, archs.size, tag);

		for (const a of architectures) {
			const offset = Security_Universal.archOffset(uni, a);
			const length = Security_Universal.archLength(uni, a);
			if (Security_Universal.isUniversal(uni)) {
				assertGreater(offset, 0, tag);
				assertLess(length, blob.size, tag);
				assertLessOrEqual(offset + length, blob.size, tag);
				assertEquals(
					Security_Universal.lengthOfSlice(uni, offset),
					length,
					tag,
				);
			} else {
				assertEquals(offset, 0, tag);
				assertEquals(length, blob.size, tag);
			}

			// deno-lint-ignore no-await-in-loop
			const ma = await Security_Universal.architecture(uni, a);
			assertEquals(Security_MachO.offset(ma), offset, tag);

			// deno-lint-ignore no-await-in-loop
			const mo = await Security_Universal.architecture(uni, offset);
			assertEquals(Security_MachO.offset(mo), offset, tag);
		}

		assertThrowsUnixError(
			() =>
				Security_Universal.archOffset(uni, new Security_Architecture()),
			ENOEXEC,
			tag,
		);
		assertThrowsUnixError(
			() =>
				Security_Universal.archLength(uni, new Security_Architecture()),
			ENOEXEC,
			tag,
		);
		assertThrowsMacOSError(
			() => Security_Universal.lengthOfSlice(uni, 0),
			errSecInternalError,
			tag,
		);
		await assertRejectsUnixError(
			() =>
				Security_Universal.architecture(
					uni,
					new Security_Architecture(),
				),
			ENOEXEC,
			tag,
		);
		if (Security_Universal.isUniversal(uni)) {
			await assertRejectsMacOSError(
				() => Security_Universal.architecture(uni, 1),
				errSecInternalError,
				tag,
			);
		} else {
			await assertRejectsUnixError(
				() => Security_Universal.architecture(uni, 1),
				ENOEXEC,
				tag,
			);
		}

		if (/\.dylib$|\.framework\//i.test(file)) {
			assertEquals(await Security_Universal.typeOf(blob), MH_DYLIB, tag);
		} else {
			assertEquals(
				await Security_Universal.typeOf(blob),
				MH_EXECUTE,
				tag,
			);
		}
	});
});

Deno.test('Security_Universal: open under header', async () => {
	const blob = new Blob([new ArrayBuffer(3)]);
	await assertRejectsUnixError(
		() => Security_Universal.Universal(blob),
		ENOEXEC,
	);
});

Deno.test('Security_Universal: open unknown magic', async () => {
	const data = new ArrayBuffer(
		Math.max(fat_header.BYTE_LENGTH, mach_header.BYTE_LENGTH),
	);
	const blob = new Blob([data]);
	await assertRejectsUnixError(
		() => Security_Universal.Universal(blob),
		ENOEXEC,
	);
});

Deno.test('Security_Universal: open too many arch', async () => {
	const data = new ArrayBuffer(
		Math.max(fat_header.BYTE_LENGTH, mach_header.BYTE_LENGTH),
	);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = Security_MAX_ARCH_COUNT + 1;
	const blob = new Blob([data]);
	await assertRejectsUnixError(
		() => Security_Universal.Universal(blob),
		ENOEXEC,
	);
});

Deno.test('Security_Universal: open under arch', async () => {
	const data = new ArrayBuffer(
		Math.max(fat_header.BYTE_LENGTH, mach_header.BYTE_LENGTH),
	);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 1;
	const blob = new Blob([data]);
	await assertRejectsUnixError(
		() => Security_Universal.Universal(blob),
		ENOEXEC,
	);
});

Deno.test('Security_Universal: open under count archs', async () => {
	const data = new ArrayBuffer(
		Math.max(fat_header.BYTE_LENGTH, mach_header.BYTE_LENGTH) +
			fat_arch.BYTE_LENGTH * 2 + 512,
	);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 1;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.cputype = CPU_TYPE_ARM;
	arch1.offset = data.byteLength - 512;
	arch1.size = 0;

	const arch2 = new fat_arch(data, arch1.byteOffset + arch1.byteLength);
	arch2.cputype = CPU_ARCH_ABI64 | CPU_TYPE_ARM;
	arch2.offset = data.byteLength - 256;
	arch2.size = 0;

	const uni = await Security_Universal.Universal(new Blob([data]));
	const archs = new Set<Security_Architecture>();
	Security_Universal.architectures(uni, archs);
	assertEquals(archs.size, 2);
});

Deno.test('Security_Universal: open duplicate offset', async () => {
	const data = new ArrayBuffer(
		Math.max(fat_header.BYTE_LENGTH, mach_header.BYTE_LENGTH) +
			fat_arch.BYTE_LENGTH * 2,
	);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = data.byteLength;
	arch1.size = 0;

	const arch2 = new fat_arch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = data.byteLength;
	arch2.size = 0;

	const blob = new Blob([data]);
	await assertRejectsMacOSError(
		() => Security_Universal.Universal(blob),
		errSecInternalError,
	);
});

Deno.test('Security_Universal: open suspicious gap', async () => {
	const data = new ArrayBuffer(1024);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 1;

	const arch = new fat_arch(data, header.byteLength);
	arch.offset = 512;
	arch.size = 512;

	new Uint8Array(data)[256] = 1;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(Security_Universal.isSuspicious(uni), true);
});

Deno.test('Security_Universal: open suspicious read align', async () => {
	const data = new ArrayBuffer(1024);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;

	const arch2 = new fat_arch(data, header.byteLength + arch1.byteLength);
	arch2.offset = 256 * 3;
	arch2.size = 256;
	arch2.align = 8;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(Security_Universal.isSuspicious(uni), true);
});

Deno.test('Security_Universal: open suspicious read after', async () => {
	const data = new ArrayBuffer(1024 + 1);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256 + 1;
	arch1.align = 8;

	const arch2 = new fat_arch(data, header.byteLength + arch1.byteLength);
	arch2.offset = 256 * 3;
	arch2.size = 256;
	arch2.align = 8;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(Security_Universal.isSuspicious(uni), true);
});

Deno.test('Security_Universal: open suspicious read error', async () => {
	const data = new ArrayBuffer(512 + 1);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256 + 1;
	arch1.align = 8;

	const arch2 = new fat_arch(data, header.byteLength + arch1.byteLength);
	arch2.offset = 256 * 3;
	arch2.size = 256;
	arch2.align = 8;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(Security_Universal.isSuspicious(uni), true);
});

Deno.test('Security_Universal: findArch case 1: prefer full exact match', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_ARM;
	arch1.cpusubtype = CPU_SUBTYPE_ARM_V8;

	const arch2 = new fat_arch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_V8;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(
		Security_Universal.archOffset(
			uni,
			new Security_Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('Security_Universal: findArch case 2: prefer masked subtype equal to all', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_ARM;
	arch1.cpusubtype = CPU_SUBTYPE_ARM_ALL;

	const arch2 = new fat_arch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_ARM_V8;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(
		Security_Universal.archOffset(
			uni,
			new Security_Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('Security_Universal: findArch case 3: prefer all subtype to mismatch', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_ARM;
	arch1.cpusubtype = CPU_SUBTYPE_ARM_V7;

	const arch2 = new fat_arch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_LIB64 | CPU_SUBTYPE_ARM_ALL;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(
		Security_Universal.archOffset(
			uni,
			new Security_Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('Security_Universal: findArch case 4: accept equal type as last resort', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	arch1.cputype = CPU_TYPE_X86;
	arch1.cpusubtype = CPU_SUBTYPE_X86_ALL;

	const arch2 = new fat_arch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 256 * 2;
	arch2.size = 256;
	arch2.align = 8;
	arch2.cputype = CPU_TYPE_ARM;
	arch2.cpusubtype = CPU_SUBTYPE_ARM_V7;

	const uni = await Security_Universal.Universal(new Blob([data]));
	assertEquals(
		Security_Universal.archOffset(
			uni,
			new Security_Architecture(
				CPU_TYPE_ARM,
				CPU_SUBTYPE_ARM_V8,
			),
		),
		arch2.offset,
	);
});

Deno.test('Security_Universal: make unknown type', async () => {
	const data = new ArrayBuffer(512);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 1;

	const arch = new fat_arch(data, header.byteLength);
	arch.offset = 256;
	arch.size = 256;
	arch.align = 8;

	const mach = new mach_header_64(data, 256);
	mach.magic = MH_MAGIC_64;
	mach.sizeofcmds = 8;
	const command = new load_command(data, 256 + mach.byteLength);
	command.cmdsize = 8;

	const uni = await Security_Universal.Universal(new Blob([data]));
	await assertRejectsUnixError(
		() => Security_Universal.architecture(uni, 256),
		ENOEXEC,
	);
});

Deno.test('Security_Universal: make mismatched type', async () => {
	const data = new ArrayBuffer(256 * 3);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 2;

	const arch1 = new fat_arch(data, header.byteLength);
	arch1.offset = 256;
	arch1.size = 256;
	arch1.align = 8;
	{
		const mach = new mach_header_64(data, 256);
		mach.magic = MH_MAGIC_64;
		mach.filetype = MH_EXECUTE;
		mach.sizeofcmds = 8;
		const command = new load_command(data, 256 + mach.byteLength);
		command.cmdsize = 8;
	}

	const arch2 = new fat_arch(data, arch1.byteOffset + arch1.byteLength);
	arch2.offset = 512;
	arch2.size = 512;
	arch2.align = 8;
	{
		const mach = new mach_header_64(data, 512);
		mach.magic = MH_MAGIC_64;
		mach.filetype = MH_DYLIB;
		mach.sizeofcmds = 8;
		const command = new load_command(data, 512 + mach.byteLength);
		command.cmdsize = 8;
	}

	const uni = await Security_Universal.Universal(new Blob([data]));
	await Security_Universal.architecture(uni, 256);
	await assertRejectsUnixError(
		() => Security_Universal.architecture(uni, 512),
		ENOEXEC,
	);
});

Deno.test('Security_Universal: typeOf under header', async () => {
	const blob = new Blob([new ArrayBuffer(mach_header.BYTE_LENGTH - 1)]);
	assertEquals(await Security_Universal.typeOf(blob), 0);
});

Deno.test('Security_Universal: typeOf unknown magic', async () => {
	const blob = new Blob([new ArrayBuffer(mach_header.BYTE_LENGTH)]);
	assertEquals(await Security_Universal.typeOf(blob), 0);
});

Deno.test('Security_Universal: typeOf fat arch under', async () => {
	const data = new ArrayBuffer(fat_header.BYTE_LENGTH + fat_arch.BYTE_LENGTH);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 1;
	const arch = new fat_arch(data, fat_header.BYTE_LENGTH);
	arch.offset = data.byteLength;
	const blob = new Blob([data]);
	assertEquals(await Security_Universal.typeOf(blob), 0);
});

Deno.test('Security_Universal: typeOf fat infinite loop', async () => {
	const data = new ArrayBuffer(fat_header.BYTE_LENGTH + fat_arch.BYTE_LENGTH);
	const header = new fat_header(data);
	header.magic = FAT_MAGIC;
	header.nfat_arch = 1;
	const blob = new Blob([data]);
	assertEquals(await Security_Universal.typeOf(blob), 0);
});
