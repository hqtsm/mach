import { assertEquals, assertInstanceOf } from '@std/assert';
import { PLBoolean, PLData, PLDictionary } from '@hqtsm/plist';
import { assertThrowsMacOSError } from '../spec/assert.ts';
import {
	CPU_ARCHITECTURES,
	fixtureMachos,
	type FixtureMachoSignatureInfo,
	fixtureMachoSigned,
} from '../spec/fixture.ts';
import { unhex } from '../spec/hex.ts';
import { thin } from '../spec/macho.ts';
import { testOOM } from '../spec/memory.ts';
import { Security_BlobCore, Security_BlobWrapper } from '../Security/blob.ts';
import {
	errSecCSSignatureInvalid,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureLinkerSigned,
} from '../Security/CSCommon.ts';
import {
	kSecCodeMagicEntitlement,
	kSecCodeMagicEntitlementDER,
	kSecCodeMagicLaunchConstraint,
} from '../Security/CSCommonPriv.ts';
import { Security_CodeSigning_CodeDirectory_Builder } from './cdbuilder.ts';
import {
	Security_CodeSigning_cdAlternateCodeDirectorySlots,
	Security_CodeSigning_cdCodeDirectorySlot,
	Security_CodeSigning_cdInfoSlot,
	Security_CodeSigning_cdRequirementsSlot,
	Security_CodeSigning_cdResourceDirSlot,
	Security_CodeSigning_cdSignatureSlot,
	Security_CodeSigning_CodeDirectory,
} from './codedirectory.ts';
import {
	Security_CodeSigning_Requirements,
	Security_CodeSigning_Requirements_Maker,
} from './requirement.ts';
import {
	Security_CodeSigning_DetachedSignatureBlob,
	Security_CodeSigning_EmbeddedSignatureBlob,
	Security_CodeSigning_EmbeddedSignatureBlob_Maker,
	Security_CodeSigning_EntitlementBlob,
	Security_CodeSigning_EntitlementDERBlob,
	Security_CodeSigning_LaunchConstraintBlob,
	Security_CodeSigning_LibraryDependencyBlob,
} from './sigblob.ts';

const fixtures = fixtureMachos();

const emptyRequirements = Security_CodeSigning_Requirements_Maker.make(
	new Security_CodeSigning_Requirements_Maker(),
);
const emptyRequirementsData = new Uint8Array(
	emptyRequirements.buffer,
	emptyRequirements.byteOffset,
	Security_CodeSigning_Requirements.size(emptyRequirements),
);

const filled = (buffer: ArrayBuffer) => {
	const a = new Uint8Array(buffer);
	for (let i = 0; i < a.length; i++) {
		a[i] = i;
	}
};

