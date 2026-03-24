import { toStringTag } from '@hqtsm/class/symbol';
import type { ArrayBufferPointer } from '@hqtsm/struct';
import {
	CCDigestCreate,
	CCDigestFinal,
	CCDigestOutputSize,
	type CCDigestRef,
	CCDigestUpdate,
} from '../CommonCrypto/CommonDigest.ts';
import { ENOMEM } from '../libc/errno.ts';
import type { SubtleCryptoDigest } from '../util/crypto.ts';
import type { SizeAsyncIterator, SizeIterator } from '../util/iterator.ts';
import { type ArrayBufferData, asUint8Array } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
import { UnixError } from './errors.ts';

/**
 * Base class for all hash objects.
 */
export class Hashing {
	static {
		toStringTag(this, 'Hashing');
	}
}

/**
 * Dynamic hash.
 */
export abstract class DynamicHash extends Hashing {
	/**
	 * Get the digest length.
	 *
	 * @returns Digest byte length.
	 */
	public abstract digestLength(): number;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @returns Hash digest.
	 */
	public abstract update(
		source:
			| Reader
			| ArrayBufferData,
	): Promise<void>;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @param size Source size.
	 * @returns Hash digest.
	 */
	public abstract update(
		source:
			| ArrayBufferPointer<ArrayBuffer>
			| SizeIterator<ArrayBufferData>
			| SizeAsyncIterator<ArrayBufferData>,
		size: number,
	): Promise<void>;

	/**
	 * Finish hash, can only be called once.
	 *
	 * @param digest Digest.
	 * @returns Promise.
	 */
	public abstract finish(
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<void>;

	/**
	 * Verify digest.
	 *
	 * @param _this This.
	 * @param digest Digest to verify against.
	 * @returns True if verified, false if not.
	 */
	public static async verify(
		_this: DynamicHash,
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<boolean> {
		const l = _this.digestLength();
		const d = new Uint8Array(l);
		await _this.finish(d);
		const e = asUint8Array(digest, l);
		let diff = 0;
		for (let i = 0; i < l; i++) {
			diff |= d[i] ^ e[i];
		}
		return !diff;
	}

	/**
	 * Hash crypto.
	 */
	public crypto: SubtleCryptoDigest | null = null;

	static {
		toStringTag(this, 'DynamicHash');
	}
}

/**
 * CCHashInstance dynamic hash.
 */
export class CCHashInstance extends DynamicHash {
	/**
	 * CCHashInstance constructor.
	 *
	 * @param alg Digest algorithm.
	 * @param truncate Truncate length if any.
	 */
	constructor(alg: number, truncate = 0) {
		super();
		const d = CCDigestCreate(alg);
		if (!d) {
			// More likely invalid algorithm.
			UnixError.throwMe(ENOMEM);
		}
		this.mDigest = d;
		this.mTruncate = truncate;
	}

	public digestLength(): number {
		return this.mTruncate || CCDigestOutputSize(this.mDigest);
	}

	public update(
		source:
			| Reader
			| ArrayBufferData,
	): Promise<void>;

	public update(
		source:
			| ArrayBufferPointer<ArrayBuffer>
			| SizeIterator<ArrayBufferData>
			| SizeAsyncIterator<ArrayBufferData>,
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
			| ArrayBufferData
			| ArrayBufferPointer<ArrayBuffer>
			| SizeIterator<ArrayBufferData>
			| SizeAsyncIterator<ArrayBufferData>,
		size?: number,
	): Promise<void> {
		const { crypto, mDigest } = this;
		mDigest.crypto = crypto;
		await CCDigestUpdate(
			mDigest,
			source as ArrayBufferPointer<ArrayBuffer>,
			size!,
		);
	}

	public async finish(
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<void> {
		const { crypto, mTruncate, mDigest } = this;
		mDigest.crypto = crypto;
		if (mTruncate) {
			const d = new ArrayBuffer(CCDigestOutputSize(mDigest));
			await CCDigestFinal(mDigest, d);
			asUint8Array(digest, mTruncate).set(
				new Uint8Array(d, 0, mTruncate),
			);
		} else {
			await CCDigestFinal(mDigest, digest);
		}
	}

	/**
	 * Digest algorithm.
	 */
	private mDigest: CCDigestRef;

	/**
	 * Truncate length.
	 */
	private mTruncate: number;

	static {
		toStringTag(this, 'CCHashInstance');
	}
}
