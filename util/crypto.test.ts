// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
import { assertEquals, assertRejects } from '@std/assert';
import { subtleNode, subtleStreaming } from '../spec/crypto.ts';
import { subtleCryptoFromNodeCrypto } from './crypto.ts';

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

Deno.test('subtleCryptoFromNodeCrypto errors', async () => {
	let writeError: Error | null = null;
	let endError: Error | null = null;

	const subtle = subtleCryptoFromNodeCrypto({
		createHash: (algo: string) => {
			const hash = createHash(algo);
			return {
				write(_: Uint8Array, cb: (err?: unknown) => void): void {
					if (writeError) {
						cb(writeError);
						return;
					}
					hash.write(data, cb);
				},
				end(cb: (err?: unknown) => void): void {
					if (endError) {
						cb(endError);
						return;
					}
					hash.end(cb);
				},
				read(): ArrayBufferView {
					return hash.read();
				},
			};
		},
	});

	endError = new Error('End fail');
	await assertRejects(
		() => subtle.digest('SHA-1', data),
		Error,
		'End fail',
	);
	await assertRejects(
		() => subtle.digest('SHA-1', dataAG()),
		Error,
		'End fail',
	);

	writeError = new Error('Write fail');
	await assertRejects(
		() => subtle.digest('SHA-1', data),
		Error,
		'Write fail',
	);
	await assertRejects(
		() => subtle.digest('SHA-1', dataAG()),
		Error,
		'Write fail',
	);
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
