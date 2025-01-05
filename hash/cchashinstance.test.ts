import { assertEquals, assertRejects, assertThrows } from '@std/assert';
import {
	kCCDigestMD2,
	kCCDigestMD4,
	kCCDigestMD5,
	kCCDigestNone,
	kCCDigestRMD128,
	kCCDigestRMD160,
	kCCDigestRMD256,
	kCCDigestRMD320,
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
	kCCDigestSkein128,
	kCCDigestSkein160,
	kCCDigestSkein224,
	kCCDigestSkein256,
	kCCDigestSkein384,
	kCCDigestSkein512,
} from '../const.ts';
import { hex } from '../spec/hex.ts';
import { CCHashInstance } from './cchashinstance.ts';

// 'ABCD':
const expected = [
	[
		kCCDigestSHA1,
		'fb2f85c88567f3c8ce9b799c7c54642d0c7b41f6',
	],
	[
		kCCDigestSHA256,
		'e12e115acf4552b2568b55e93cbd39394c4ef81c82447fafc997882a02d23677',
	],
	[
		kCCDigestSHA384,
		'6f17e23899d2345a156baf69e7c02bbdda3be057367849c0' +
		'2add6a4aecbbd039a660ba815c95f2f145883600b7e9133d',
	],
	[
		kCCDigestSHA512,
		'49ec55bd83fcd67838e3d385ce831669e3f815a7f44b7aa5f8d52b5d42354c46' +
		'd89c8b9d06e47a797ae4fbd22291be15bcc35b07735c4a6f92357f93d5a33d9b',
	],
] as const;

const unsupported = [
	kCCDigestNone,
	kCCDigestMD2,
	kCCDigestMD4,
	kCCDigestMD5,
	kCCDigestRMD128,
	kCCDigestRMD160,
	kCCDigestRMD256,
	kCCDigestRMD320,
	kCCDigestSkein128,
	kCCDigestSkein160,
	kCCDigestSkein224,
	kCCDigestSkein256,
	kCCDigestSkein384,
	kCCDigestSkein512,
];

Deno.test('CCHashInstance full', async () => {
	for (const [alg, expt] of expected) {
		const tag = `alg=${alg}`;
		const hash = new CCHashInstance(alg);
		// deno-lint-ignore no-await-in-loop
		await hash.update(new TextEncoder().encode('AB'));
		// deno-lint-ignore no-await-in-loop
		await hash.update(new TextEncoder().encode('CD'));
		// deno-lint-ignore no-await-in-loop
		const result = await hash.finish();
		assertEquals(result.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(result)), expt, tag);
	}
});

Deno.test('CCHashInstance truncate', async () => {
	const truncate = 8;
	for (const [alg, expt] of expected) {
		const tag = `alg=${alg} truncate=${truncate}`;
		const exptHex = expt.slice(0, truncate * 2);
		const hash = new CCHashInstance(alg, truncate);
		// deno-lint-ignore no-await-in-loop
		await hash.update(new TextEncoder().encode('ABCD'));
		// deno-lint-ignore no-await-in-loop
		const result = await hash.finish();
		assertEquals(result.byteLength, truncate, tag);
		assertEquals(hex(new Uint8Array(result)), exptHex, tag);
	}
});

Deno.test('CCHashInstance unsupported', () => {
	for (const alg of unsupported) {
		const tag = `alg=${alg}`;
		assertThrows(() => new CCHashInstance(alg), tag);
	}
});

Deno.test('CCHashInstance finish finished', async () => {
	const hash = new CCHashInstance(kCCDigestSHA1);
	await hash.finish();
	assertRejects(() => hash.finish());
});

Deno.test('CCHashInstance update finished', async () => {
	const hash = new CCHashInstance(kCCDigestSHA1);
	await hash.finish();
	assertRejects(() => hash.update(new Uint8Array()));
});
