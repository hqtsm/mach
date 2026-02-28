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
import type { HashCryptoNodeSync } from './dynamichash.ts';

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

function hashed(algo: string, data: Uint8Array): string {
	return createHash(algo).update(data).digest('hex');
}

const ABCD = new TextEncoder().encode('ABCD');
const PAGED = new Uint8Array(new ArrayBuffer(PAGE_SIZE * 1.5));

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
		ABCD: [ABCD.buffer, hashed('sha1', ABCD)] as const,
		PAGED: [PAGED.buffer, hashed('sha1', PAGED)] as const,
	}],
	[kCCDigestSHA256, {
		ABCD: [ABCD.buffer, hashed('sha256', ABCD)] as const,
		PAGED: [PAGED.buffer, hashed('sha256', PAGED)] as const,
	}],
	[kCCDigestSHA384, {
		ABCD: [ABCD.buffer, hashed('sha384', ABCD)] as const,
		PAGED: [PAGED.buffer, hashed('sha384', PAGED)] as const,
	}],
	[kCCDigestSHA512, {
		ABCD: [ABCD.buffer, hashed('sha512', ABCD)] as const,
		PAGED: [PAGED.buffer, hashed('sha512', PAGED)] as const,
	}],
] as const;

const engines = [
	{
		name: 'subtle',
		crypto: null,
	},
	{
		name: 'node-sync',
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
		name: 'node-async',
		crypto: { createHash },
	},
] as const;

function* cases(): Iterable<{
	tag: string;
	alg: number;
	input: string;
	output: string;
	data: ArrayBuffer;
	name: (typeof engines)[number]['name'];
	crypto: (typeof engines)[number]['crypto'];
}> {
	for (const [alg, expect] of expected) {
		for (const { name, crypto } of engines) {
			for (const [input, [data, output]] of Object.entries(expect)) {
				yield {
					tag: `alg=${alg} crypto=${name} in=${input} out=${output}`,
					alg,
					name,
					crypto,
					input,
					output,
					data,
				};
			}
		}
	}
}

Deno.test('CCHashInstance unsupported', () => {
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

Deno.test('CCHashInstance ArrayBuffer', async () => {
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

Deno.test('CCHashInstance SharedArrayBuffer', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const hash = new CCHashInstance(alg);
		hash.crypto = crypto;
		const sab = new SharedArrayBuffer(data.byteLength);
		new Uint8Array(sab).set(new Uint8Array(data));
		// deno-lint-ignore no-await-in-loop
		await hash.update(sab);
		// deno-lint-ignore no-await-in-loop
		const rab = await hash.finish();
		assertEquals(rab.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(rab)), output, tag);
	}
});

Deno.test('CCHashInstance Uint8Array<ArrayBuffer>', async () => {
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

Deno.test('CCHashInstance Uint8Array<SharedArrayBuffer>', async () => {
	for (const { tag, alg, crypto, output, data } of cases()) {
		const hash = new CCHashInstance(alg);
		hash.crypto = crypto;
		const sab = new SharedArrayBuffer(data.byteLength);
		const bytes = new Uint8Array(sab);
		bytes.set(new Uint8Array(data));
		// deno-lint-ignore no-await-in-loop
		await hash.update(bytes);
		// deno-lint-ignore no-await-in-loop
		const rab = await hash.finish();
		assertEquals(rab.byteLength, hash.digestLength(), tag);
		assertEquals(hex(new Uint8Array(rab)), output, tag);
	}
});

Deno.test('CCHashInstance Blob', async () => {
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

Deno.test('CCHashInstance truncate', async () => {
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

Deno.test('CCHashInstance Blob over-read', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
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

Deno.test('CCHashInstance Blob under-read', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
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

Deno.test('Repeat update', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(ABCD);
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(ABCD),
			Error,
			'Already updated',
			tag,
		);
	}
});

Deno.test('No update', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
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
});

Deno.test('Incomplete update', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => Promise.all([hash.update(ABCD), hash.finish()]),
			Error,
			'Incomplete updated',
			tag,
		);
	}
});

Deno.test('Already finished', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await hash.update(ABCD);
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
});

Deno.test('CCHashInstance node async write error', async () => {
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
	for (
		const [name, source] of [
			[
				'ArrayBuffer',
				new ArrayBuffer(1),
			],
			[
				'Blob',
				new Blob([new ArrayBuffer(1)]),
			],
		] as const
	) {
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(source),
			Error,
			'Write fail',
			name,
		);
	}
});

Deno.test('CCHashInstance node async end error', async () => {
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
	for (
		const [name, source] of [
			[
				'ArrayBuffer',
				new ArrayBuffer(1),
			],
			[
				'Blob',
				new Blob([new ArrayBuffer(1)]),
			],
		] as const
	) {
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(source),
			Error,
			'End fail',
			name,
		);
	}
});
