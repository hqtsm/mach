import { assertEquals, assertRejects } from '@std/assert';
import {
	kCCDigestMax,
	kCCDigestMD2,
	kCCDigestMD4,
	kCCDigestMD5,
	kCCDigestNone,
	kCCDigestRMD160,
	kCCDigestSHA1,
	kCCDigestSHA224,
	kCCDigestSHA3_224,
	kCCDigestSHA3_256,
	kCCDigestSHA3_384,
	kCCDigestSHA3_512,
} from '../CommonCrypto/Private/CommonDigestSPI.ts';
import { ENOMEM } from '../libc/errno.ts';
import { assertThrowsUnixError } from '../spec/assert.ts';
import { hex } from '../spec/hex.ts';
import { CCHashInstance } from './hashing.ts';
import {
	ABCD,
	BadReader,
	digest,
	getCases,
	getEngines,
	getIterators,
	ITTER_SIZES,
	toAsyncIterator,
	toIterator,
} from '../spec/hash.ts';

Deno.test('CCHashInstance: Unsupported', () => {
	for (
		const [name, alg] of Object.entries({
			kCCDigestMax,
			kCCDigestMD2,
			kCCDigestMD4,
			kCCDigestMD5,
			kCCDigestNone,
			kCCDigestRMD160,
			kCCDigestSHA224,
			kCCDigestSHA3_224,
			kCCDigestSHA3_256,
			kCCDigestSHA3_384,
			kCCDigestSHA3_512,
		})
	) {
		const tag = `alg=${name}`;
		assertThrowsUnixError(
			() => new CCHashInstance(alg),
			ENOMEM,
			tag,
		);
	}
});

Deno.test('CCHashInstance: ArrayBuffer', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new ArrayBuffer(size);
		const hash = new CCHashInstance(alg);
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(data);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest);
		assertEquals(hex(new Uint8Array(digest)), output, tag);
	}
});

Deno.test('CCHashInstance: Uint8Array<ArrayBuffer>', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size + 4);
		const hash = new CCHashInstance(alg);
		hash.subtle = crypto;
		const d = new Uint8Array(data.byteLength + 4);
		d.set(new Uint8Array(data), 2);
		// deno-lint-ignore no-await-in-loop
		await hash.update(new Uint8Array(d.buffer, 2, data.byteLength));
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest.subarray(2));
		assertEquals(hex(digest.subarray(2, -2)), output, tag);
	}
});

Deno.test('CCHashInstance: Blob', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size);
		const hash = new CCHashInstance(alg);
		hash.subtle = crypto;
		const blob = new Blob([data]);
		// deno-lint-ignore no-await-in-loop
		await hash.update(blob);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest);
		assertEquals(hex(digest), output, tag);
	}
});

Deno.test('CCHashInstance: Blob over-read', async () => {
	const reader = new BadReader(1024);
	reader.diff = 1;

	const engines = getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(reader),
			RangeError,
			'Read size off by: 1',
			tag,
		);
	}
});

Deno.test('CCHashInstance: Blob under-read', async () => {
	const reader = new BadReader(1024);
	reader.diff = -1;

	const engines = getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(reader),
			RangeError,
			'Read size off by: -1',
			tag,
		);
	}
});

Deno.test('CCHashInstance: ArrayBufferPointer', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size);
		const hash = new CCHashInstance(alg);
		hash.subtle = crypto;
		const d = new Uint8Array(data.byteLength + 4);
		d.set(new Uint8Array(data), 2);
		// deno-lint-ignore no-await-in-loop
		await hash.update(
			{
				buffer: d.buffer,
				byteOffset: 2,
			},
			data.byteLength,
		);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest);
		assertEquals(hex(digest), output, tag);
	}
});

Deno.test('CCHashInstance: Iterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new CCHashInstance(alg);
			hash.subtle = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toIterator(data, {
					page,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			await hash.finish(digest);
			assertEquals(hex(digest), output, tags);
		}
	}
});

Deno.test('CCHashInstance: Iterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new CCHashInstance(alg);
			hash.subtle = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toIterator(data, {
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			await hash.finish(digest);
			assertEquals(hex(digest), output, tags);
		}
	}
});

Deno.test('CCHashInstance: AsyncIterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new CCHashInstance(alg);
			hash.subtle = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toAsyncIterator(data, {
					page,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			await hash.finish(digest);
			assertEquals(hex(new Uint8Array(digest)), output, tags);
		}
	}
});

Deno.test('CCHashInstance: AsyncIterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new CCHashInstance(alg);
			hash.subtle = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toAsyncIterator(data, {
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			await hash.finish(digest);
			assertEquals(hex(digest), output, tags);
		}
	}
});

Deno.test('CCHashInstance: Iterator over-read', async () => {
	const engines = getEngines();
	for (const [name, source, size] of getIterators(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const hash = new CCHashInstance(kCCDigestSHA1);
			hash.subtle = crypto;
			const data = source();
			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => hash.update(data, size - 1),
				RangeError,
				'Read size off by: 1',
				tag,
			);
		}
	}
});

Deno.test('CCHashInstance: Iterator under-read', async () => {
	const engines = getEngines();
	for (const [name, source, size] of getIterators(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const hash = new CCHashInstance(kCCDigestSHA1);
			hash.subtle = crypto;
			const data = source();
			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => hash.update(data, size + 1),
				RangeError,
				'Read size off by: -1',
				tag,
			);
		}
	}
});

Deno.test('CCHashInstance: truncate', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size);
		const truncate = Math.floor(output.length / 2);
		const hext = output.slice(0, truncate * 2);
		const hash = new CCHashInstance(alg, truncate);
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(data);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest);
		assertEquals(hash.digestLength(), truncate, tag);
		assertEquals(hex(digest), hext, tag);
	}
});

Deno.test('CCHashInstance: verify', async () => {
	{
		const expected = digest('sha1', ABCD);
		const hash = new CCHashInstance(kCCDigestSHA1);
		await hash.update(ABCD);
		assertEquals(await CCHashInstance.verify(hash, expected), true);
	}
	{
		const unexpected = new ArrayBuffer(20);
		const hash = new CCHashInstance(kCCDigestSHA1);
		await hash.update(ABCD);
		assertEquals(await CCHashInstance.verify(hash, unexpected), false);
	}
});
