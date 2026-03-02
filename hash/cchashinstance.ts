import { toStringTag } from '@hqtsm/class';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
	PAGE_SIZE,
} from '../const.ts';
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import { asUint8Array } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
import {
	DynamicHash,
	type HashCryptoNodeAlgorithm,
	type HashCryptoSubtle,
	type HashCryptoSubtleAlgorithm,
	type HashCryptoSubtleAsyncGenerator,
} from './dynamichash.ts';

interface Algo {
	l: number;
	s: HashCryptoSubtleAlgorithm;
	n: HashCryptoNodeAlgorithm;
}

interface Digest extends Algo {
	d: ArrayBuffer | null;
	p: 0 | 1 | 2 | 3;
}

type IR = IteratorResult<ArrayBuffer | ArrayBufferView<ArrayBuffer>>;

// Supported hash algorithms with their names and lengths.
const algorithims = new Map<number, Algo>([
	[kCCDigestSHA1, { l: 20, s: 'SHA-1', n: 'sha1' }],
	[kCCDigestSHA256, { l: 32, s: 'SHA-256', n: 'sha256' }],
	[kCCDigestSHA384, { l: 48, s: 'SHA-384', n: 'sha384' }],
	[kCCDigestSHA512, { l: 64, s: 'SHA-512', n: 'sha512' }],
]);

const algorithm = (alg: number): Algo => {
	const info = algorithims.get(alg);
	if (!info) {
		throw new RangeError(`Unsupported hash algorithm: ${alg}`);
	}
	return info;
};

const isPromise = (
	v: { done?: boolean } | Promise<unknown>,
): v is Promise<unknown> => 'then' in v;

const supportsAG = new WeakMap();

