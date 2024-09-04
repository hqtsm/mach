import {describe, it} from 'node:test';

import {
	fixtureMacho,
	chunkedHashes,
	machoArch,
	dataContains
} from '../util.spec.ts';
import {CodeDirectory} from './codedirectory.ts';
import {
	CPU_TYPE_ARM64,
	kSecCodeExecSegMainBinary,
	kSecCodeSignatureAdhoc,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureLinkerSigned
} from '../const.ts';
import {ok} from 'node:assert';

// eslint-disable-next-line no-bitwise
const flagsLinker = kSecCodeSignatureAdhoc | kSecCodeSignatureLinkerSigned;

async function addCodeHashes(
	cd: CodeDirectory,
	macho: Readonly<Uint8Array>,
	algo: string
) {
	const {pageSize} = cd;
	const hashes = await chunkedHashes(
		algo,
		macho,
		pageSize ? Math.pow(2, pageSize) : 0,
		0,
		cd.codeLimit
	);
	for (let i = hashes.length; i--; ) {
		cd.setSlot(i, false, hashes[i]);
	}
}

void describe('blob/codedirectory', () => {
	void describe('CodeDirectory', () => {
		void describe('fixtures', () => {
			void it('cli arm64 a', async () => {
				const [main] = await fixtureMacho('cli', 'arm64', ['a/main']);
				const arch = machoArch(main, CPU_TYPE_ARM64);

				const cd = new CodeDirectory();
				cd.version = CodeDirectory.supportsExecSegment;
				cd.flags = flagsLinker;
				cd.codeLimit = 0xc140;
				cd.hashType = kSecCodeSignatureHashSHA256;
				cd.pageSize = 0xc;
				cd.execSegLimit = 0x4000n;
				cd.execSegFlags = BigInt(kSecCodeExecSegMainBinary);
				cd.identifier = 'main';
				await addCodeHashes(cd, arch, 'SHA-256');

				const data = Buffer.alloc(cd.byteLength);
				cd.byteWrite(data);

				ok(dataContains(arch, data));
			});

			void it('cli x86_64-arm64 a', async () => {
				const [main] = await fixtureMacho('cli', 'x86_64-arm64', [
					'a/main'
				]);
				const arch = machoArch(main, CPU_TYPE_ARM64);

				const cd = new CodeDirectory();
				cd.version = CodeDirectory.supportsExecSegment;
				cd.flags = flagsLinker;
				cd.codeLimit = 0xc140;
				cd.hashType = kSecCodeSignatureHashSHA256;
				cd.pageSize = 0xc;
				cd.execSegLimit = 0x4000n;
				cd.execSegFlags = BigInt(kSecCodeExecSegMainBinary);
				cd.identifier = 'main-80d268.out';
				await addCodeHashes(cd, arch, 'SHA-256');

				const data = Buffer.alloc(cd.byteLength);
				cd.byteWrite(data);

				ok(dataContains(arch, data));
			});
		});
	});
});
