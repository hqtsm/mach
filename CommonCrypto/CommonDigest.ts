import { toStringTag } from '@hqtsm/class';
import type { ArrayBufferPointer } from '@hqtsm/struct';
import type { int, size_t } from '../libc/c.ts';
import type {
	SubtleCryptoDigest,
	SubtleCryptoDigestAlgorithm,
	SubtleCryptoExtended,
} from '../util/crypto.ts';
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import { type ArrayBufferData, asUint8Array } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
import { PAGE_SIZE_ARM64 as PAGE_SIZE } from '../mach/vm_param.ts';
import { CC_MAX_N_DIGESTS } from './ccGlobals.ts';
import {
	kCCCallSequenceError,
	kCCParamError,
	kCCSuccess,
	kCCUnimplemented,
} from './CommonCryptoError.ts';
import {
	type CCDigestAlgorithm,
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
} from './Private/CommonDigestSPI.ts';

/**
 * Algorithm specification.
 */
interface Algo {
	/**
	 * Algorithm name.
	 */
	a: SubtleCryptoDigestAlgorithm;

	/**
	 * Digest length.
	 */
	l: size_t;

	/**
	 * Block length.
	 */
	b: size_t;
}

// Supported hash algorithms with their names and lengths.
const algorithms = new Map<CCDigestAlgorithm, Algo>([
	[kCCDigestSHA1, { a: 'SHA-1', l: 20, b: 64 }],
	[kCCDigestSHA256, { a: 'SHA-256', l: 32, b: 64 }],
	[kCCDigestSHA384, { a: 'SHA-384', l: 48, b: 128 }],
	[kCCDigestSHA512, { a: 'SHA-512', l: 64, b: 128 }],
]);

const supportsAG = new WeakMap();

const isPromise = <T>(
	v: { done?: boolean } | Promise<T>,
): v is Promise<T> => 'then' in v;

const subtleAG = async (
	subtle: SubtleCryptoDigest,
	algo: SubtleCryptoDigestAlgorithm,
	source: AsyncGenerator<ArrayBuffer>,
): Promise<ArrayBuffer | null> => {
	try {
		return await (subtle as Pick<SubtleCryptoExtended, 'digest'>).digest(
			algo,
			source,
		);
	} catch (err) {
		if (supportsAG.get(subtle.digest)) {
			throw err;
		}
	}
	supportsAG.set(subtle.digest, false);
	return null;
};

const readerAG = async function* (
	subtle: SubtleCryptoDigest,
	source: Reader,
): AsyncGenerator<ArrayBuffer> {
	supportsAG.set(subtle.digest, true);
	const { size } = source;
	for (
		let i = 0, r = size, l;
		i < size;
		r -= l, i += PAGE_SIZE
	) {
		l = r > PAGE_SIZE ? PAGE_SIZE : r;
		// deno-lint-ignore no-await-in-loop
		const b = await source.slice(i, i + l).arrayBuffer();
		const o = l - b.byteLength;
		if (o) {
			throw new RangeError(`Read size off by: ${o}`);
		}
		yield b;
	}
};

const iteratorAG = async function* (
	subtle: SubtleCryptoDigest,
	source: SizeIterator<ArrayBufferData> | SizeAsyncIterator<ArrayBufferData>,
	size: number,
): AsyncGenerator<ArrayBuffer> {
	supportsAG.set(subtle.digest, true);
	let a, o = -size;
	try {
		let n;
		for (
			a = isPromise(n = source.next(PAGE_SIZE));;
			n = source.next(PAGE_SIZE)
		) {
			// deno-lint-ignore no-await-in-loop
			n = (a ? await n : n) as IteratorResult<ArrayBufferData>;
			if (n.done) {
				break;
			}
			let b = n.value;
			const l = b.byteLength;
			if (l) {
				o += l;
				if (o > 0) {
					break;
				}
				if ('buffer' in b) {
					b = new Uint8Array(b.buffer, b.byteOffset, l).slice()
						.buffer;
				}
				yield b;
			}
		}
	} finally {
		const r = source.return?.();
		if (a && r) {
			await r;
		}
	}
	if (o) {
		throw new RangeError(`Read size off by: ${o}`);
	}
};

