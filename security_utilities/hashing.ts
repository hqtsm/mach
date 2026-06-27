import { constant, toStringTag } from '@hqtsm/class';
import type { ArrayBufferPointer } from '@hqtsm/struct';
import {
	CC_SHA1_DIGEST_LENGTH,
	CC_SHA256_DIGEST_LENGTH,
	type CCDigestAlg,
	CCDigestCreate,
	CCDigestFinal,
	CCDigestOutputSize,
	type CCDigestRef,
	CCDigestUpdate,
	kCCDigestSHA1,
	kCCDigestSHA256,
} from '../CommonCrypto/mod.ts';
import {
	type ArrayBufferData,
	pointerBytes,
	type Reader,
	type SizeAsyncIterator,
	type SizeIterator,
	type SubtleCryptoDigest,
} from '../helpers/mod.ts';
import {
	type bool,
	ENOMEM,
	memcmp,
	type size_t,
	type uchar,
} from '../libc/mod.ts';
import { Security_UnixError } from './errors.ts';

/**
 * Hashing Byte.
 */
export type Security_Hashing_Byte = uchar;

/**
 * Base class for all hash objects.
 */
export class Security_Hashing {
	static {
		toStringTag(this, 'Security_Hashing');
	}
}

/**
 * Static hasher.
 */
export abstract class Security_Hash extends Security_Hashing {
	/**
	 * Digest length.
	 */
	public static readonly digestLength: number = 0;

	/**
	 * Digest instance.
	 */
	protected abstract readonly mDigest: CCDigestRef;

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
		length: size_t,
	): Promise<void>;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @param length Source size.
	 * @returns Hash digest.
	 */
	public async update(
		source:
			| Reader
			| ArrayBufferData
			| ArrayBufferPointer<ArrayBuffer>
			| SizeIterator<ArrayBufferData>
			| SizeAsyncIterator<ArrayBufferData>,
		length?: size_t,
	): Promise<void> {
		const { subtle, mDigest } = this;
		mDigest.subtle = subtle;
		await CCDigestUpdate(
			mDigest,
			source as ArrayBufferPointer<ArrayBuffer>,
			length!,
		);
	}

	public async finish(
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<void> {
		const { subtle, mDigest } = this;
		mDigest.subtle = subtle;
		await CCDigestFinal(mDigest, digest);
	}

	/**
	 * Verify digest.
	 *
	 * @param _this This.
	 * @param digest Digest to verify against.
	 * @returns True if verified, false if not.
	 */
	public static async verify(
		_this: Security_Hash,
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<bool> {
		const l = this.digestLength;
		const d = new ArrayBuffer(l);
		await _this.finish(d);
		return !memcmp(d, digest, l);
	}

	/**
	 * Hash crypto.
	 */
	public subtle?: SubtleCryptoDigest | null;

	static {
		toStringTag(this, 'Security_Hash');
		constant(this, 'digestLength');
	}
}

/**
 * Dynamic hash.
 */
export abstract class Security_DynamicHash extends Security_Hashing {
	/**
	 * Get the digest length.
	 *
	 * @returns Digest byte length.
	 */
	public abstract digestLength(): size_t;

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
	 * @param length Source size.
	 * @returns Hash digest.
	 */
	public abstract update(
		source:
			| ArrayBufferPointer<ArrayBuffer>
			| SizeIterator<ArrayBufferData>
			| SizeAsyncIterator<ArrayBufferData>,
		length: size_t,
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
		_this: Security_DynamicHash,
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<bool> {
		const l = _this.digestLength();
		const d = new ArrayBuffer(l);
		await _this.finish(d);
		return !memcmp(d, digest, l);
	}

	/**
	 * Hash crypto.
	 */
	public subtle?: SubtleCryptoDigest | null;

	static {
		toStringTag(this, 'Security_DynamicHash');
	}
}

/**
 * CCHashInstance dynamic hash.
 */
export class Security_CCHashInstance extends Security_DynamicHash {
	/**
	 * CCHashInstance constructor.
	 *
	 * @param alg Digest algorithm.
	 * @param truncate Truncate length if any.
	 */
	constructor(alg: CCDigestAlg, truncate: size_t = 0) {
		super();
		const d = CCDigestCreate(alg);
		if (!d) {
			// More likely invalid algorithm.
			Security_UnixError.throwMe(ENOMEM);
		}
		this.mDigest = d;
		this.mTruncate = truncate;
	}

	public digestLength(): size_t {
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
		length: size_t,
	): Promise<void>;

	/**
	 * Update digest, can only be called once.
	 *
	 * @param source Source data.
	 * @param length Source size.
	 * @returns Hash digest.
	 */
	public async update(
		source:
			| Reader
			| ArrayBufferData
			| ArrayBufferPointer<ArrayBuffer>
			| SizeIterator<ArrayBufferData>
			| SizeAsyncIterator<ArrayBufferData>,
		length?: size_t,
	): Promise<void> {
		const { subtle, mDigest } = this;
		mDigest.subtle = subtle;
		await CCDigestUpdate(
			mDigest,
			source as ArrayBufferPointer<ArrayBuffer>,
			length!,
		);
	}

	public async finish(
		digest: ArrayBufferLike | ArrayBufferPointer,
	): Promise<void> {
		const { subtle, mTruncate, mDigest } = this;
		mDigest.subtle = subtle;
		if (mTruncate) {
			const d = new ArrayBuffer(CCDigestOutputSize(mDigest));
			await CCDigestFinal(mDigest, d);
			pointerBytes(digest, mTruncate).set(
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
	private mTruncate: size_t;

	static {
		toStringTag(this, 'Security_CCHashInstance');
	}
}

/**
 * SHA1 hash.
 */
export class Security_SHA1 extends Security_Hash {
	public static override readonly digestLength = CC_SHA1_DIGEST_LENGTH;

	protected readonly mDigest: CCDigestRef = CCDigestCreate(kCCDigestSHA1)!;

	static {
		toStringTag(this, 'Security_SHA1');
		constant(this, 'digestLength');
	}
}

/**
 * SHA256 hash.
 */
export class Security_SHA256 extends Security_Hash {
	public static override readonly digestLength = CC_SHA256_DIGEST_LENGTH;

	protected readonly mDigest: CCDigestRef = CCDigestCreate(kCCDigestSHA256)!;

	static {
		toStringTag(this, 'Security_SHA256');
		constant(this, 'digestLength');
	}
}
