import { assertEquals, assertInstanceOf } from '@std/assert';
import { PLBoolean, PLDictionary } from '@hqtsm/plist';
import {
	CPU_ARCHITECTURES,
	fixtureMachos,
	type FixtureMachoSignatureInfo,
	fixtureMachoSigned,
} from '../../spec/fixture.ts';
import { unhex } from '../../spec/hex.ts';
import { thin } from '../../spec/macho.ts';
import { testOOM } from '../../spec/memory.ts';
import { BlobWrapper } from '../blob.ts';
import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureLinkerSigned,
} from '../CSCommon.ts';
import {
	kSecCodeMagicEntitlement,
	kSecCodeMagicEntitlementDER,
	kSecCodeMagicLaunchConstraint,
} from '../CSCommonPriv.ts';
import { CodeDirectory_Builder } from './cdbuilder.ts';
import {
	cdAlternateCodeDirectorySlots,
	cdCodeDirectorySlot,
	cdInfoSlot,
	cdRequirementsSlot,
	cdResourceDirSlot,
	cdSignatureSlot,
	CodeDirectory,
} from './codedirectory.ts';
import { Requirements, Requirements_Maker } from './requirement.ts';
import {
	DetachedSignatureBlob,
	EmbeddedSignatureBlob,
	EmbeddedSignatureBlob_Maker,
	EntitlementBlob,
	EntitlementDERBlob,
	LaunchConstraintBlob,
	LibraryDependencyBlob,
} from './sigblob.ts';

const fixtures = fixtureMachos();

const emptyRequirements = Requirements_Maker.make(new Requirements_Maker());
const emptyRequirementsData = new Uint8Array(
	emptyRequirements.buffer,
	emptyRequirements.byteOffset,
	Requirements.size(emptyRequirements),
);

export async function* createCodeDirectories(
	info: Readonly<FixtureMachoSignatureInfo>,
	thin: Readonly<Uint8Array>,
	infoPlist: Readonly<Uint8Array> | null,
	codeResources: Readonly<Uint8Array> | null,
): AsyncGenerator<CodeDirectory> {
	const { requirements } = info;
	for (const hashType of info.hashes) {
		const identifier = new TextEncoder().encode(info.identifier);
		const teamID = new TextEncoder().encode(info.teamid);
		const builder = new CodeDirectory_Builder(hashType);
		CodeDirectory_Builder.executable(
			builder,
			new Blob([thin.slice()]),
			info.page,
			0,
			info.offset,
		);
		CodeDirectory_Builder.flags(builder, info.flags);
		CodeDirectory_Builder.execSeg(
			builder,
			info.execsegbase,
			info.execseglimit,
			info.execsegflags,
		);
		CodeDirectory_Builder.identifier(builder, identifier);
		CodeDirectory_Builder.teamID(builder, teamID);
		if (infoPlist) {
			// deno-lint-ignore no-await-in-loop
			await CodeDirectory_Builder.specialSlot(
				builder,
				cdInfoSlot,
				infoPlist,
			);
		}
		switch (requirements) {
			case '': {
				// No requirements.
				break;
			}
			case 'count=0 size=12': {
				// deno-lint-ignore no-await-in-loop
				await CodeDirectory_Builder.specialSlot(
					builder,
					cdRequirementsSlot,
					emptyRequirementsData,
				);
				break;
			}
			default: {
				throw new Error(`Unknown requirements: ${requirements}`);
			}
		}
		if (codeResources) {
			// deno-lint-ignore no-await-in-loop
			await CodeDirectory_Builder.specialSlot(
				builder,
				cdResourceDirSlot,
				codeResources,
			);
		}

		// Offical library always minimum supports scatter.
		assertEquals(
			Math.max(
				CodeDirectory_Builder.minVersion(builder),
				CodeDirectory.supportsScatter,
			),
			info.version,
		);

		yield CodeDirectory_Builder.build(builder, info.version);
	}
}

async function tests<T>(
	cases: readonly T[],
	test: (value: T) => Promise<unknown>,
): Promise<void> {
	const remap = (p: Promise<unknown>) => p.then(() => null, (e) => e);
	const results = await Promise.all(cases.map(test).map(remap));
	const expected = cases.map(() => null);
	assertEquals(results, expected);
}

Deno.test('EmbeddedSignatureBlob: BYTE_LENGTH', () => {
	assertEquals(EmbeddedSignatureBlob.BYTE_LENGTH, 12);
});

