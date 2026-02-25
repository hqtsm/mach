import { toStringTag } from '@hqtsm/class';
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

const algorithm = (alg: number): [number, string, string] => {
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
		const { mTruncate } = this;
		const cry = this.crypto || crypto.subtle;
		const [, NAME, name] = algorithm(this.mDigest);

		if ('createHash' in cry) {
			let digest: {
				buffer: ArrayBuffer;
				byteLength: number;
				byteOffset: number;
			};
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
						await new Promise<void>((p, f) =>
							hash.write(
								new Uint8Array(data),
								(e) => e ? f(e) : p(),
							)
						);
					} else {
						hash.update(new Uint8Array(data));
					}
					remaining -= l;
				}
				if (asyn) {
					await new Promise<void>((p, f) =>
						hash.end((e) => e ? f(e) : p())
					);
					digest = hash.read() as typeof digest;
				} else {
					digest = hash.digest() as typeof digest;
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
					await new Promise<void>((p, f) =>
						hash.write(data, (e) => {
							if (e) {
								f(e);
							} else {
								hash.end((e) => e ? f(e) : p());
							}
						})
					);
					digest = hash.read() as typeof digest;
				} else {
					hash.update(data);
					digest = hash.digest() as typeof digest;
				}
			}
			const o = digest.byteOffset;
			return digest.buffer.slice(o, o + (mTruncate || digest.byteLength));
		}

		let digest: ArrayBuffer;
		if ('arrayBuffer' in source) {
			const { size } = source;
			digest = await source.arrayBuffer().then((data) => {
				const diff = data.byteLength - size;
				if (diff) {
					throw new RangeError(`Read size off by: ${diff}`);
				}
				return cry.digest(NAME, data);
			});
		} else {
			digest = await cry.digest(
				NAME,
				(
					'buffer' in source
						? new Uint8Array(
							source.buffer,
							source.byteOffset,
							source.byteLength,
						)
						: new Uint8Array(source)
				).slice(0),
			);
		}
		return mTruncate ? digest.slice(0, mTruncate) : digest;
	}

	static {
		toStringTag(this, 'CCHashInstance');
	}
}
