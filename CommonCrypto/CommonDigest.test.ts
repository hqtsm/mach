// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
import {
	assertEquals,
	assertInstanceOf,
	assertRejects,
	assertStrictEquals,
} from '@std/assert';
import { crypto as stdCrypto } from '@std/crypto';
import { PAGE_SIZE_ARM64 as PAGE_SIZE } from '../mach/vm_param.ts';
import { subtleNode, subtleStreaming } from '../spec/crypto.ts';
import { hex } from '../spec/hex.ts';
import type {
	SubtleCrypto,
	SubtleCryptoDigestAlgorithm,
	SubtleCryptoExtended,
} from '../util/crypto.ts';
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import type { ArrayBufferData, ArrayBufferLikeData } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
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

type HashCrypto = SubtleCrypto | SubtleCryptoExtended;

class BadReader implements Reader {
	#size: number;

	#type: string;

	#diff: number;

	constructor(size: number, type: string = '') {
		this.#size = size;
		this.#type = type;
		this.#diff = 0;
	}

	public get size(): number {
		return this.#size;
	}

	public get type(): string {
		return this.#type;
	}

	public set diff(diff: number) {
		this.#diff = diff;
	}

	public get diff(): number {
		return this.#diff;
	}

	public slice(start?: number, end?: number, contentType?: string): Reader {
		start ??= 0;
		end ??= this.#size;
		const r = new BadReader(start < end ? end - start : 0, contentType);
		r.#diff = this.#diff;
		return r;
	}

	// deno-lint-ignore require-await
	public async arrayBuffer(): Promise<ArrayBuffer> {
		return new ArrayBuffer(this.#size - this.#diff);
	}
}

interface IteratorInfo {
	page?: number;
	transform?: (data: ArrayBuffer) => ArrayBufferLikeData;
	returns?: (() => unknown) | null;
}

function toIterator(
	data: ArrayBuffer,
	{ page, transform, returns }: IteratorInfo = {},
): SizeIterator<ArrayBufferData> {
	const r = (function* (): SizeIterator<ArrayBufferData> {
		const size = data.byteLength;
		let ask = page ? page : (
			yield (transform
				? transform(new ArrayBuffer(0))
				: new ArrayBuffer(0))
		);
		for (let i = 0; i < size;) {
			const ps = page || ask || PAGE_SIZE;
			const d = data.slice(i, i + ps);
			i += d.byteLength;
			ask = yield (transform ? transform(d) : d);
		}
	})();
	if (returns) {
		Object.defineProperty(r, 'return', {
			value: returns,
		});
	} else if (returns === null) {
		Object.defineProperty(r, 'return', {
			value: undefined,
		});
	}
	return r;
}

function toAsyncIterator(
	data: ArrayBuffer,
	{ page, transform, returns }: IteratorInfo = {},
): SizeAsyncIterator<ArrayBufferData> {
	const r = (async function* (): SizeAsyncIterator<ArrayBufferData> {
		const size = data.byteLength;
		let ask = page ? page : (
			yield (transform
				? transform(new ArrayBuffer(0))
				: new ArrayBuffer(0))
		);
		for (let i = 0; i < size;) {
			const ps = page || ask || PAGE_SIZE;
			const d = data.slice(i, i + ps);
			i += d.byteLength;
			ask = yield (transform ? transform(d) : d);
		}
	})();
	if (returns) {
		Object.defineProperty(r, 'return', {
			value: returns,
		});
	} else if (returns === null) {
		Object.defineProperty(r, 'return', {
			value: undefined,
		});
	}
	return r;
}

function hashed(algo: string, data: Uint8Array): string {
	return createHash(algo).update(data).digest('hex');
}

const EMPTY = new Uint8Array(0);
const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));
const PAGED = new Uint8Array(
	new ArrayBuffer(Math.floor(PAGE_SIZE * 1.5)),
);

const ITTER_SIZES = [
	0,
	Math.floor(PAGE_SIZE / 2),
	PAGE_SIZE,
	Math.floor(PAGE_SIZE * 1.5),
	PAGE_SIZE * 2,
];

