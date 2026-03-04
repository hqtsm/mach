// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
import { assertEquals } from '@std/assert';
import { DigestStream } from '../spec/crypto.ts';
import type { ArrayBufferData } from './memory.ts';
import {
	type SubtleCryptoDigestAlgorithm,
	subtleCryptoFromNodeCrypto,
	subtleCryptoFromStreaming,
} from './crypto.ts';

const digests = [
	'SHA-1',
	'SHA-256',
	'SHA-384',
	'SHA-512',
] as const;

const data = new Uint8Array(256);
for (let i = data.length; i--;) {
	data[i] = i;
}
const dataAG = async function* (): AsyncGenerator<ArrayBuffer> {
	yield data.slice(0, 128).buffer;
	yield data.slice(128).buffer;
};

Deno.test('subtleCryptoFromNodeCrypto', async () => {
	const subtleEx = subtleCryptoFromNodeCrypto({
		createHash,
	});

	for (const algo of digests) {
		// deno-lint-ignore no-await-in-loop
		const [expected, nodeAB, nodeAG] = await Promise.all([
			crypto.subtle.digest(algo, data),
			subtleEx.digest(algo, data),
			subtleEx.digest(algo, dataAG()),
		]);

		const expect = new Uint8Array(expected);
		assertEquals(new Uint8Array(nodeAB), expect, algo);
		assertEquals(new Uint8Array(nodeAG), expect, algo);
	}
});

Deno.test('subtleCryptoFromStreaming', async () => {
	const subtleEx = subtleCryptoFromStreaming({
		DigestStream,

		async digest(
			algorithm: SubtleCryptoDigestAlgorithm,
			data: ArrayBufferData,
		): Promise<ArrayBuffer> {
			return await crypto.subtle.digest(algorithm, data);
		},
	});

	for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const) {
		// deno-lint-ignore no-await-in-loop
		const [expected, nodeAB, nodeAG] = await Promise.all([
			crypto.subtle.digest(algo, data),
			subtleEx.digest(algo, data),
			subtleEx.digest(algo, dataAG()),
		]);

		const expect = new Uint8Array(expected);
		assertEquals(new Uint8Array(nodeAB), expect, algo);
		assertEquals(new Uint8Array(nodeAG), expect, algo);
	}
});