export async function* createCodeDirectories(
	info: Readonly<FixtureMachoSignatureInfo>,
	thin: Readonly<Uint8Array>,
	infoPlist: Readonly<Uint8Array> | null,
	codeResources: Readonly<Uint8Array> | null,
): AsyncGenerator<Security_CodeSigning_CodeDirectory> {
	const { requirements } = info;
	for (const hashType of info.hashes) {
		const identifier = new TextEncoder().encode(info.identifier);
		const teamID = new TextEncoder().encode(info.teamid);
		const builder = new Security_CodeSigning_CodeDirectory_Builder(
			hashType,
		);
		Security_CodeSigning_CodeDirectory_Builder.executable(
			builder,
			new Blob([thin.slice()]),
			info.page,
			0,
			info.offset,
		);
		Security_CodeSigning_CodeDirectory_Builder.flags(builder, info.flags);
		Security_CodeSigning_CodeDirectory_Builder.execSeg(
			builder,
			info.execsegbase,
			info.execseglimit,
			info.execsegflags,
		);
		Security_CodeSigning_CodeDirectory_Builder.identifier(
			builder,
			identifier,
		);
		Security_CodeSigning_CodeDirectory_Builder.teamID(builder, teamID);
		if (infoPlist) {
			// deno-lint-ignore no-await-in-loop
			await Security_CodeSigning_CodeDirectory_Builder.specialSlot(
				builder,
				Security_CodeSigning_cdInfoSlot,
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
				await Security_CodeSigning_CodeDirectory_Builder.specialSlot(
					builder,
					Security_CodeSigning_cdRequirementsSlot,
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
			await Security_CodeSigning_CodeDirectory_Builder.specialSlot(
				builder,
				Security_CodeSigning_cdResourceDirSlot,
				codeResources,
			);
		}

		// Offical library always minimum supports scatter.
		assertEquals(
			Math.max(
				Security_CodeSigning_CodeDirectory_Builder.minVersion(builder),
				Security_CodeSigning_CodeDirectory.supportsScatter,
			),
			info.version,
		);

		yield Security_CodeSigning_CodeDirectory_Builder.build(builder);
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

Deno.test('Security_CodeSigning_EmbeddedSignatureBlob: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_EmbeddedSignatureBlob.BYTE_LENGTH, 12);
});

Deno.test('Security_CodeSigning_EmbeddedSignatureBlob: blobData', () => {
	const source = new ArrayBuffer(16);
	filled(source);

	const blob = new Security_BlobCore(source.slice());
	Security_BlobCore.initialize(blob, 0x12345678, source.byteLength);
	const req = Security_CodeSigning_EmbeddedSignatureBlob.blobData(
		Security_CodeSigning_cdRequirementsSlot,
		blob,
	);
	assertEquals(
		new Uint8Array(req.buffer),
		new Uint8Array(blob.buffer),
	);

	const wrap = new Security_BlobWrapper(source.slice());
	Security_BlobWrapper.initializeSize(wrap, source.byteLength);
	const sig = Security_CodeSigning_EmbeddedSignatureBlob.blobData(
		Security_CodeSigning_cdSignatureSlot,
		wrap,
	);
	assertEquals(
		new Uint8Array(sig.buffer),
		new Uint8Array(wrap.buffer.slice(Security_BlobWrapper.BYTE_LENGTH)),
	);

	assertThrowsMacOSError(() => {
		Security_CodeSigning_EmbeddedSignatureBlob.blobData(
			Security_CodeSigning_cdSignatureSlot,
			blob,
		);
	}, errSecCSSignatureInvalid);
});

Deno.test('Security_CodeSigning_EmbeddedSignatureBlob: component: null', () => {
	const maker = new Security_CodeSigning_EmbeddedSignatureBlob_Maker();
	const made = Security_CodeSigning_EmbeddedSignatureBlob_Maker.make(maker);
	const component = Security_CodeSigning_EmbeddedSignatureBlob.component(
		made,
		Security_CodeSigning_cdSignatureSlot,
	);
	assertEquals(component, null);
});

Deno.test('Security_CodeSigning_EmbeddedSignatureBlob: component: data', () => {
	const source = new ArrayBuffer(16);
	filled(source);

	const maker = new Security_CodeSigning_EmbeddedSignatureBlob_Maker();
	const blob = new Security_BlobCore(source);
	Security_BlobCore.initialize(
		blob,
		Security_CodeSigning_cdRequirementsSlot,
		source.byteLength,
	);
	Security_CodeSigning_EmbeddedSignatureBlob_Maker.add(
		maker,
		Security_CodeSigning_cdRequirementsSlot,
		blob,
	);
	const made = Security_CodeSigning_EmbeddedSignatureBlob_Maker.make(maker);
	const component = Security_CodeSigning_EmbeddedSignatureBlob.component(
		made,
		Security_CodeSigning_cdRequirementsSlot,
	);
	assertInstanceOf(component, PLData);
	assertEquals(new Uint8Array(component.buffer), new Uint8Array(source));
});

Deno.test('Security_CodeSigning_EmbeddedSignatureBlob_Maker: BlobCore', () => {
	const source = new PLData(16);
	filled(source.buffer);

	const maker = new Security_CodeSigning_EmbeddedSignatureBlob_Maker();
	const blob = new Security_BlobCore(source.buffer);
	Security_BlobCore.initialize(
		blob,
		Security_CodeSigning_cdRequirementsSlot,
		source.byteLength,
	);
	Security_CodeSigning_EmbeddedSignatureBlob_Maker.component(
		maker,
		Security_CodeSigning_cdRequirementsSlot,
		source,
	);
	const made = Security_CodeSigning_EmbeddedSignatureBlob_Maker.make(maker);
	const component = Security_CodeSigning_EmbeddedSignatureBlob.component(
		made,
		Security_CodeSigning_cdRequirementsSlot,
	);
	assertInstanceOf(component, PLData);
	assertEquals(
		new Uint8Array(component.buffer),
		new Uint8Array(source.buffer),
	);
});

Deno.test('Security_CodeSigning_EmbeddedSignatureBlob_Maker: BlobWrapper', () => {
	const source = new PLData(16);
	filled(source.buffer);

	const maker = new Security_CodeSigning_EmbeddedSignatureBlob_Maker();
	Security_CodeSigning_EmbeddedSignatureBlob_Maker.component(
		maker,
		Security_CodeSigning_cdSignatureSlot,
		source,
	);
	const made = Security_CodeSigning_EmbeddedSignatureBlob_Maker.make(maker);
	const component = Security_CodeSigning_EmbeddedSignatureBlob.component(
		made,
		Security_CodeSigning_cdSignatureSlot,
	);
	assertInstanceOf(component, PLData);
	assertEquals(
		new Uint8Array(component.buffer),
		new Uint8Array(source.buffer),
	);
});

Deno.test('Security_CodeSigning_EmbeddedSignatureBlob: fixtures', async () => {
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

			let cd0: Security_CodeSigning_CodeDirectory | null = null;
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

			const maker =
				new Security_CodeSigning_EmbeddedSignatureBlob_Maker();
			Security_CodeSigning_EmbeddedSignatureBlob_Maker.add(
				maker,
				Security_CodeSigning_cdCodeDirectorySlot,
				cd0,
			);

			if (!linkerSigned) {
				let cdAlt = Security_CodeSigning_cdAlternateCodeDirectorySlots;
				for (const cd of cds) {
					Security_CodeSigning_EmbeddedSignatureBlob_Maker.add(
						maker,
						cdAlt++,
						cd,
					);
				}

				const { requirements } = info;
				switch (requirements) {
					case '': {
						// No requirements.
						break;
					}
					case 'count=0 size=12': {
						Security_CodeSigning_EmbeddedSignatureBlob_Maker.add(
							maker,
							Security_CodeSigning_cdRequirementsSlot,
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
				Security_CodeSigning_EmbeddedSignatureBlob_Maker.add(
					maker,
					Security_CodeSigning_cdSignatureSlot,
					Security_BlobWrapper.alloc(0),
				);
			} else if (cds.length) {
				throw new Error(
					message(`Alt linker code directories: ${cds.length}`),
				);
			}

			const cs = Security_CodeSigning_EmbeddedSignatureBlob_Maker.make(
				maker,
			);

			const csBuffer = new Uint8Array(
				cs.buffer,
				cs.byteOffset,
				Security_CodeSigning_EmbeddedSignatureBlob.size(cs),
			);
			const expected = new Uint8Array(
				bin.buffer,
				bin.byteOffset + info.offset,
				Security_CodeSigning_EmbeddedSignatureBlob.size(cs),
			);
			assertEquals(csBuffer, expected, message('compare'));
		}
	});
});

Deno.test('Security_CodeSigning_DetachedSignatureBlob: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_DetachedSignatureBlob.BYTE_LENGTH, 12);
});

Deno.test('Security_CodeSigning_LibraryDependencyBlob: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_LibraryDependencyBlob.BYTE_LENGTH, 12);
});

Deno.test('Security_CodeSigning_EntitlementBlob: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_EntitlementBlob.BYTE_LENGTH, 8);
});