const digestNull = async (
	iter?:
		| SizeIterator<ArrayBufferData>
		| SizeAsyncIterator<ArrayBufferData>,
): Promise<null> => {
	if (iter) {
		await iter.return?.();
	}
	return null;
};

const digestReader = async function (
	reader: Reader,
	size: number,
	alg: SubtleCryptoDigestAlgorithm,
	subtle: SubtleCryptoDigest,
): Promise<ArrayBuffer> {
	let d;
	if (supportsAG.get(subtle.digest) !== false) {
		d = await subtleAG(subtle, alg, readerAG(subtle, reader));
	}
	if (!d) {
		const v = await reader.arrayBuffer();
		const o = size - v.byteLength;
		if (o) {
			throw new RangeError(`Read size off by: ${o}`);
		}
		d = await subtle.digest(alg, v);
	}
	return d;
};

const digestIterator = async function (
	iter: SizeIterator<ArrayBufferData> | SizeAsyncIterator<ArrayBufferData>,
	size: number,
	alg: SubtleCryptoDigestAlgorithm,
	subtle: SubtleCryptoDigest,
): Promise<ArrayBuffer> {
	let d;
	if (supportsAG.get(subtle.digest) !== false) {
		d = await subtleAG(subtle, alg, iteratorAG(subtle, iter, size));
	}
	if (!d) {
		let p;
		let all: Uint8Array<ArrayBuffer> | undefined;
		let o = -size;
		let ps = size;
		try {
			let n;
			let i = 0;
			for (
				p = isPromise(n = iter.next(ps));;
				n = iter.next(ps)
			) {
				// deno-lint-ignore no-await-in-loop
				n = (p ? await n : n) as IteratorResult<
					ArrayBufferData
				>;
				if (n.done) {
					break;
				}
				const b = n.value;
				const l = b.byteLength;
				if (l) {
					o += l;
					if (o > 0) {
						break;
					}
					if (all) {
						all.set(asUint8Array(b), i);
					} else {
						if (o) {
							all = new Uint8Array(size);
							all.set(asUint8Array(b));
						} else {
							all = asUint8Array(b);
						}
						ps = PAGE_SIZE;
					}
					i += l;
				}
			}
		} finally {
			const r = iter.return?.();
			if (p && r) {
				await r;
			}
		}
		if (o) {
			throw new RangeError(`Read size off by: ${o}`);
		}
		d = await subtle.digest(alg, all!);
	}
	return d;
};

/**
 * CommonCrypto digest context.
 */
export class CCDigestRef {
	/**
	 * Optional hash crypto.
	 */
	public subtle: SubtleCryptoDigest | null = null;

	/**
	 * Algorithm.
	 */
	protected a = 0;

	/**
	 * Digest.
	 */
	protected d: Promise<ArrayBuffer | null> | null = null;

	static {
		toStringTag(this, 'CCDigestRef');
	}
}

/**
 * Init digest context.
 *
 * @param alg Digest algorithm.
 * @param c Digest context.
 * @returns Status.
 */
export function CCDigestInit(
	alg: CCDigestAlgorithm,
	c: CCDigestRef | null,
): int {
	if (!alg || alg >= CC_MAX_N_DIGESTS || !c) {
		return kCCParamError;
	}
	if (!algorithms.has(alg)) {
		return kCCUnimplemented;
	}
	c['a'] = alg;
	c['d'] = null;
	return kCCSuccess;
}

/**
 * Update digest, can only be called once.
 *
 * @param c Digest context.
 * @param data Source data.
 * @returns Status.
 */
export async function CCDigestUpdate(
	c: CCDigestRef | null,
	data:
		| Reader
		| ArrayBufferData,
): Promise<int>;

/**
 * Update digest, can only be called once.
 *
 * @param c Digest context.
 * @param data Source data.
 * @param len Source length.
 * @returns Status.
 */
export async function CCDigestUpdate(
	c: CCDigestRef | null,
	data:
		| ArrayBufferPointer<ArrayBuffer>
		| SizeIterator<ArrayBufferData>
		| SizeAsyncIterator<ArrayBufferData>
		| null,
	len: size_t,
): Promise<int>;