const expected = [
	[kCCDigestSHA1, {
		EMPTY: [EMPTY.buffer, hashed('sha1', EMPTY)],
		ABCD: [ABCD.buffer, hashed('sha1', ABCD)],
		PAGED: [PAGED.buffer, hashed('sha1', PAGED)],
	}],
	[kCCDigestSHA256, {
		EMPTY: [EMPTY.buffer, hashed('sha256', EMPTY)],
		ABCD: [ABCD.buffer, hashed('sha256', ABCD)],
		PAGED: [PAGED.buffer, hashed('sha256', PAGED)],
	}],
	[kCCDigestSHA384, {
		EMPTY: [EMPTY.buffer, hashed('sha384', EMPTY)],
		ABCD: [ABCD.buffer, hashed('sha384', ABCD)],
		PAGED: [PAGED.buffer, hashed('sha384', PAGED)],
	}],
	[kCCDigestSHA512, {
		EMPTY: [EMPTY.buffer, hashed('sha512', EMPTY)],
		ABCD: [ABCD.buffer, hashed('sha512', ABCD)],
		PAGED: [PAGED.buffer, hashed('sha512', PAGED)],
	}],
] as const;

let sagDetect: Promise<boolean>;

async function getEngines(): Promise<[string, HashCrypto | null][]> {
	const engines: Record<string, HashCrypto | null> = {
		subtle: null,
		'jsr:@std/crypto': stdCrypto.subtle,
		'node:crypto': subtleNode,
		'DigestStream': subtleStreaming,
	};

	// Feature detect subtle crypto hash async generator extension.
	sagDetect ??= (async () => {
		let valid = false;
		try {
			const source = (async function* (): AsyncGenerator<ArrayBuffer> {
				// If this function starts, then next was called.
				valid = true;
				yield new ArrayBuffer(0);
			})();
			await crypto.subtle.digest(
				'SHA-256',
				source as unknown as ArrayBuffer,
			);
		} catch {
			// Ignore.
		}
		return valid;
	})();
	if (await sagDetect) {
		engines['subtle-no-async-generator'] = {
			async digest(
				algo: SubtleCryptoDigestAlgorithm,
				data: ArrayBufferData,
			): Promise<ArrayBuffer> {
				if ('next' in data) {
					throw new TypeError('AsyncGenerator not supported');
				}
				return await crypto.subtle.digest(algo, data);
			},
		};
	}

	return Object.entries(engines);
}

type InputIterator = [
	string,
	() => SizeIterator<ArrayBufferData> | SizeAsyncIterator<ArrayBufferData>,
	number,
];

function getIterators(size: number): InputIterator[] {
	return [
		[
			`Iterator-returns-${size}`,
			() => toIterator(new ArrayBuffer(size)),
			size,
		],
		[
			`AsyncIterator-returns-${size}`,
			() => toAsyncIterator(new ArrayBuffer(size)),
			size,
		],
		[
			`Iterator-no-return-${size}`,
			() => toIterator(new ArrayBuffer(size), { returns: null }),
			size,
		],
		[
			`AsyncIterator-no-return-${size}`,
			() => toAsyncIterator(new ArrayBuffer(size), { returns: null }),
			size,
		],
	];
}

interface Case {
	tag: string;
	alg: number;
	input: string;
	output: string;
	data: ArrayBuffer;
	engine: string;
	crypto: HashCrypto | null;
	size: number;
}

async function getCases(): Promise<Iterable<Case>> {
	const engines = await getEngines();
	return (function* (): Iterable<Case> {
		for (const [alg, expect] of expected) {
			for (const [engine, crypto] of engines) {
				for (const [input, [data, output]] of Object.entries(expect)) {
					const tag =
						`alg=${alg} crypto=${engine} in=${input} out=${output}`;
					yield {
						tag,
						alg,
						engine,
						crypto,
						input,
						output,
						data,
						size: output.length / 2,
					};
				}
			}
		}
	})();
}

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
	for (const { tag, alg, crypto, output, size, data } of await getCases()) {
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
	for (const { tag, alg, crypto, output, size, data } of await getCases()) {
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
	for (const { tag, alg, crypto, output, size, data } of await getCases()) {
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

	const engines = await getEngines();
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

	const engines = await getEngines();
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
		for (
			const { tag, alg, crypto, output, size, data } of await getCases()
		) {
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
		for (
			const { tag, alg, crypto, output, size, data } of await getCases()
		) {
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
		for (
			const { tag, alg, crypto, output, size, data } of await getCases()
		) {
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
		for (
			const { tag, alg, crypto, output, size, data } of await getCases()
		) {
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
	const engines = await getEngines();
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
	const engines = await getEngines();
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
