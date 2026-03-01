// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
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
	kCCDigestSHA224,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
	kCCDigestSkein128,
	kCCDigestSkein160,
	kCCDigestSkein224,
	kCCDigestSkein256,
	kCCDigestSkein384,
	kCCDigestSkein512,
	PAGE_SIZE,
} from '../const.ts';
import { hex } from '../spec/hex.ts';
import type { Reader } from '../util/reader.ts';
import { CCHashInstance } from './cchashinstance.ts';
import type {
	HashCryptoNodeSync,
	HashSourceAsyncIterator,
	HashSourceIterator,
} from './dynamichash.ts';

class OverReader implements Reader {
	#size: number;

	#type: string;

	constructor(size: number, type: string = '') {
		this.#size = size;
		this.#type = type;
	}

	public get size(): number {
		return this.#size;
	}

	public get type(): string {
		return this.#type;
	}

	public slice(start?: number, end?: number, contentType?: string): Reader {
		start ??= 0;
		end ??= this.#size;
		return new OverReader(start < end ? end - start : 0, contentType);
	}

	// deno-lint-ignore require-await
	public async arrayBuffer(): Promise<ArrayBuffer> {
		return new ArrayBuffer(this.#size - 1);
	}
}

class UnderReader implements Reader {
	#size: number;

	#type: string;

	constructor(size: number, type: string = '') {
		this.#size = size;
		this.#type = type;
	}

	public get size(): number {
		return this.#size;
	}

	public get type(): string {
		return this.#type;
	}

	public slice(start?: number, end?: number, contentType?: string): Reader {
		start ??= 0;
		end ??= this.#size;
		return new UnderReader(start < end ? end - start : 0, contentType);
	}

	// deno-lint-ignore require-await
	public async arrayBuffer(): Promise<ArrayBuffer> {
		return new ArrayBuffer(this.#size + 1);
	}
}

function ab2sab(ab: ArrayBuffer): SharedArrayBuffer {
	const sab = new SharedArrayBuffer(ab.byteLength);
	new Uint8Array(sab).set(new Uint8Array(ab));
	return sab;
}

interface IteratorInfo {
	data: ArrayBuffer;
	page?: number;
	transform?: (data: ArrayBuffer) => ArrayBufferLike | ArrayBufferView;
	returns?: (() => unknown) | null;
}

function toIterator(
	{ data, page, transform, returns }: IteratorInfo,
): HashSourceIterator {
	const r = (function* (): HashSourceIterator {
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
	{ data, page, transform, returns }: IteratorInfo,
): HashSourceAsyncIterator {
	const r = (async function* (): HashSourceAsyncIterator {
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
const ABCD = new TextEncoder().encode('ABCD');
const PAGED = new Uint8Array(new ArrayBuffer(Math.floor(PAGE_SIZE * 1.5)));

const ITTER_SIZES = [
	0,
	Math.floor(PAGE_SIZE / 2),
	PAGE_SIZE,
	Math.floor(PAGE_SIZE * 1.5),
	PAGE_SIZE * 2,
];

const unsupported = [
	kCCDigestNone,
	kCCDigestMD2,
	kCCDigestMD4,
	kCCDigestMD5,
	kCCDigestSHA224,
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

const engines = [
	{
		engine: 'subtle',
		crypto: null,
	},
	{
		engine: 'node-sync',
		crypto: {
			createHash(algo: string): HashCryptoNodeSync {
				const hash = createHash(algo);
				return {
					update(data: Uint8Array): void {
						hash.update(data);
					},
					digest(): ArrayBufferView {
						return hash.digest();
					},
				};
			},
		},
	},
	{
		engine: 'node-async',
		crypto: { createHash },
	},
] as const;

const inputs = [
	[
		'ArrayBuffer',
		() => new ArrayBuffer(1),
		undefined,
	],
	[
		'Blob',
		() => new Blob([new ArrayBuffer(1)]),
		undefined,
	],
	[
		'Iterator-returns',
		() => toIterator({ data: new ArrayBuffer(1) }),
		1,
	],
	[
		'AsyncIterator-returns',
		() => toAsyncIterator({ data: new ArrayBuffer(1) }),
		1,
	],
	[
		'Iterator-no-return',
		() => toIterator({ data: new ArrayBuffer(1), returns: null }),
		1,
	],
	[
		'AsyncIterator-no-return',
		() => toAsyncIterator({ data: new ArrayBuffer(1), returns: null }),
		1,
	],
] as const;

function* cases(): Iterable<{
	tag: string;
	alg: number;
	input: string;
	output: string;
	data: ArrayBuffer;
	engine: (typeof engines)[number]['engine'];
	crypto: (typeof engines)[number]['crypto'];
}> {
	for (const [alg, expect] of expected) {
		for (const { engine, crypto } of engines) {
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
				};
			}
		}
	}
}

Deno.test('Unsupported', () => {
	for (const alg of unsupported) {
		const tag = `alg=${alg}`;
		assertThrows(
			() => new CCHashInstance(alg),
			RangeError,
			`Unsupported hash algorithm: ${alg}`,
			tag,
		);
	}
});

Deno.test('Hash ArrayBuffer', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const hash = new CCHashInstance(alg);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(data);
		// deno-lint-ignore no-await-in-loop
		const rab = await hash.finish();
		assertEquals(rab.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(rab)), output, tag);
	}
});

Deno.test('Hash SharedArrayBuffer', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const hash = new CCHashInstance(alg);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(ab2sab(data));
		// deno-lint-ignore no-await-in-loop
		const rab = await hash.finish();
		assertEquals(rab.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(rab)), output, tag);
	}
});

