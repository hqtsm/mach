import type { ArrayBufferReal, BufferView } from '@hqtsm/struct';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
} from '../const.ts';
import { DynamicHash } from './dynamichash.ts';
import type { Reader } from '../util/reader.ts';

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
const algorithims = new Map<number, [number, string]>([
	[kCCDigestSHA1, [20, 'SHA-1']],
	[kCCDigestSHA256, [32, 'SHA-256']],
	[kCCDigestSHA384, [48, 'SHA-384']],
	[kCCDigestSHA512, [64, 'SHA-512']],
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
		const [, name] = algorithims.get(this.mDigest)!;
		let digest;
		if ('arrayBuffer' in source) {
			const { size } = source;
			digest = await crypto.subtle.digest(
				name,
				await source.arrayBuffer().then((d) => {
					const diff = d.byteLength - size;
					if (diff) {
						throw new RangeError(`Read size off by: ${diff}`);
					}
					return d;
				}),
			);
		} else {
			digest = await crypto.subtle.digest(
				name,
				'buffer' in source
					? source = new Uint8Array(
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
