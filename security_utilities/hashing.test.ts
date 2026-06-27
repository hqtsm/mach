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
} from '../CommonCrypto/mod.ts';
import { ENOMEM } from '../libc/mod.ts';
import {
	ABCD,
	assertThrowsUnixError,
	BadReader,
	digest,
	getCases,
	getEngines,
	getIterators,
	hex,
	ITTER_SIZES,
	toAsyncIterator,
	toIterator,
} from '../spec/mod.ts';
import {
	Security_CCHashInstance,
	Security_SHA1,
	Security_SHA256,
} from './hashing.ts';

Deno.test('Security_CCHashInstance: Unsupported', () => {
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
			() => new Security_CCHashInstance(alg),
			ENOMEM,
			tag,
		);
	}
});

Deno.test('Security_CCHashInstance: ArrayBuffer', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new ArrayBuffer(size);
		const hash = new Security_CCHashInstance(alg);
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(data);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest);
		assertEquals(hex(new Uint8Array(digest)), output, tag);
	}
});

Deno.test('Security_CCHashInstance: Uint8Array<ArrayBuffer>', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size + 4);
		const hash = new Security_CCHashInstance(alg);
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

Deno.test('Security_CCHashInstance: Blob', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size);
		const hash = new Security_CCHashInstance(alg);
		hash.subtle = crypto;
		const blob = new Blob([data]);
		// deno-lint-ignore no-await-in-loop
		await hash.update(blob);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest);
		assertEquals(hex(digest), output, tag);
	}
});

Deno.test('Security_CCHashInstance: Blob over-read', async () => {
	const reader = new BadReader(1024);
	reader.diff = 1;

	const engines = getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const hash = new Security_CCHashInstance(kCCDigestSHA1);
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

Deno.test('Security_CCHashInstance: Blob under-read', async () => {
	const reader = new BadReader(1024);
	reader.diff = -1;

	const engines = getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const hash = new Security_CCHashInstance(kCCDigestSHA1);
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

Deno.test('Security_CCHashInstance: ArrayBufferPointer', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size);
		const hash = new Security_CCHashInstance(alg);
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

Deno.test('Security_CCHashInstance: Iterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new Security_CCHashInstance(alg);
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

Deno.test('Security_CCHashInstance: Iterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new Security_CCHashInstance(alg);
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

Deno.test('Security_CCHashInstance: AsyncIterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new Security_CCHashInstance(alg);
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

Deno.test('Security_CCHashInstance: AsyncIterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const digest = new Uint8Array(size);
			const hash = new Security_CCHashInstance(alg);
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

Deno.test('Security_CCHashInstance: Iterator over-read', async () => {
	const engines = getEngines();
	for (const [name, source, size] of getIterators(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const hash = new Security_CCHashInstance(kCCDigestSHA1);
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

Deno.test('Security_CCHashInstance: Iterator under-read', async () => {
	const engines = getEngines();
	for (const [name, source, size] of getIterators(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const hash = new Security_CCHashInstance(kCCDigestSHA1);
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

Deno.test('Security_CCHashInstance: truncate', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const digest = new Uint8Array(size);
		const truncate = Math.floor(output.length / 2);
		const hext = output.slice(0, truncate * 2);
		const hash = new Security_CCHashInstance(alg, truncate);
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(data);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(digest);
		assertEquals(hash.digestLength(), truncate, tag);
		assertEquals(hex(digest), hext, tag);
	}
});

Deno.test('Security_CCHashInstance: verify', async () => {
	{
		const expected = digest('sha1', ABCD);
		const hash = new Security_CCHashInstance(kCCDigestSHA1);
		await hash.update(ABCD);
		assertEquals(
			await Security_CCHashInstance.verify(hash, expected),
			true,
		);
	}
	{
		const unexpected = new ArrayBuffer(20);
		const hash = new Security_CCHashInstance(kCCDigestSHA1);
		await hash.update(ABCD);
		assertEquals(
			await Security_CCHashInstance.verify(hash, unexpected),
			false,
		);
	}
});

Deno.test('Security_SHA1: verify', async () => {
	for (const [engine, crypto] of getEngines()) {
		const expected = digest('sha1', ABCD);
		const hash = new Security_SHA1();
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(ABCD);
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await Security_SHA1.verify(hash, expected),
			true,
			engine,
		);
	}
	for (const [engine, crypto] of getEngines()) {
		const expected = digest('sha1', ABCD);
		const finish = Security_SHA1.Digest();
		const hash = new Security_SHA1();
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(ABCD);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(finish);
		assertEquals(finish, expected, engine);
	}
});

Deno.test('Security_SHA256: verify', async () => {
	for (const [engine, crypto] of getEngines()) {
		const expected = digest('sha256', ABCD);
		const hash = new Security_SHA256();
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(ABCD);
		assertEquals(
			// deno-lint-ignore no-await-in-loop
			await Security_SHA256.verify(hash, expected),
			true,
			engine,
		);
	}
	for (const [engine, crypto] of getEngines()) {
		const expected = digest('sha256', ABCD);
		const finish = Security_SHA256.Digest();
		const hash = new Security_SHA256();
		hash.subtle = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(ABCD);
		// deno-lint-ignore no-await-in-loop
		await hash.finish(finish);
		assertEquals(finish, expected, engine);
	}
});
