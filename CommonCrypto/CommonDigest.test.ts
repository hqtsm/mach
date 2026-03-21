import {
	assertEquals,
	assertInstanceOf,
	assertRejects,
	assertStrictEquals,
} from '@std/assert';
import { crypto as stdCrypto } from '@std/crypto';
import {
	ABCD,
	BadReader,
	EMPTY,
	getCases,
	getEngines,
	getIterators,
	hashed,
	ITTER_SIZES,
	toAsyncIterator,
	toIterator,
} from '../spec/hash.ts';
import { hex } from '../spec/hex.ts';
import {
	kCCDigestMax,
	kCCDigestMD2,
	kCCDigestMD4,
	kCCDigestMD5,
	kCCDigestNone,
	kCCDigestRMD160,
	kCCDigestSHA1,
	kCCDigestSHA224,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA3_224,
	kCCDigestSHA3_256,
	kCCDigestSHA3_384,
	kCCDigestSHA3_512,
	kCCDigestSHA512,
} from './Private/CommonDigestSPI.ts';
import {
	kCCCallSequenceError,
	kCCParamError,
	kCCSuccess,
	kCCUnimplemented,
} from './CommonCryptoError.ts';
import {
	CCDigestBlockSize,
	CCDigestCreate,
	CCDigestDestroy,
	CCDigestFinal,
	CCDigestGetBlockSize,
	CCDigestGetBlockSizeFromRef,
	CCDigestGetOutputSize,
	CCDigestGetOutputSizeFromRef,
	CCDigestInit,
	CCDigestOutputSize,
	CCDigestRef,
	CCDigestReset,
	CCDigestUpdate,
} from './CommonDigest.ts';

Deno.test('CCDigestInit', () => {
	const ctx = new CCDigestRef();
	assertEquals(CCDigestInit(kCCDigestNone, ctx), kCCParamError);
	assertEquals(CCDigestInit(kCCDigestMax, ctx), kCCParamError);
	assertEquals(CCDigestInit(kCCDigestMax, null), kCCParamError);

	assertEquals(CCDigestInit(kCCDigestSHA1, ctx), kCCSuccess);
	assertEquals(CCDigestInit(kCCDigestSHA256, ctx), kCCSuccess);
	assertEquals(CCDigestInit(kCCDigestSHA384, ctx), kCCSuccess);
	assertEquals(CCDigestInit(kCCDigestSHA512, ctx), kCCSuccess);

	assertEquals(CCDigestInit(kCCDigestMD2, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestMD4, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestMD5, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestRMD160, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA224, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA3_224, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA3_256, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA3_384, ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA3_512, ctx), kCCUnimplemented);
});

Deno.test('CCDigestUpdate', async () => {
	const ctx = new CCDigestRef();
	assertEquals(await CCDigestUpdate(null, new ArrayBuffer(0)), kCCParamError);
	assertEquals(await CCDigestUpdate(ctx, null, 1), kCCParamError);
	assertEquals(
		await CCDigestUpdate(ctx, new ArrayBuffer(1)),
		kCCUnimplemented,
	);
	assertEquals(await CCDigestUpdate(ctx, null, 0), kCCSuccess);

	assertEquals(
		await CCDigestUpdate(ctx, new ArrayBuffer(0)),
		kCCCallSequenceError,
	);
	assertEquals(
		await CCDigestFinal(ctx, new ArrayBuffer(0)),
		kCCUnimplemented,
	);
});

Deno.test('CCDigestUpdate: ArrayBuffer', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const ctx = CCDigestCreate(alg)!;
		ctx.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await CCDigestUpdate(ctx, data);
		const digest = new ArrayBuffer(size);
		// deno-lint-ignore no-await-in-loop
		await CCDigestFinal(ctx, digest);
		assertEquals(hex(new Uint8Array(digest)), output, tag);
	}
});

Deno.test('CCDigestUpdate: Uint8Array<ArrayBuffer>', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const ctx = CCDigestCreate(alg)!;
		ctx.crypto = crypto;
		const d = new Uint8Array(data.byteLength + 4);
		d.set(new Uint8Array(data), 2);
		// deno-lint-ignore no-await-in-loop
		await CCDigestUpdate(ctx, new Uint8Array(d.buffer, 2, data.byteLength));
		const digest = new Uint8Array(size + 4);
		// deno-lint-ignore no-await-in-loop
		await CCDigestFinal(ctx, digest.subarray(2));
		assertEquals(hex(digest.subarray(2, -2)), output, tag);
	}
});