Deno.test('Security_CodeSigning_EntitlementBlob: empty (invalid?)', () => {
	const { BYTE_LENGTH } = Security_CodeSigning_EntitlementBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const eb = new Security_CodeSigning_EntitlementBlob(buffer);
	Security_CodeSigning_EntitlementBlob.initializeSize(eb, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 71 71 00 00 00 08'),
	);
});

Deno.test('Security_CodeSigning_EntitlementBlob: entitlements', () => {
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
	const eb = new Security_CodeSigning_EntitlementBlob(
		Security_CodeSigning_EntitlementBlob.blobify(data).buffer,
	);
	new Uint8Array(eb.buffer, eb.byteOffset + eb.byteLength)
		.set(data);
	const dv = new DataView(
		eb.buffer,
		eb.byteOffset,
		Security_CodeSigning_EntitlementBlob.size(eb),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicEntitlement);
	assertEquals(
		dv.getUint32(4),
		Security_CodeSigning_EntitlementBlob.size(eb),
	);
	assertEquals(
		new Uint8Array(
			eb.buffer,
			eb.byteOffset + eb.byteLength,
			Security_CodeSigning_EntitlementBlob.size(eb) - eb.byteLength,
		),
		data,
	);

	const entitlements = Security_CodeSigning_EntitlementBlob.entitlements(eb);
	assertInstanceOf(entitlements, PLDictionary);
	const value = entitlements.toValueMap().get(
		'com.apple.security.cs.disable-library-validation',
	);
	assertInstanceOf(value, PLBoolean);
	assertEquals(value.value, true);
});

Deno.test('Security_CodeSigning_EntitlementDERBlob: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_EntitlementDERBlob.BYTE_LENGTH, 8);
});

