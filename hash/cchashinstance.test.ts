// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
import { assertEquals, assertRejects, assertThrows } from '@std/assert';
import { crypto as stdCrypto } from '@std/crypto';
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
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import type { ArrayBufferData, ArrayBufferLikeData } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
import { CCHashInstance } from './cchashinstance.ts';
import type {
	HashCrypto,
	HashCryptoNodeSync,
	HashCryptoSubtleAlgorithm,
} from './dynamichash.ts';

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

let sagDetect: Promise<boolean>;

async function getEngines(): Promise<[string, HashCrypto | null][]> {
	const engines: Record<string, HashCrypto | null> = {
		subtle: null,
		'jsr:@std/crypto': stdCrypto.subtle,
		'node:sync': {
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
		'node:async': { createHash },
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
				algo: HashCryptoSubtleAlgorithm,
				data: ArrayBufferView<ArrayBuffer> | ArrayBuffer,
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

type InputData = [string, () => ArrayBuffer, null];

type InputBlob = [string, () => Blob, null];

type InputIterator = [
	string,
	() => SizeIterator<ArrayBufferData> | SizeAsyncIterator<ArrayBufferData>,
	number,
];

function getInputsData(size: number): InputData[] {
	return [
		[
			`ArrayBuffer-${size}`,
			() => new ArrayBuffer(size),
			null,
		],
	];
}

function getInputsBlob(size: number): InputBlob[] {
	return [
		[
			`Blob-${size}`,
			() => new Blob([new ArrayBuffer(size)]),
			null,
		],
	];
}

function getInputsIterator(size: number): InputIterator[] {
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

function getInputs(size: number): (InputData | InputBlob | InputIterator)[] {
	return [
		...getInputsData(size),
		...getInputsBlob(size),
		...getInputsIterator(size),
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
					};
				}
			}
		}
	})();
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
	for (const { tag, alg, crypto, output, data } of await getCases()) {
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

Deno.test('Hash Uint8Array<ArrayBuffer>', async () => {
	for (const { tag, alg, crypto, output, data } of await getCases()) {
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

Deno.test('Hash Blob', async () => {
	for (const { tag, alg, crypto, output, data } of await getCases()) {
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
		for (const { tag, alg, crypto, output, data } of await getCases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
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
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash Iterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of await getCases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
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
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash AsyncIterator<ArrayBuffer>', async () => {
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of await getCases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
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
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash AsyncIterator<Uint8Array<ArrayBuffer>>', async () => {
	const transform = (d: ArrayBuffer) => new Uint8Array(d);
	for (const page of ITTER_SIZES) {
		for (const { tag, alg, crypto, output, data } of await getCases()) {
			const tags = `${tag} page=${page}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
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
			const rab = await hash.finish();
			assertEquals(rab.byteLength, hash.digestLength(), tags);
			assertEquals(hex(new Uint8Array(rab)), output, tags);
		}
	}
});

Deno.test('Hash truncate', async () => {
	for (const { tag, alg, crypto, output, data } of await getCases()) {
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
	const reader = new BadReader(1024);
	reader.diff = 1;

	const engines = await getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(reader),
			RangeError,
			'Read size off by: 1',
			tag,
		);
	}
});

Deno.test('Hash Blob under-read', async () => {
	const reader = new BadReader(1024);
	reader.diff = -1;

	const engines = await getEngines();
	for (const [engine, crypto] of engines) {
		const tag = `engine=${engine}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(reader),
			RangeError,
			'Read size off by: -1',
			tag,
		);
	}
});

Deno.test('Hash stream over-read', async () => {
	const engines = await getEngines();
	for (const [name, source, size] of getInputsIterator(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const hash = new CCHashInstance(kCCDigestSHA1);
			hash.crypto = crypto;
			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => hash.update(source(), size - 1),
				RangeError,
				'Read size off by: 1',
				tag,
			);
		}
	}
});
Deno.test('Hash stream under-read', async () => {
	const engines = await getEngines();
	for (const [name, source, size] of getInputsIterator(1024)) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			const hash = new CCHashInstance(kCCDigestSHA1);
			hash.crypto = crypto;
			// deno-lint-ignore no-await-in-loop
			await assertRejects(
				() => hash.update(source(), size + 1),
				RangeError,
				'Read size off by: -1',
				tag,
			);
		}
	}
});

Deno.test('State errors', async () => {
	const engines = await getEngines();
	for (const [name, source, size] of [...getInputs(0), ...getInputs(1)]) {
		for (const [engine, crypto] of engines) {
			const tag = `name=${name} engine=${engine}`;
			{
				const hash = new CCHashInstance(kCCDigestSHA1);
				hash.crypto = crypto;
				// deno-lint-ignore no-await-in-loop
				await (
					size === null
						? hash.update(source())
						: hash.update(source(), size)
				);
				// deno-lint-ignore no-await-in-loop
				await assertRejects(
					() => (
						size === null
							? hash.update(source())
							: hash.update(source(), size)
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
				const incomplete = size === null
					? hash.update(source())
					: hash.update(source(), size);
				try {
					const finish = hash.finish();
					// deno-lint-ignore no-await-in-loop
					await assertRejects(
						() => finish,
						Error,
						'Incomplete updated',
						tag,
					);
				} finally {
					// deno-lint-ignore no-await-in-loop
					await incomplete;
				}
			}
			{
				const hash = new CCHashInstance(kCCDigestSHA1);
				hash.crypto = crypto;
				// deno-lint-ignore no-await-in-loop
				await (
					size === null
						? hash.update(source())
						: hash.update(source(), size)
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

	for (const [name, source, size] of [...getInputsData(0), ...getInputs(1)]) {
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() =>
				size === null
					? hash.update(source())
					: hash.update(source(), size),
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

	for (const [name, source, size] of [...getInputs(0), ...getInputs(1)]) {
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() =>
				size === null
					? hash.update(source())
					: hash.update(source(), size),
			Error,
			'End fail',
			name,
		);
	}
});