Deno.test('EmbeddedSignatureBlob: fixtures', async () => {
	const signedFictures = fixtures.filter((f) =>
		[...f.archs.values()].filter(Boolean).length
	);

	await tests(signedFictures, async ({ kind, arch, file, archs }) => {
		const tag = `${kind}: ${arch}: ${file}`;
		const { macho, infoPlist, codeResources } = await fixtureMachoSigned(
			kind,
			arch,
			file,
		);

		for (const [arc, info] of archs) {
			// Skip unsigned architectures in fat binaries.
			if (!info) {
				continue;
			}

			const message = (s: string) => `${tag}: CD: ${arc}: ${s}`;
			const bin = thin(macho, ...CPU_ARCHITECTURES.get(arc)!);
			const cds = [];

			for await (
				const cd of createCodeDirectories(
					info,
					bin,
					infoPlist,
					codeResources,
				)
			) {
				cds.push(cd);
			}

			let cd0: CodeDirectory | null = null;
			for (let i = 0; i < cds.length; i++) {
				if (cds[i].hashType === kSecCodeSignatureHashSHA1) {
					[cd0] = cds.splice(i, 1);
					break;
				}
			}
			if (!cd0) {
				cd0 = cds.shift()!;
			}

			const linkerSigned = !!(
				cd0.flags & kSecCodeSignatureLinkerSigned
			);

			const maker = new EmbeddedSignatureBlob_Maker();
			EmbeddedSignatureBlob_Maker.add(maker, cdCodeDirectorySlot, cd0);

			if (!linkerSigned) {
				let cdAlt = cdAlternateCodeDirectorySlots;
				for (const cd of cds) {
					EmbeddedSignatureBlob_Maker.add(maker, cdAlt++, cd);
				}

				const { requirements } = info;
				switch (requirements) {
					case '': {
						// No requirements.
						break;
					}
					case 'count=0 size=12': {
						EmbeddedSignatureBlob_Maker.add(
							maker,
							cdRequirementsSlot,
							emptyRequirements,
						);
						break;
					}
					default: {
						throw new Error(
							message(`Unknown requirements: ${requirements}`),
						);
					}
				}

				// Empty signature.
				EmbeddedSignatureBlob_Maker.add(
					maker,
					cdSignatureSlot,
					BlobWrapper.alloc(0),
				);
			} else if (cds.length) {
				throw new Error(
					message(`Alt linker code directories: ${cds.length}`),
				);
			}

			const cs = EmbeddedSignatureBlob_Maker.make(maker);

			const csBuffer = new Uint8Array(
				cs.buffer,
				cs.byteOffset,
				EmbeddedSignatureBlob.size(cs),
			);
			const expected = new Uint8Array(
				bin.buffer,
				bin.byteOffset + info.offset,
				EmbeddedSignatureBlob.size(cs),
			);
			assertEquals(csBuffer, expected, message('compare'));
		}
	});
});

Deno.test('DetachedSignatureBlob: BYTE_LENGTH', () => {
	assertEquals(DetachedSignatureBlob.BYTE_LENGTH, 12);
});

Deno.test('LibraryDependencyBlob: BYTE_LENGTH', () => {
	assertEquals(LibraryDependencyBlob.BYTE_LENGTH, 12);
});

Deno.test('EntitlementBlob: BYTE_LENGTH', () => {
	assertEquals(EntitlementBlob.BYTE_LENGTH, 8);
});

Deno.test('EntitlementBlob: empty (invalid?)', () => {
	const { BYTE_LENGTH } = EntitlementBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const eb = new EntitlementBlob(buffer);
	EntitlementBlob.initializeSize(eb, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 71 71 00 00 00 08'),
	);
});

Deno.test('EntitlementBlob: entitlements', () => {
	const plist = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
		'<plist version="1.0">',
		'  <dict>',
		'    <key>com.apple.security.cs.disable-library-validation</key>',
		'    <true/>',
		'  </dict>',
		'</plist>',
		'',
	].join('\n');
	const data = new TextEncoder().encode(plist);
	const eb = new EntitlementBlob(EntitlementBlob.blobify(data));
	new Uint8Array(eb.buffer, eb.byteOffset + eb.byteLength)
		.set(data);
	const dv = new DataView(
		eb.buffer,
		eb.byteOffset,
		EntitlementBlob.size(eb),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicEntitlement);
	assertEquals(dv.getUint32(4), EntitlementBlob.size(eb));
	assertEquals(
		new Uint8Array(
			eb.buffer,
			eb.byteOffset + eb.byteLength,
			EntitlementBlob.size(eb) - eb.byteLength,
		),
		data,
	);

	const entitlements = EntitlementBlob.entitlements(eb);
	assertInstanceOf(entitlements, PLDictionary);
	const value = entitlements.toValueMap().get(
		'com.apple.security.cs.disable-library-validation',
	);
	assertInstanceOf(value, PLBoolean);
	assertEquals(value.value, true);
});

Deno.test('EntitlementDERBlob: BYTE_LENGTH', () => {
	assertEquals(EntitlementDERBlob.BYTE_LENGTH, 8);
});

