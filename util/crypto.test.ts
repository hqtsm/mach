// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
import { assertEquals } from '@std/assert';
import { subtleCryptoFromNodeCrypto } from './crypto.ts';

Deno.test('subtleCryptoFromNodeCrypto', async () => {
	const data = new Uint8Array(256);
	for (let i = data.length; i--;) {
		data[i] = i;
	}

	const nc = subtleCryptoFromNodeCrypto({ createHash });
	for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const) {
		// deno-lint-ignore no-await-in-loop
		const [expected, nodeAB, nodeAG] = await Promise.all([
			crypto.subtle.digest(algo, data),
			nc.digest(algo, data),
			nc.digest(
				algo,
				(async function* (): AsyncGenerator<ArrayBuffer> {
					yield data.slice(0, 128).buffer;
					yield data.slice(128).buffer;
				})(),
			),
		]);

		const expect = new Uint8Array(expected);
		assertEquals(new Uint8Array(nodeAB), expect, algo);
		assertEquals(new Uint8Array(nodeAG), expect, algo);
	}
});
