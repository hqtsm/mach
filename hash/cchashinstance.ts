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
	type HashCrypto,
	type HashCryptoNodeStream,
	type HashCryptoNodeSync,
} from './dynamichash.ts';

// Workaround for missing types.
declare const crypto: {
	subtle: {
		digest: (
			alg: string,
			data: ArrayBufferView | ArrayBuffer,
		) => Promise<ArrayBuffer>;
	};
};

// Supported hash algorithms with their names and lengths.
const algorithims = new Map<number, [number, string, string]>([
	[kCCDigestSHA1, [20, 'SHA-1', 'sha1']],
	[kCCDigestSHA256, [32, 'SHA-256', 'sha256']],
	[kCCDigestSHA384, [48, 'SHA-384', 'sha384']],
	[kCCDigestSHA512, [64, 'SHA-512', 'sha512']],
]);

const algorithm = (alg: number): [number, string, string] => {
	const info = algorithims.get(alg);
	if (!info) {
		throw new RangeError(`Unsupported hash algorithm: ${alg}`);
	}
	return info;
};

const ender = (hash: HashCryptoNodeStream) =>
	new Promise<void>((p, f) => hash.end((e) => e ? f(e) : p()));

function callOnThis<T, U>(this: T, f: (t: T) => U): U {
	return f(this);
}

/**
 * CCHashInstance dynamic hash.
 */
export class CCHashInstance extends DynamicHash {
	/**
	 * Digest algorithm.
	 */
	private mDigest: number;

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
		algorithm(alg);
		super();
		this.mDigest = alg;
		this.mTruncate = truncate;
	}

	public digestLength(): number {
		return this.mTruncate || algorithm(this.mDigest)[0];
	}

	public async digest(
		source: Reader | ArrayBufferLike | ArrayBufferView,
	): Promise<ArrayBuffer> {
		const { mDigest, mTruncate } = this;
		const m = await CCHashInstance.digests(source, [mDigest], this.crypto);
		const digest = m.get(mDigest)!;
		return mTruncate ? digest.slice(0, mTruncate) : digest;
	}

	/**
	 * Hash digest multiple algorithms.
	 *
	 * @param source Source data.
	 * @param algorithms Hash algorithms.
	 * @param cry Hash crypto.
	 * @returns Hash digests.
	 */
	static async digests(
		source: Reader | ArrayBufferLike | ArrayBufferView,
		algorithms: Iterable<number>,
		cry: HashCrypto | null = null,
	): Promise<Map<number, ArrayBuffer>> {
		cry ||= crypto.subtle;
		const algos = new Map<number, [number, string, string]>();
		const r = new Map<number, ArrayBuffer | null>();
		for (const alg of algorithms) {
			algos.set(alg, algorithm(alg));
			r.set(alg, null);
		}

		if ('createHash' in cry) {
			const algosA: [number, HashCryptoNodeStream][] = [];
			const algosS: [number, HashCryptoNodeSync][] = [];
			const hashA: HashCryptoNodeStream[] = [];
			const hashS: HashCryptoNodeSync[] = [];
			const writes: ((data: Uint8Array) => Promise<void>)[] = [];
			let hasA = false;
			let hasS = false;
			for (const [alg, [, , name]] of algos) {
				const hash = cry.createHash(name);
				if ('write' in hash) {
					algosA.push([alg, hash]);
					hashA.push(hash);
					writes.push((data) =>
						new Promise<void>((p, f) =>
							hash.write(data, (e) => e ? f(e) : p())
						)
					);
					hasA = true;
				} else {
					algosS.push([alg, hash]);
					hashS.push(hash);
					hasS = true;
				}
			}
			if ('arrayBuffer' in source) {
				const { size } = source;
				let remaining = size;
				for (let o = 0; o < size; o += PAGE_SIZE) {
					const l = remaining > PAGE_SIZE ? PAGE_SIZE : remaining;
					// deno-lint-ignore no-await-in-loop
					const data = await source.slice(o, o + l).arrayBuffer();
					const diff = data.byteLength - l;
					if (diff) {
						throw new RangeError(`Read size off by: ${diff}`);
					}
					const view = new Uint8Array(data);
					if (hasA) {
						// deno-lint-ignore no-await-in-loop
						await Promise.all(writes.map(callOnThis, view));
					}
					if (hasS) {
						for (const hash of hashS) {
							hash.update(view);
						}
					}
					remaining -= l;
				}
			} else {
				const view = 'buffer' in source
					? new Uint8Array(
						source.buffer,
						source.byteOffset,
						source.byteLength,
					)
					: new Uint8Array(source);
				if (hasA) {
					await Promise.all(writes.map(callOnThis, view));
				}
				if (hasS) {
					for (const hash of hashS) {
						hash.update(view);
					}
				}
			}
			if (hasA) {
				await Promise.all(hashA.map(ender));
				for (const [alg, hash] of algosA) {
					r.set(alg, hash.read().buffer as ArrayBuffer);
				}
			}
			if (hasS) {
				for (const [alg, hash] of algosS) {
					r.set(alg, hash.digest().buffer as ArrayBuffer);
				}
			}
			return r as Map<number, ArrayBuffer>;
		}

		let data;
		if ('arrayBuffer' in source) {
			const { size } = source;
			data = await source.arrayBuffer();
			const diff = data.byteLength - size;
			if (diff) {
				throw new RangeError(`Read size off by: ${diff}`);
			}
		} else {
			data = (
				'buffer' in source
					? new Uint8Array(
						source.buffer,
						source.byteOffset,
						source.byteLength,
					)
					: new Uint8Array(source)
			).slice(0);
		}
		for (const [alg, [, NAME]] of algos) {
			// deno-lint-ignore no-await-in-loop
			r.set(alg, await cry.digest(NAME, data));
		}
		return r as Map<number, ArrayBuffer>;
	}

	static {
		toStringTag(this, 'CCHashInstance');
	}
}
