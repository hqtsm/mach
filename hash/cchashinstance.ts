import type { ArrayBufferReal, BufferView } from '@hqtsm/struct';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
} from '../const.ts';
import { DynamicHash } from './dynamichash.ts';

// Workaround for missing types.
declare const crypto: {
	subtle: {
		digest: (alg: string, data: ArrayBuffer) => Promise<ArrayBuffer>;
	};
};
declare function structuredClone<T>(
	value: T,
	options?: {
		transfer?: ArrayBufferReal[];
	},
): T;

// Supported hash algorithms with their Web Crypto names and lengths.
const algorithims = new Map<number, [string, number]>([
	[kCCDigestSHA1, ['SHA-1', 20]],
	[kCCDigestSHA256, ['SHA-256', 32]],
	[kCCDigestSHA384, ['SHA-384', 48]],
	[kCCDigestSHA512, ['SHA-512', 64]],
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
	 * Data buffer.
	 * Web Crypto digest lacks streaming support.
	 * No choice but to buffer all the data.
	 */
	private mData: ArrayBuffer[] | null;

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
		this.mData = [];
	}

	public digestLength(): number {
		return this.mTruncate || algorithims.get(this.mDigest)![1];
	}

	// deno-lint-ignore require-await
	public async update(data: BufferView, transfer?: boolean): Promise<void> {
		const mData = this.mData;
		if (!mData) {
			throw new Error('Digest finished');
		}
		const { buffer, byteOffset, byteLength } = data;
		if (!transfer) {
			mData.push(buffer.slice(byteOffset, byteOffset + byteLength));
			return;
		}
		let b = structuredClone(buffer, { transfer: [buffer] });
		if (byteOffset || byteLength !== b.byteLength || buffer.byteLength) {
			b = b.slice(byteOffset, byteOffset + byteLength);
		}
		mData.push(b);
	}

	public async finish(): Promise<ArrayBuffer> {
		const [name] = algorithims.get(this.mDigest)!;
		const { mTruncate } = this;
		const mData = this.mData;
		if (!mData) {
			throw new Error('Digest finished');
		}
		let total = 0;
		for (const data of mData) {
			total += data.byteLength;
		}
		const buffer = new Uint8Array(total);
		this.mData = null;
		for (let b, offset = 0; mData.length; offset += b.byteLength) {
			buffer.set(new Uint8Array(b = mData.shift()!), offset);
		}
		const digest = await crypto.subtle.digest(name, buffer);
		return mTruncate ? digest.slice(0, mTruncate) : digest;
	}
}