Deno.test('Security_CodeSigning_EntitlementDERBlob: alloc', () => {
	const size = 42;
	const sized = size + Security_CodeSigning_EntitlementDERBlob.BYTE_LENGTH;
	const alloc = Security_CodeSigning_EntitlementDERBlob.alloc(size);
	assertInstanceOf(alloc, Security_CodeSigning_EntitlementDERBlob);
	assertEquals(Security_CodeSigning_EntitlementDERBlob.size(alloc), sized);
	assertEquals(
		Security_CodeSigning_EntitlementDERBlob.magic(alloc),
		Security_CodeSigning_EntitlementDERBlob.typeMagic,
	);
	assertEquals(
		Security_CodeSigning_EntitlementDERBlob.size(alloc),
		sized,
	);

	testOOM([sized], () => {
		assertEquals(Security_CodeSigning_EntitlementDERBlob.alloc(size), null);
	});
});

Deno.test('Security_CodeSigning_EntitlementDERBlob: empty (invalid?)', () => {
	const { BYTE_LENGTH } = Security_CodeSigning_EntitlementDERBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const edb = new Security_CodeSigning_EntitlementDERBlob(buffer);
	Security_CodeSigning_EntitlementDERBlob.initializeSize(edb, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 71 72 00 00 00 08'),
	);
});

Deno.test('Security_CodeSigning_EntitlementDERBlob: data', () => {
	const data = unhex('01 02 03 04 05 06 07 08 F0 F1 F2 F3 F4 F5 F6 F7');
	const edb = new Security_CodeSigning_EntitlementDERBlob(
		Security_CodeSigning_EntitlementDERBlob.blobify(data).buffer,
	);
	const dv = new DataView(
		edb.buffer,
		edb.byteOffset,
		Security_CodeSigning_EntitlementDERBlob.size(edb),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicEntitlementDER);
	assertEquals(
		dv.getUint32(4),
		Security_CodeSigning_EntitlementDERBlob.size(edb),
	);
	const ptr = Security_CodeSigning_EntitlementDERBlob.der(edb);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			Security_CodeSigning_EntitlementDERBlob.derLength(edb),
		),
		data,
	);
});

Deno.test('Security_CodeSigning_LaunchConstraintBlob: BYTE_LENGTH', () => {
	assertEquals(Security_CodeSigning_LaunchConstraintBlob.BYTE_LENGTH, 8);
});

Deno.test('Security_CodeSigning_LaunchConstraintBlob: alloc', () => {
	const size = 42;
	const sized = size + Security_CodeSigning_LaunchConstraintBlob.BYTE_LENGTH;
	const alloc = Security_CodeSigning_LaunchConstraintBlob.alloc(size);
	assertInstanceOf(alloc, Security_CodeSigning_LaunchConstraintBlob);
	assertEquals(Security_CodeSigning_LaunchConstraintBlob.size(alloc), sized);
	assertEquals(
		Security_CodeSigning_LaunchConstraintBlob.magic(alloc),
		Security_CodeSigning_LaunchConstraintBlob.typeMagic,
	);
	assertEquals(
		Security_CodeSigning_LaunchConstraintBlob.size(alloc),
		sized,
	);

	testOOM([sized], () => {
		assertEquals(
			Security_CodeSigning_LaunchConstraintBlob.alloc(size),
			null,
		);
	});
});

Deno.test('Security_CodeSigning_LaunchConstraintBlob: empty (invalid?)', () => {
	const { BYTE_LENGTH } = Security_CodeSigning_LaunchConstraintBlob;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const edb = new Security_CodeSigning_LaunchConstraintBlob(buffer);
	Security_CodeSigning_LaunchConstraintBlob.initializeSize(edb, BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 81 81 00 00 00 08'),
	);
});

Deno.test('Security_CodeSigning_LaunchConstraintBlob: data', () => {
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

	const edb = new Security_CodeSigning_LaunchConstraintBlob(
		Security_CodeSigning_LaunchConstraintBlob.blobify(der).buffer,
	);
	const dv = new DataView(
		edb.buffer,
		edb.byteOffset,
		Security_CodeSigning_LaunchConstraintBlob.size(edb),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicLaunchConstraint);
	assertEquals(
		dv.getUint32(4),
		Security_CodeSigning_LaunchConstraintBlob.size(edb),
	);
	const ptr = Security_CodeSigning_LaunchConstraintBlob.der(edb);
	assertEquals(
		new Uint8Array(
			ptr.buffer,
			ptr.byteOffset,
			Security_CodeSigning_LaunchConstraintBlob.derLength(edb),
		),
		der,
	);
});
