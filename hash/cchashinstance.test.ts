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

class ShortReader implements Reader {
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
		return new ShortReader(start < end ? end - start : 0, contentType);
	}

	// deno-lint-ignore require-await
	public async arrayBuffer(): Promise<ArrayBuffer> {
		return new ArrayBuffer(this.#size - 1);
	}
}

class LongReader implements Reader {
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
		return new LongReader(start < end ? end - start : 0, contentType);
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
const ABCD_SAB = new Uint8Array(new SharedArrayBuffer(ABCD.byteLength));
ABCD_SAB.set(ABCD);

// 'ABCD':
const expectedABCD = [
	[kCCDigestSHA1, hashed('sha1', ABCD)],
	[kCCDigestSHA256, hashed('sha256', ABCD)],
	[kCCDigestSHA384, hashed('sha384', ABCD)],
	[kCCDigestSHA512, hashed('sha512', ABCD)],
] as const;

const PAGED = new Uint8Array(new ArrayBuffer(PAGE_SIZE * 1.5));

const expectedPAGED = [
	[kCCDigestSHA1, hashed('sha1', PAGED)],
	[kCCDigestSHA256, hashed('sha256', PAGED)],
	[kCCDigestSHA384, hashed('sha384', PAGED)],
	[kCCDigestSHA512, hashed('sha512', PAGED)],
] as const;

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

Deno.test('CCHashInstance full', async () => {
	for (const [alg, expt] of expectedABCD) {
		for (const { name, crypto } of engines) {
			for (const view of [true, false]) {
				const tag = `alg=${alg} engine=${name} view=${view}`;
				{
					const hash = new CCHashInstance(alg);
					hash.crypto = crypto;
					// deno-lint-ignore no-await-in-loop
					await hash.update(view ? ABCD : ABCD.buffer);
					// deno-lint-ignore no-await-in-loop
					const rab = await hash.finish();
					assertEquals(rab.byteLength, hash.digestLength(), tag);
					assertEquals(hex(new Uint8Array(rab)), expt, tag);
				}
				{
					const hash = new CCHashInstance(alg);
					hash.crypto = crypto;
					// deno-lint-ignore no-await-in-loop
					await hash.update(view ? ABCD_SAB : ABCD_SAB.buffer);
					// deno-lint-ignore no-await-in-loop
					const rsab = await hash.finish();
					assertEquals(rsab.byteLength, hash.digestLength(), tag);
					assertEquals(hex(new Uint8Array(rsab)), expt, tag);
				}
			}
		}
	}
});

Deno.test('CCHashInstance truncate', async () => {
	const truncate = 8;
	for (const [alg, expt] of expectedABCD) {
		for (const { name, crypto } of engines) {
			const tag = `alg=${alg} engine=${name} truncate=${truncate}`;
			const exptHex = expt.slice(0, truncate * 2);
			const hash = new CCHashInstance(alg, truncate);
			hash.crypto = crypto;
			// deno-lint-ignore no-await-in-loop
			await hash.update(ABCD);
			// deno-lint-ignore no-await-in-loop
			const digest = await hash.finish();
			assertEquals(digest.byteLength, truncate, tag);
			assertEquals(hex(new Uint8Array(digest)), exptHex, tag);
		}
	}
});

Deno.test('CCHashInstance paged', async () => {
	for (const [alg, expt] of expectedPAGED) {
		for (const { name, crypto } of engines) {
			const tag = `alg=${alg} engine=${name}`;
			const hash = new CCHashInstance(alg);
			hash.crypto = crypto;
			// deno-lint-ignore no-await-in-loop
			await hash.update(new Blob([PAGED]));
			// deno-lint-ignore no-await-in-loop
			const digest = await hash.finish();
			assertEquals(digest.byteLength, hash.digestLength(), tag);
			assertEquals(hex(new Uint8Array(digest)), expt, tag);
		}
	}
});

Deno.test('CCHashInstance short read', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(new ShortReader(1024)),
			RangeError,
			'Read size off by: -1',
			tag,
		);
	}
});

Deno.test('CCHashInstance long read', async () => {
	for (const { name, crypto } of engines) {
		const tag = `engine=${name}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = crypto;
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(new LongReader(1024)),
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
		if (name === 'node-sync') {
			continue;
		}
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
		if (name === 'node-sync') {
			continue;
		}
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

Deno.test('Already finsished', async () => {
	for (const { name, crypto } of engines) {
		if (name === 'node-sync') {
			continue;
		}
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
	for (const blob of [true, false]) {
		const tag = `blob=${blob}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = {
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
		const data = new ArrayBuffer(1);
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(blob ? new Blob([data]) : data),
			Error,
			'Write fail',
			tag,
		);
	}
});

Deno.test('CCHashInstance node async end error', async () => {
	for (const blob of [true, false]) {
		const tag = `blob=${blob}`;
		const hash = new CCHashInstance(kCCDigestSHA1);
		hash.crypto = {
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
		const data = new ArrayBuffer(1);
		// deno-lint-ignore no-await-in-loop
		await assertRejects(
			() => hash.update(blob ? new Blob([data]) : data),
			Error,
			'End fail',
			tag,
		);
	}
});