Deno.test('CCDigestUpdate: Blob', async () => {
	for (const { tag, alg, crypto, output, size, data } of getCases()) {
		const ctx = CCDigestCreate(alg)!;
		ctx.crypto = crypto;
		const blob = new Blob([data]);
		// deno-lint-ignore no-await-in-loop
		await CCDigestUpdate(ctx, blob);
		const digest = new Uint8Array(size);
		// deno-lint-ignore no-await-in-loop
		await CCDigestFinal(ctx, digest);
		assertEquals(hex(digest), output, tag);
	}
});

Deno.test('CCDigestUpdate: Blob over-read', async () => {
	const reader = new BadReader(1024);
	reader.diff = 1;

	const engines = getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const ctx = CCDigestCreate(kCCDigestSHA1)!;
		ctx.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => CCDigestUpdate(ctx, reader),
			RangeError,
			'Read size off by: 1',
			tag,
		);
	}
});

Deno.test('CCDigestUpdate: Blob under-read', async () => {
	const reader = new BadReader(1024);
	reader.diff = -1;

	const engines = getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const ctx = CCDigestCreate(kCCDigestSHA1)!;
		ctx.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => CCDigestUpdate(ctx, reader),
			RangeError,
			'Read size off by: -1',
			tag,
		);
	}
});

Deno.test('CCDigestUpdate: Iterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const ctx = CCDigestCreate(alg)!;
			ctx.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await CCDigestUpdate(
				ctx,
				toIterator(data, {
					page,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			const digest = new Uint8Array(size);
			// deno-lint-ignore no-await-in-loop
			await CCDigestFinal(ctx, digest);
			assertEquals(hex(digest), output, tags);
		}
	}
});

Deno.test('CCDigestUpdate: Iterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const ctx = CCDigestCreate(alg)!;
			ctx.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await CCDigestUpdate(
				ctx,
				toIterator(data, {
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			const digest = new Uint8Array(size);
			// deno-lint-ignore no-await-in-loop
			await CCDigestFinal(ctx, digest);
			assertEquals(hex(digest), output, tags);
		}
	}
});

Deno.test('CCDigestUpdate: AsyncIterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const ctx = CCDigestCreate(alg)!;
			ctx.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await CCDigestUpdate(
				ctx,
				toAsyncIterator(data, {
					page,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			const digest = new Uint8Array(size);
			// deno-lint-ignore no-await-in-loop
			await CCDigestFinal(ctx, digest);
			assertEquals(hex(new Uint8Array(digest)), output, tags);
		}
	}
});

Deno.test('CCDigestUpdate: AsyncIterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, size, data } of getCases()) {
			const tags = `${tag} page=${page}`;
			const ctx = CCDigestCreate(alg)!;
			ctx.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await CCDigestUpdate(
				ctx,
				toAsyncIterator(data, {
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			const digest = new Uint8Array(size);
			// deno-lint-ignore no-await-in-loop
			await CCDigestFinal(ctx, digest);
			assertEquals(hex(digest), output, tags);
		}
	}
});

Deno.test('CCDigestUpdate: Iterator over-read', async () => {
	const engines = getEngines();
	for (const [name, source, size] of getIterators(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const ctx = CCDigestCreate(kCCDigestSHA1)!;
			ctx.crypto = crypto;
			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => CCDigestUpdate(ctx, source(), size - 1),
				RangeError,
				'Read size off by: 1',
				tag,
			);
		}
	}
});

Deno.test('CCDigestUpdate: Iterator under-read', async () => {
	const engines = getEngines();
	for (const [name, source, size] of getIterators(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const ctx = CCDigestCreate(kCCDigestSHA1)!;
			ctx.crypto = crypto;
			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => CCDigestUpdate(ctx, source(), size + 1),
				RangeError,
				'Read size off by: -1',
				tag,
			);
		}
	}
});