/**
 * Update digest, can only be called once.
 *
 * @param c Digest context.
 * @param data Source data.
 * @param len Source length.
 * @returns Status.
 */
export async function CCDigestUpdate(
	c: CCDigestRef | null,
	data:
		| Reader
		| ArrayBufferData
		| ArrayBufferPointer<ArrayBuffer>
		| SizeIterator<ArrayBufferData>
		| SizeAsyncIterator<ArrayBufferData>
		| null,
	len?: size_t,
): Promise<int> {
	if (!c) {
		return kCCParamError;
	}

	// Update can only be called once.
	if (c['d']) {
		return kCCCallSequenceError;
	}

	let read;
	let iter;
	let size;
	if (typeof len === 'number') {
		size = len;
		if (data && 'next' in data) {
			iter = data;
		}
	} else {
		size = ('arrayBuffer' in data!)
			? (read = data).size
			: (data as ArrayBufferData).byteLength;
	}

	// Empty input is allowed.
	if (size === 0) {
		await (c['d'] = digestNull(iter));
		return kCCSuccess;
	}

	// Only an error if not empty.
	if (!data) {
		return kCCParamError;
	}

	const algo = algorithms.get(c['a']);
	if (!algo) {
		return kCCUnimplemented;
	}
	const { a } = algo;

	const s = c.subtle || crypto.subtle;

	if (read) {
		await (c['d'] = digestReader(read, size, a, s));
	} else if (iter) {
		await (c['d'] = digestIterator(iter, size, a, s));
	} else {
		await (c['d'] = s.digest(
			a,
			asUint8Array(data as ArrayBufferData, size),
		));
	}

	return kCCSuccess;
}

/**
 * Final digest, can only be called once.
 *
 * @param c Digest context.
 * @param out Digest.
 * @returns Status.
 */
export async function CCDigestFinal(
	c: CCDigestRef | null,
	out: ArrayBufferLike | ArrayBufferPointer | null,
): Promise<int> {
	if (!c || !out) {
		return kCCParamError;
	}

	const algo = algorithms.get(c['a']);
	if (!algo) {
		return kCCUnimplemented;
	}
	const { a, l } = algo;

	const d = c['d'];
	c['d'] = null;

	const digest = (await d) || (
		await (c.subtle || crypto.subtle).digest(a, new ArrayBuffer(0))
	);
	asUint8Array(out, l).set(new Uint8Array(digest, 0, l));

	return kCCSuccess;
}

/**
 * Digest data.
 *
 * @param alg Digest algorithm.
 * @param data Source data.
 * @param out Digest.
 * @param subtle Hash crypto.
 * @returns Status.
 */
export async function CCDigest(
	alg: CCDigestAlgorithm,
	data:
		| Reader
		| ArrayBufferData,
	out: ArrayBufferLike | ArrayBufferPointer | null,
	subtle?: SubtleCryptoDigest | null,
): Promise<int>;

/**
 * Digest data.
 *
 * @param alg Digest algorithm.
 * @param data Source data.
 * @param len Source length.
 * @param out Digest.
 * @param subtle Hash crypto.
 * @returns Status.
 */
export async function CCDigest(
	alg: CCDigestAlgorithm,
	data:
		| ArrayBufferPointer<ArrayBuffer>
		| SizeIterator<ArrayBufferData>
		| SizeAsyncIterator<ArrayBufferData>
		| null,
	len: size_t,
	out: ArrayBufferLike | ArrayBufferPointer | null,
	subtle?: SubtleCryptoDigest | null,
): Promise<int>;

/**
 * Digest data.
 *
 * @param alg Digest algorithm.
 * @param data Source data.
 * @param len Source length.
 * @param out Digest.
 * @param subtle Hash crypto.
 * @returns Status.
 */
