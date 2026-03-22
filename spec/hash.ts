// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
import { crypto as stdCrypto } from '@std/crypto';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
} from '../CommonCrypto/Private/CommonDigestSPI.ts';
import { PAGE_SIZE_ARM64 as PAGE_SIZE } from '../mach/vm_param.ts';
import type {
	SubtleCrypto,
	SubtleCryptoDigestAlgorithm,
	SubtleCryptoExtended,
} from '../util/crypto.ts';
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import type { ArrayBufferData, ArrayBufferLikeData } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
import { subtleNode, subtleStreaming } from './crypto.ts';

type HashCrypto = SubtleCrypto | SubtleCryptoExtended;

export class BadReader implements Reader {
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

	public slice(
		start?: number,
		end?: number,
		contentType?: string,
	): BadReader {
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

export function toIterator(
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

export function toAsyncIterator(
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

export function digest(
	algo: string,
	data: Uint8Array,
): Uint8Array<ArrayBuffer> {
	return new Uint8Array(createHash(algo).update(data).digest());
}

export function hashed(algo: string, data: Uint8Array): string {
	return createHash(algo).update(data).digest('hex');
}

export const EMPTY = new Uint8Array(0);
export const ABCD = new Uint8Array([...'ABCD'].map((c) => c.charCodeAt(0)));
export const PAGED = new Uint8Array(
	new ArrayBuffer(Math.floor(PAGE_SIZE * 1.5)),
);

export const ITTER_SIZES = [
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

export function getEngines(): [string, HashCrypto | null][] {
	return Object.entries({
		subtle: null,
		'jsr:@std/crypto': stdCrypto.subtle,
		'node:crypto': subtleNode,
		'DigestStream': subtleStreaming,
		'subtle-no-async-generator': {
			async digest(
				algo: SubtleCryptoDigestAlgorithm,
				data: ArrayBufferData,
			): Promise<ArrayBuffer> {
				if ('next' in data) {
					throw new TypeError('AsyncGenerator not supported');
				}
				return await crypto.subtle.digest(algo, data);
			},
		},
	});
}

type InputIterator = [
	string,
	() => SizeIterator<ArrayBufferData> | SizeAsyncIterator<ArrayBufferData>,
	number,
];

export function getIterators(size: number): InputIterator[] {
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

export function getCases(): Iterable<Case> {
	const engines = getEngines();
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
