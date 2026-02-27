import { toStringTag } from '@hqtsm/class';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
	PAGE_SIZE,
} from '../const.ts';
import type { Reader } from '../util/reader.ts';
import {
	DynamicHash,
	type HashCryptoNodeStream,
	type HashCryptoSubtle,
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

	public async update(
		source: Reader | ArrayBufferLike | ArrayBufferView,
	): Promise<void> {
		const { mDigest } = this;
		const { N, n, s } = mDigest;
		if (s) {
			throw new Error('Already updated');
		}
		mDigest.s = 1;
		const c = this.crypto || crypto.subtle;
		let digest;

		if ('createHash' in c) {
			const hash = c.createHash(n);

			if ('arrayBuffer' in source) {
				const { size } = source;
				const read = async (o: number, l: number) => {
					const data = new Uint8Array(
						await source.slice(o, o + l).arrayBuffer(),
					);
					const diff = data.byteLength - l;
					if (diff) {
						throw new RangeError(`Read size off by: ${diff}`);
					}
					return data;
				};
				if ('write' in hash) {
					for (let o = 0, r = size, l; o < size; o += PAGE_SIZE) {
						// deno-lint-ignore no-await-in-loop
						const data = await read(
							o,
							l = r > PAGE_SIZE ? PAGE_SIZE : r,
						);
						// deno-lint-ignore no-await-in-loop
						await new Promise<void>((p, f) =>
							hash.write(data, (e) => e ? f(e) : p())
						);
						r -= l;
					}
					await new Promise<void>((p, f) =>
						hash.end((e) => e ? f(e) : p())
					);
					digest = hash.read();
				} else {
					for (let o = 0, r = size, l; o < size; o += PAGE_SIZE) {
						hash.update(
							// deno-lint-ignore no-await-in-loop
							await read(
								o,
								l = r > PAGE_SIZE ? PAGE_SIZE : r,
							),
						);
						r -= l;
					}
					digest = hash.digest();
				}
			} else {
				const data = 'buffer' in source
					? new Uint8Array(
						source.buffer,
						source.byteOffset,
						source.byteLength,
					)
					: new Uint8Array(source);
				if ('write' in hash) {
					await new Promise<void>((p, f) =>
						hash.write(data, (e) => e ? f(e) : p())
					);
					await new Promise<void>((p, f) =>
						hash.end((e) => e ? f(e) : p())
					);
					digest = hash.read();
				} else {
					hash.update(data);
					digest = hash.digest();
				}
			}

			digest = new Uint8Array(
				digest.buffer,
				digest.byteOffset,
				digest.byteLength,
			).slice(0).buffer;
		} else {
			if ('arrayBuffer' in source) {
				const { size } = source;
				const data = await source.arrayBuffer();
				const diff = data.byteLength - size;
				if (diff) {
					throw new RangeError(`Read size off by: ${diff}`);
				}
				digest = await c.digest(N, data);
			} else {
				const data = 'buffer' in source
					? new Uint8Array(
						source.buffer,
						source.byteOffset,
						source.byteLength,
					)
					: new Uint8Array(source);
				try {
					digest = await c.digest(N, data as Uint8Array<ArrayBuffer>);
				} catch (_) {
					digest = await c.digest(N, data.slice(0));
				}
			}
		}

		mDigest.d = digest;
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