Deno.test('EntitlementDERBlob: alloc', () => {
	const size = 42;
	const sized = size + EntitlementDERBlob.BYTE_LENGTH;
	const alloc = EntitlementDERBlob.alloc(size);
	assertInstanceOf(alloc, EntitlementDERBlob);
	assertEquals(EntitlementDERBlob.size(alloc), sized);
	assertEquals(
		EntitlementDERBlob.magic(alloc),
		EntitlementDERBlob.typeMagic,
	);
	assertEquals(
		EntitlementDERBlob.size(alloc),
		sized,
	);

	testOOM([sized], () => {
		assertEquals(EntitlementDERBlob.alloc(size), null);
	});
});

Deno.test('EntitlementDERBlob: empty (invalid?)', () => {
	const { BYTE_LENGTH } = EntitlementDERBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const edb = new EntitlementDERBlob(buffer);
	EntitlementDERBlob.initializeSize(edb, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 71 72 00 00 00 08'),
	);
});

Deno.test('EntitlementDERBlob: data', () => {
	const data = unhex('01 02 03 04 05 06 07 08 F0 F1 F2 F3 F4 F5 F6 F7');
	const edb = new EntitlementDERBlob(EntitlementDERBlob.blobify(data));
	const dv = new DataView(
		edb.buffer,
		edb.byteOffset,
		EntitlementDERBlob.size(edb),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicEntitlementDER);
	assertEquals(dv.getUint32(4), EntitlementDERBlob.size(edb));
	const ptr = EntitlementDERBlob.der(edb);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			EntitlementDERBlob.derLength(edb),
		),
		data,
	);
});

Deno.test('LaunchConstraintBlob: BYTE_LENGTH', () => {
	assertEquals(LaunchConstraintBlob.BYTE_LENGTH, 8);
});

Deno.test('LaunchConstraintBlob: alloc', () => {
	const size = 42;
	const sized = size + LaunchConstraintBlob.BYTE_LENGTH;
	const alloc = LaunchConstraintBlob.alloc(size);
	assertInstanceOf(alloc, LaunchConstraintBlob);
	assertEquals(LaunchConstraintBlob.size(alloc), sized);
	assertEquals(
		LaunchConstraintBlob.magic(alloc),
		LaunchConstraintBlob.typeMagic,
	);
	assertEquals(
		LaunchConstraintBlob.size(alloc),
		sized,
	);

	testOOM([sized], () => {
		assertEquals(LaunchConstraintBlob.alloc(size), null);
	});
});

Deno.test('LaunchConstraintBlob: empty (invalid?)', () => {
	const { BYTE_LENGTH } = LaunchConstraintBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const edb = new LaunchConstraintBlob(buffer);
	LaunchConstraintBlob.initializeSize(edb, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 81 81 00 00 00 08'),
	);
});

Deno.test('LaunchConstraintBlob: data', () => {
	/*
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>signing-identifier</key>
	<string>com.example.apple-samplecode.constraining-a-tools-launch-environment</string>
	<key>team-identifier</key>
	<string>B97A5CM278</string>
</dict>
</plist>
	*/
	const der = unhex(
		'70 81 AD 02 01 01 B0 81 A7 30 09 0C 04 63 63 61',
		'74 02 01 00 30 09 0C 04 63 6F 6D 70 02 01 01 30',
		'81 83 0C 04 72 65 71 73 B0 7B 30 5A 0C 12 73 69',
		'67 6E 69 6E 67 2D 69 64 65 6E 74 69 66 69 65 72',
		'0C 44 63 6F 6D 2E 65 78 61 6D 70 6C 65 2E 61 70',
		'70 6C 65 2D 73 61 6D 70 6C 65 63 6F 64 65 2E 63',
		'6F 6E 73 74 72 61 69 6E 69 6E 67 2D 61 2D 74 6F',
		'6F 6C 73 2D 6C 61 75 6E 63 68 2D 65 6E 76 69 72',
		'6F 6E 6D 65 6E 74 30 1D 0C 0F 74 65 61 6D 2D 69',
		'64 65 6E 74 69 66 69 65 72 0C 0A 42 39 37 41 35',
		'43 4D 32 37 38 30 09 0C 04 76 65 72 73 02 01 01',
	);

	const edb = new LaunchConstraintBlob(
		LaunchConstraintBlob.blobify(der),
	);
	const dv = new DataView(
		edb.buffer,
		edb.byteOffset,
		LaunchConstraintBlob.size(edb),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicLaunchConstraint);
	assertEquals(dv.getUint32(4), LaunchConstraintBlob.size(edb));
	const ptr = LaunchConstraintBlob.der(edb);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			LaunchConstraintBlob.derLength(edb),
		),
		der,
	);
});
