import { assertEquals } from '@std/assert';
import { subtleNode, subtleStreaming } from '../spec/crypto.ts';

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
	for (const algo of digests) {
		// deno-lint-ignore no-await-in-loop
		const [expected, nodeAB, nodeAG] = await Promise.all([
			crypto.subtle.digest(algo, data),
			subtleNode.digest(algo, data),
			subtleNode.digest(algo, dataAG()),
		]);

		const expect = new Uint8Array(expected);
		assertEquals(new Uint8Array(nodeAB), expect, algo);
		assertEquals(new Uint8Array(nodeAG), expect, algo);
	}
});

Deno.test('subtleCryptoFromStreaming', async () => {
	for (const algo of digests) {
		// deno-lint-ignore no-await-in-loop
		const [expected, nodeAB, nodeAG] = await Promise.all([
			crypto.subtle.digest(algo, data),
			subtleStreaming.digest(algo, data),
			subtleStreaming.digest(algo, dataAG()),
		]);

		const expect = new Uint8Array(expected);
		assertEquals(new Uint8Array(nodeAB), expect, algo);
		assertEquals(new Uint8Array(nodeAG), expect, algo);
	}
});