Deno.test('CCDigestFinal', async () => {
	const ctx = new CCDigestRef();
	assertEquals(await CCDigestFinal(null, null), kCCParamError);
	assertEquals(await CCDigestFinal(ctx, null), kCCParamError);
	assertEquals(await CCDigestFinal(ctx, EMPTY), kCCUnimplemented);
});

Deno.test('CCDigestGetBlockSize', () => {
	assertEquals(CCDigestGetBlockSize(kCCDigestNone), kCCUnimplemented);
	assertEquals(CCDigestGetBlockSize(kCCDigestMax), kCCUnimplemented);

	assertEquals(CCDigestGetBlockSize(kCCDigestSHA1), 64);
	assertEquals(CCDigestGetBlockSize(kCCDigestSHA256), 64);
	assertEquals(CCDigestGetBlockSize(kCCDigestSHA384), 128);
	assertEquals(CCDigestGetBlockSize(kCCDigestSHA512), 128);
});

Deno.test('CCDigestGetOutputSize', () => {
	assertEquals(CCDigestGetOutputSize(kCCDigestNone), kCCUnimplemented);
	assertEquals(CCDigestGetOutputSize(kCCDigestMax), kCCUnimplemented);

	assertEquals(CCDigestGetOutputSize(kCCDigestSHA1), 20);
	assertEquals(CCDigestGetOutputSize(kCCDigestSHA256), 32);
	assertEquals(CCDigestGetOutputSize(kCCDigestSHA384), 48);
	assertEquals(CCDigestGetOutputSize(kCCDigestSHA512), 64);
});

Deno.test('CCDigestGetBlockSizeFromRef', () => {
	const ctx = new CCDigestRef();
	assertEquals(CCDigestGetBlockSizeFromRef(ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA1, ctx), kCCSuccess);
	assertEquals(CCDigestGetBlockSizeFromRef(ctx), 64);
});

Deno.test('CCDigestBlockSize', () => {
	const ctx = new CCDigestRef();
	assertEquals(CCDigestBlockSize(ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA1, ctx), kCCSuccess);
	assertEquals(CCDigestBlockSize(ctx), 64);
});

Deno.test('CCDigestOutputSize', () => {
	const ctx = new CCDigestRef();
	assertEquals(CCDigestOutputSize(ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA1, ctx), kCCSuccess);
	assertEquals(CCDigestOutputSize(ctx), 20);
});

Deno.test('CCDigestGetOutputSizeFromRef', () => {
	const ctx = new CCDigestRef();
	assertEquals(CCDigestGetOutputSizeFromRef(ctx), kCCUnimplemented);
	assertEquals(CCDigestInit(kCCDigestSHA1, ctx), kCCSuccess);
	assertEquals(CCDigestGetOutputSizeFromRef(ctx), 20);
});

Deno.test('CCDigestCreate', () => {
	assertEquals(CCDigestCreate(kCCDigestNone), null);
	assertEquals(CCDigestCreate(kCCDigestMax), null);
	assertInstanceOf(CCDigestCreate(kCCDigestSHA1), CCDigestRef);
});

Deno.test('CCDigestReset', async () => {
	const ctx = CCDigestCreate(kCCDigestSHA1)!;

	ctx.crypto = stdCrypto.subtle;
	CCDigestReset(ctx);
	assertStrictEquals(ctx.crypto, stdCrypto.subtle);
	ctx.crypto = null;

	assertEquals(await CCDigestUpdate(ctx, EMPTY), kCCSuccess);
	assertEquals(await CCDigestUpdate(ctx, EMPTY), kCCCallSequenceError);
	CCDigestReset(ctx);
	assertEquals(await CCDigestUpdate(ctx, ABCD), kCCSuccess);
	const digest = new Uint8Array(20);
	assertEquals(await CCDigestFinal(ctx, digest), kCCSuccess);
	assertEquals(hex(digest), hashed('sha1', ABCD));
});

Deno.test('CCDigestDestroy', () => {
	const ctx = CCDigestCreate(kCCDigestSHA1)!;
	ctx.crypto = stdCrypto.subtle;
	CCDigestDestroy(ctx);
	assertStrictEquals(ctx.crypto, null);
});