const subtleAG = async (
	subtle: HashCryptoSubtle | HashCryptoSubtleAsyncGenerator,
	algo: HashCryptoSubtleAlgorithm,
	source: AsyncGenerator<ArrayBuffer>,
): Promise<ArrayBuffer | null> => {
	try {
		return await (subtle as HashCryptoSubtleAsyncGenerator).digest(
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
	subtle: HashCryptoSubtle | HashCryptoSubtleAsyncGenerator,
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
	subtle: HashCryptoSubtle | HashCryptoSubtleAsyncGenerator,
	source:
		| SizeIterator<ArrayBuffer | ArrayBufferView<ArrayBuffer>>
		| SizeAsyncIterator<ArrayBuffer | ArrayBufferView<ArrayBuffer>>,
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
			n = (a ? await n : n) as IR;
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

/**
 * CCHashInstance dynamic hash.
 */
export class CCHashInstance extends DynamicHash {
	/**
	 * Digest algorithm.
	 */
	private mDigest: Digest;

	/**
	 * Truncate length.
	 */
	private mTruncate: number;

	/**
	 * CCHashInstance constructor.
	 *
	 * @param alg Digest algorithm.
	 * @param truncate Truncate length if any.
	 */
	constructor(alg: number, truncate = 0) {
		super();
		this.mDigest = { ...algorithm(alg), d: null, p: 0 };
		this.mTruncate = truncate;
	}

	public digestLength(): number {
		return this.mTruncate || this.mDigest.l;
	}

	public update(
		source: Reader | ArrayBuffer | ArrayBufferView<ArrayBuffer>,
	): Promise<void>;

	public update(
		source:
			| SizeIterator<ArrayBuffer | ArrayBufferView<ArrayBuffer>>
			| SizeAsyncIterator<ArrayBuffer | ArrayBufferView<ArrayBuffer>>,
		size: number,
	): Promise<void>;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @param size Source size.
	 * @returns Hash digest.
	 */
	public async update(
		source:
			| Reader
			| ArrayBuffer
			| ArrayBufferView<ArrayBuffer>
			| SizeIterator<ArrayBuffer | ArrayBufferView<ArrayBuffer>>
			| SizeAsyncIterator<ArrayBuffer | ArrayBufferView<ArrayBuffer>>,
		size?: number,
	): Promise<void> {
		const { mDigest } = this;
		const { s: N, n, p: s } = mDigest;
		if (s) {
			throw new Error('Already updated');
		}
		mDigest.p = 1;
		size ||= 0;
		const c = this.crypto || crypto.subtle;
		let d;

		if ('createHash' in c) {
			const hash = c.createHash(n);

			if ('arrayBuffer' in source) {
				const { size } = source;
				if ('write' in hash) {
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
						const v = new Uint8Array(b);
						// deno-lint-ignore no-await-in-loop
						await new Promise<void>((p, f) =>
							hash.write(v, (e) => e ? f(e) : p())
						);
					}
					await new Promise<void>((p, f) =>
						hash.end((e) => e ? f(e) : p())
					);
					d = hash.read();
				} else {
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
						hash.update(new Uint8Array(b));
					}
					d = hash.digest();
					await Promise.resolve();
				}
			} else if ('next' in source) {
				let a;
				let o = -size;
				if ('write' in hash) {
					try {
						let n;
						for (
							a = isPromise(n = source.next(PAGE_SIZE));;
							n = source.next(PAGE_SIZE)
						) {
							// deno-lint-ignore no-await-in-loop
							n = (a ? await n : n) as IR;
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
								const d = asUint8Array(b);
								// deno-lint-ignore no-await-in-loop
								await new Promise<void>((p, f) =>
									hash.write(d, (e) => e ? f(e) : p())
								);
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
					await new Promise<void>((p, f) =>
						hash.end((e) => e ? f(e) : p())
					);
					d = hash.read();
				} else {
					try {
						let n;
						for (
							a = isPromise(n = source.next(PAGE_SIZE));;
							n = source.next(PAGE_SIZE)
						) {
							// deno-lint-ignore no-await-in-loop
							n = (a ? await n : n) as IR;
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
								hash.update(asUint8Array(b));
							}
						}
					} finally {
						const r = source.return?.();
						if ((a = !!(a && r))) {
							await r;
						}
					}
					if (o) {
						throw new RangeError(`Read size off by: ${o}`);
					}
					d = hash.digest();
					if (!a) {
						await Promise.resolve();
					}
				}
			} else {
				const b = asUint8Array(source);
				if ('write' in hash) {
					await new Promise<void>((p, f) =>
						hash.write(b, (e) => e ? f(e) : p())
					);
					await new Promise<void>((p, f) =>
						hash.end((e) => e ? f(e) : p())
					);
					d = hash.read();
				} else {
					hash.update(b);
					d = hash.digest();
					await Promise.resolve();
				}
			}

			d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength).slice()
				.buffer;
		} else {
			if ('arrayBuffer' in source) {
				if (supportsAG.get(c.digest) !== false) {
					d = await subtleAG(c, N, readerAG(c, source));
				}
				if (!d) {
					const { size } = source;
					const v = await source.arrayBuffer();
					const o = size - v.byteLength;
					if (o) {
						throw new RangeError(`Read size off by: ${o}`);
					}
					d = await c.digest(N, v);
				}
			} else if ('next' in source) {
				if (supportsAG.get(c.digest) !== false) {
					d = await subtleAG(c, N, iteratorAG(c, source, size));
				}
				if (!d) {
					let a;
					let all: Uint8Array<ArrayBuffer> | undefined;
					let o = -size;
					let ps = size > 0 ? size : PAGE_SIZE;
					try {
						let n, i = 0;
						for (
							a = isPromise(n = source.next(ps));;
							n = source.next(ps)
						) {
							// deno-lint-ignore no-await-in-loop
							n = (a ? await n : n) as IR;
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
						const r = source.return?.();
						if (a && r) {
							await r;
						}
					}
					if (o) {
						throw new RangeError(`Read size off by: ${o}`);
					}
					d = await c.digest(N, all || new ArrayBuffer(0));
				}
			} else {
				d = await c.digest(N, asUint8Array(source));
			}
		}

		mDigest.d = d;
		mDigest.p = 2;
	}

	// deno-lint-ignore require-await
	public async finish(): Promise<ArrayBuffer> {
		const { mTruncate, mDigest } = this;
		const { p: s, d } = mDigest;
		switch (s) {
			case 0: {
				throw new Error('Not updated');
			}
			case 1: {
				throw new Error('Incomplete updated');
			}
			case 3: {
				throw new Error('Already finished');
			}
		}
		mDigest.p = 3;
		mDigest.d = null;
		return mTruncate ? d!.slice(0, mTruncate) : d!;
	}

	static {
		toStringTag(this, 'CCHashInstance');
	}
}