export async function CCDigest(
	alg: CCDigestAlgorithm,
	data:
		| Reader
		| ArrayBufferData
		| ArrayBufferPointer<ArrayBuffer>
		| SizeIterator<ArrayBufferData>
		| SizeAsyncIterator<ArrayBufferData>
		| null,
	len: size_t | ArrayBufferLike | ArrayBufferPointer | null,
	out?: ArrayBufferLike | ArrayBufferPointer | null | SubtleCryptoDigest,
	subtle?: SubtleCryptoDigest | null,
): Promise<int> {
	const algo = algorithms.get(alg);
	if (!algo) {
		return kCCUnimplemented;
	}
	const { a, l } = algo;

	let s;
	let o;
	let read;
	let iter;
	let size;
	if (typeof len === 'number') {
		size = len;
		if (data && 'next' in data) {
			iter = data;
		}
		o = out as ArrayBufferLike | ArrayBufferPointer;
		s = subtle;
	} else {
		size = ('arrayBuffer' in data!)
			? (read = data).size
			: (data as ArrayBufferData).byteLength;
		o = len;
		s = out as SubtleCryptoDigest | null | undefined;
	}

	if (!o) {
		return kCCParamError;
	}

	// Empty input is allowed, only an error if not empty.
	if (!data && size) {
		return kCCParamError;
	}

	s ??= crypto.subtle;

	let d;
	if (!size) {
		if (iter) {
			await iter.return?.();
		}
		d = await s.digest(a, new ArrayBuffer(0));
	} else if (read) {
		d = await digestReader(read, size, a, s);
	} else if (iter) {
		d = await digestIterator(iter, size, a, s);
	} else {
		d = await s.digest(
			a,
			asUint8Array(data as ArrayBufferData, size),
		);
	}
	asUint8Array(o, l).set(new Uint8Array(d, 0, l));

	return kCCSuccess;
}

/**
 * Get digest block size.
 *
 * @param algorithm Digest algorithm.
 * @returns Block size.
 */
export function CCDigestGetBlockSize(algorithm: CCDigestAlgorithm): size_t {
	const algo = algorithms.get(algorithm);
	return algo ? algo.b : kCCUnimplemented;
}

/**
 * Get digest output size.
 *
 * @param algorithm Digest algorithm.
 * @returns Output size.
 */
export function CCDigestGetOutputSize(algorithm: CCDigestAlgorithm): size_t {
	const algo = algorithms.get(algorithm);
	return algo ? algo.l : kCCUnimplemented;
}

/**
 * Get digest block size.
 *
 * @param ctx Digest context.
 * @returns Block size.
 */
export function CCDigestGetBlockSizeFromRef(ctx: CCDigestRef): size_t {
	const algo = algorithms.get(ctx['a']);
	return algo ? algo.b : kCCUnimplemented;
}

/**
 * Get digest block size.
 *
 * @param ctx Digest context.
 * @returns Block size.
 */
export function CCDigestBlockSize(ctx: CCDigestRef): size_t {
	return CCDigestGetBlockSizeFromRef(ctx);
}

/**
 * Get digest output size.
 *
 * @param ctx Digest context.
 * @returns Output size.
 */
export function CCDigestOutputSize(ctx: CCDigestRef): size_t {
	return CCDigestGetOutputSizeFromRef(ctx);
}

/**
 * Get digest output size.
 *
 * @param ctx Digest context.
 * @returns Output size.
 */
export function CCDigestGetOutputSizeFromRef(ctx: CCDigestRef): size_t {
	const algo = algorithms.get(ctx['a']);
	return algo ? algo.l : kCCUnimplemented;
}

/**
 * Create digest context.
 *
 * @param alg Digest algorithm.
 * @returns Digest context.
 */
export function CCDigestCreate(alg: CCDigestAlgorithm): CCDigestRef | null {
	const r = new CCDigestRef();
	return CCDigestInit(alg, r) ? null : r;
}

/**
 * Digest reset.
 *
 * @param ctx Digest context.
 */
export function CCDigestReset(ctx: CCDigestRef): void {
	ctx['d'] = null;
}

/**
 * Cleanup digest context, not really necessary.
 *
 * @param ctx Digest context.
 */
export function CCDigestDestroy(ctx: CCDigestRef): void {
	ctx['d'] = null;
	ctx['a'] = 0;
	ctx.subtle = null;
}
