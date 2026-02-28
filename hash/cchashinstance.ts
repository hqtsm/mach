import { toStringTag } from '@hqtsm/class';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
	PAGE_SIZE,
} from '../const.ts';
import {
	DynamicHash,
	type HashCryptoSubtle,
	type HashSource,
} from './dynamichash.ts';

// Workaround for missing types.
declare const crypto: {
	subtle: HashCryptoSubtle;
};

interface Algo {
	l: number;
	N: string;
	n: string;
}

interface Digest extends Algo {
	d: ArrayBuffer | null;
	s: number;
}

type IR = IteratorResult<ArrayBufferLike | ArrayBufferView>;

// Supported hash algorithms with their names and lengths.
const algorithims = new Map<number, Algo>([
	[kCCDigestSHA1, { l: 20, N: 'SHA-1', n: 'sha1' }],
	[kCCDigestSHA256, { l: 32, N: 'SHA-256', n: 'sha256' }],
	[kCCDigestSHA384, { l: 48, N: 'SHA-384', n: 'sha384' }],
	[kCCDigestSHA512, { l: 64, N: 'SHA-512', n: 'sha512' }],
]);

const algorithm = (alg: number): Algo => {
	const info = algorithims.get(alg);
	if (!info) {
		throw new RangeError(`Unsupported hash algorithm: ${alg}`);
	}
	return info;
};

const view = (b: ArrayBufferLike | ArrayBufferView): Uint8Array =>
	'buffer' in b
		? new Uint8Array(b.buffer, b.byteOffset, b.byteLength)
		: new Uint8Array(b);

const shared = (b: SharedArrayBuffer | ArrayBuffer): b is SharedArrayBuffer =>
	Object.prototype.toString.call(b) === '[object SharedArrayBuffer]';

const viewab = (
	view: Uint8Array,
): Uint8Array<
	ArrayBuffer
> => (shared(view.buffer) ? view.slice() : view as Uint8Array<ArrayBuffer>);

const ip = (
	v: IteratorResult<unknown> | Promise<unknown>,
): v is Promise<unknown> => 'then' in v;

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
		const a = algorithm(alg);
		super();
		this.mDigest = { ...a, d: null, s: 0 };
		this.mTruncate = truncate;
	}

	public digestLength(): number {
		return this.mTruncate || this.mDigest.l;
	}

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @param size Source size.
	 * @returns Hash digest.
	 */
	public async update(source: HashSource, size?: number): Promise<void> {
		const { mDigest } = this;
		const { N, n, s } = mDigest;
		if (s) {
			throw new Error('Already updated');
		}
		mDigest.s = 1;
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
						const o = b.byteLength - l;
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
						const o = b.byteLength - l;
						if (o) {
							throw new RangeError(`Read size off by: ${o}`);
						}
						hash.update(new Uint8Array(b));
					}
					d = hash.digest();
				}
			} else if ('next' in source) {
				let o = -size;
				if ('write' in hash) {
					for (
						let n = source.next(PAGE_SIZE), a = ip(n);;
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
							const d = view(b);
							// deno-lint-ignore no-await-in-loop
							await new Promise<void>((p, f) =>
								hash.write(d, (e) => e ? f(e) : p())
							);
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
					for (
						let n = source.next(PAGE_SIZE), a = ip(n);;
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
							hash.update(view(b));
						}
					}
					if (o) {
						throw new RangeError(`Read size off by: ${o}`);
					}
					d = hash.digest();
				}
			} else {
				const b = view(source);
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
				}
			}

			d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength)
				.slice(0)
				.buffer;
		} else {
			if ('arrayBuffer' in source) {
				const { size } = source;
				const v = await source.arrayBuffer();
				const o = v.byteLength - size;
				if (o) {
					throw new RangeError(`Read size off by: ${o}`);
				}
				d = await c.digest(N, v);
			} else if ('next' in source) {
				let all: Uint8Array<ArrayBuffer> | undefined;
				let o = -size;
				for (
					let i = 0, ps = size, n = source.next(ps), a = ip(n);;
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
							all.set(view(b), i);
						} else {
							if (o) {
								all = new Uint8Array(size);
								all.set(view(b));
							} else {
								all = viewab(view(b));
							}
							ps = PAGE_SIZE;
						}
						i += l;
					}
				}
				if (o) {
					throw new RangeError(`Read size off by: ${o}`);
				}
				d = await c.digest(N, all || new ArrayBuffer(0));
			} else {
				d = await c.digest(N, viewab(view(source)));
			}
		}

		mDigest.d = d;
		mDigest.s = 2;
	}

	// deno-lint-ignore require-await
	public async finish(): Promise<ArrayBuffer> {
		const { mTruncate, mDigest } = this;
		const { s, d } = mDigest;
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
		mDigest.s = 3;
		mDigest.d = null;
		return mTruncate ? d!.slice(0, mTruncate) : d!;
	}

	static {
		toStringTag(this, 'CCHashInstance');
	}
}
