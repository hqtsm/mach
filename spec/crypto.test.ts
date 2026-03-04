import { assertEquals } from '@std/assert';
import { DigestStream } from '../spec/crypto.ts';

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

Deno.test('DigestStream hashes', async () => {
	for (const algo of digests) {
		// deno-lint-ignore no-await-in-loop
		const expected = await crypto.subtle.digest(algo, data);
		let digested = false;
		const stream = new DigestStream(algo);
		stream.digest.finally(() => {
			digested = true;
		});

		const writer = stream.getWriter();
		for await (const part of dataAG()) {
			assertEquals(digested, false);
			await writer.write(part);
			assertEquals(digested, false);
		}
		assertEquals(digested, false);
		// deno-lint-ignore no-await-in-loop
		await writer.close();

		// deno-lint-ignore no-await-in-loop
		const actual = await stream.digest;
		assertEquals(digested, true);
		assertEquals(new Uint8Array(actual), new Uint8Array(expected), algo);
	}
});
