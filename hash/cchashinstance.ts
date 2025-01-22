import type { ArrayBufferReal, BufferView } from '@hqtsm/struct';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
	PAGE_SIZE,
} from '../const.ts';
import type { Reader } from '../util/reader.ts';
import { DynamicHash } from './dynamichash.ts';

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
		if (!algorithims.has(alg)) {
			throw new RangeError(`Unsupported hash algorithm: ${alg}`);
		}
		super();
		this.mDigest = alg;
		this.mTruncate = truncate;
	}

	public digestLength(): number {
		return this.mTruncate || algorithims.get(this.mDigest)![0];
	}

	public async digest(
		source: Reader | ArrayBufferReal | BufferView,
	): Promise<ArrayBuffer> {
		const { mTruncate } = this;
		const cry = this.crypto || crypto.subtle;
		const [, NAME, name] = algorithims.get(this.mDigest)!;
		let digest;

		if ('createHash' in cry) {
			const hash = cry.createHash(name);
			const asyn = 'write' in hash;

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
					if (asyn) {
						// deno-lint-ignore no-await-in-loop
						await new Promise((p, f) =>
							hash.write(
								new Uint8Array(data),
								(e) => e ? f(e) : p(0),
							)
						);
					} else {
						hash.update(new Uint8Array(data));
					}
					remaining -= l;
				}
				if (asyn) {
					await new Promise((p, f) =>
						hash.end((e) => e ? f(e) : p(0))
					);
					digest = hash.read();
				} else {
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
				if (asyn) {
					await new Promise((p, f) =>
						hash.write(data, (e) => e ? f(e) : p(0))
					);
					await new Promise((p, f) =>
						hash.end((e) => e ? f(e) : p(0))
					);
					digest = hash.read();
				} else {
					hash.update(data);
					digest = hash.digest();
				}
			}
			const o = digest.byteOffset;
			return digest.buffer.slice(o, o + (mTruncate || digest.byteLength));
		}

		if ('arrayBuffer' in source) {
			const { size } = source;
			digest = await cry.digest(
				NAME,
				await source.arrayBuffer().then((data) => {
					const diff = data.byteLength - size;
					if (diff) {
						throw new RangeError(`Read size off by: ${diff}`);
					}
					return data;
				}),
			);
		} else {
			digest = await cry.digest(
				NAME,
				'buffer' in source
					? new Uint8Array(
						source.buffer,
						source.byteOffset,
						source.byteLength,
					)
					: source,
			);
		}
		return mTruncate ? digest.slice(0, mTruncate) : digest;
	}
}