Deno.test('Hash Uint8Array<ArrayBuffer>', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const hash = new CCHashInstance(alg);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(new Uint8Array(data));
		// deno-lint-ignore no-await-in-loop
		const rab = await hash.finish();
		assertEquals(rab.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(rab)), output, tag);
	}
});

Deno.test('Hash Uint8Array<SharedArrayBuffer>', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const hash = new CCHashInstance(alg);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(new Uint8Array(ab2sab(data)));
		// deno-lint-ignore no-await-in-loop
		const rab = await hash.finish();
		assertEquals(rab.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(rab)), output, tag);
	}
});

Deno.test('Hash Blob', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const hash = new CCHashInstance(alg);
		hash.crypto = crypto;
		const blob = new Blob([data]);
		// deno-lint-ignore no-await-in-loop
		await hash.update(blob);
		// deno-lint-ignore no-await-in-loop
		const rab = await hash.finish();
		assertEquals(rab.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(rab)), output, tag);
	}
});

Deno.test('Hash Iterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toIterator({
					data,
					page,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash Iterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(ab2sab(d));
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toIterator({
					data,
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash Iterator<SharedArrayBuffer>', async () => {
	const transform = ab2sab;
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toIterator({
					data,
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash Iterator<Uint8Array<SharedArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(ab2sab(d));
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toIterator({
					data,
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash AsyncIterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toAsyncIterator({
					data,
					page,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash AsyncIterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(ab2sab(d));
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toAsyncIterator({
					data,
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash AsyncIterator<SharedArrayBuffer>', async () => {
	const transform = ab2sab;
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toAsyncIterator({
					data,
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash AsyncIterator<Uint8Array<SharedArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(ab2sab(d));
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of cases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			let returned = 0;
			// deno-lint-ignore no-await-in-loop
			await hash.update(
				toAsyncIterator({
					data,
					page,
					transform,
					returns: () => returned++,
				}),
				data.byteLength,
			);
			assertEquals(returned, 1, tags);
			// deno-lint-ignore no-await-in-loop
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash truncate', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const truncate = Math.floor(output.length / 2);
		const hext = output.slice(0, truncate * 2);
		const hash = new CCHashInstance(alg, truncate);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(data);
		// deno-lint-ignore no-await-in-loop
		const digest = await hash.finish();
		assertEquals(hash.digestLength(), truncate, tag);
		assertEquals(digest.byteLength, truncate, tag);
		assertEquals(hex(new Uint8Array(digest)), hext, tag);
	}
});

Deno.test('Hash Blob over-read', async () => {
	for (const { engine, crypto } of engines) {
		const tag = `engine=${engine}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(new OverReader(1024)),
			RangeError,
			'Read size off by: -1',
			tag,
		);
	}
});

Deno.test('Hash Blob under-read', async () => {
	for (const { engine, crypto } of engines) {
		const tag = `engine=${engine}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(new UnderReader(1024)),
			RangeError,
			'Read size off by: 1',
			tag,
		);
	}
});

Deno.test('State errors', async () => {
	for (const [name, source, size] of inputs) {
		for (const { engine, crypto } of engines) {
			const tag = `name=${name} engine=${engine}`;
			{
				const hash = new CCHashInstance(kCCDigestSHA1);
				hash.crypto = crypto;
				// deno-lint-ignore no-await-in-loop
				await (
					size ? hash.update(source(), size) : hash.update(source())
				);
				// deno-lint-ignore no-await-in-loop
				await assertRejects(
					() => (
						size
							? hash.update(source(), size)
							: hash.update(source())
					),
					Error,
					'Already updated',
					tag,
				);
			}
			{
				const hash = new CCHashInstance(kCCDigestSHA1);
				hash.crypto = crypto;
				// deno-lint-ignore no-await-in-loop
				await assertRejects(
					() => hash.finish(),
					Error,
					'Not updated',
					tag,
				);
			}
			{
				const hash = new CCHashInstance(kCCDigestSHA1);
				hash.crypto = crypto;
				// deno-lint-ignore no-await-in-loop
				await assertRejects(
					() =>
						Promise.all([
							size
								? hash.update(source(), size)
								: hash.update(source()),
							hash.finish(),
						]),
					Error,
					'Incomplete updated',
					tag,
				);
			}
			{
				const hash = new CCHashInstance(kCCDigestSHA1);
				hash.crypto = crypto;
				// deno-lint-ignore no-await-in-loop
				await (
					size ? hash.update(source(), size) : hash.update(source())
				);
				// deno-lint-ignore no-await-in-loop
				await hash.finish();
				// deno-lint-ignore no-await-in-loop
				await assertRejects(
					() => hash.finish(),
					Error,
					'Already finished',
					tag,
				);
			}
		}
	}
});

Deno.test('Hash node async write error', async () => {
	const crypto = {
		createHash: (algo: string) => {
			const hash = createHash(algo);
			return {
				write(_: Uint8Array, cb: (err?: unknown) => void): void {
					cb(new Error('Write fail'));
				},
				end(cb: (err?: unknown) => void): void {
					hash.end(cb);
				},
				read(): ArrayBufferView {
					return hash.read();
				},
			};
		},
	};

	for (const [name, source, size] of inputs) {
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => size ? hash.update(source(), size) : hash.update(source()),
			Error,
			'Write fail',
			name,
		);
	}
});

Deno.test('Hash node async end error', async () => {
	const crypto = {
		createHash: (algo: string) => {
			const hash = createHash(algo);
			return {
				write(data: Uint8Array, cb: (err?: unknown) => void): void {
					hash.write(data, cb);
				},
				end(cb: (err?: unknown) => void): void {
					cb(new Error('End fail'));
				},
				read(): ArrayBufferView {
					return hash.read();
				},
			};
		},
	};

	for (const [name, source, size] of inputs) {
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => size ? hash.update(source(), size) : hash.update(source()),
			Error,
			'End fail',
			name,
		);
	}
});
