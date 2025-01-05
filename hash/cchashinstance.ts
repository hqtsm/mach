import type { BufferView } from '@hqtsm/struct';
import {
	kCCDigestSHA1,
	kCCDigestSHA256,
	kCCDigestSHA384,
	kCCDigestSHA512,
} from '../const.ts';
import { DynamicHash } from './dynamichash.ts';

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
			throw new Error(`Unsupported hash algorithm: ${alg}`);
		}
		super();
		this.mDigest = alg;
		this.mTruncate = truncate;
		this.mData = [];
	}

	override digestLength(): number {
		return this.mTruncate || algorithims.get(this.mDigest)![1];
	}

	// deno-lint-ignore require-await
	override async update(data: BufferView): Promise<void> {
		const { buffer, byteOffset, byteLength } = data;
		this.mData!.push(buffer.slice(byteOffset, byteOffset + byteLength));
	}

	override async finish(): Promise<ArrayBuffer> {
		const [name] = algorithims.get(this.mDigest)!;
		const { mTruncate } = this;
		const mData = this.mData!;
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
		return mTruncate ? digest.slice(0, this.mTruncate) : digest;
	}
}
