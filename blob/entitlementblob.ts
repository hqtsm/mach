import { constant, type Ptr, Uint8Ptr } from '@hqtsm/struct';
import { kSecCodeMagicEntitlement } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * For embedding entitlement configuration data.
 */
export class EntitlementBlob extends Blob {
	declare public readonly ['constructor']: Omit<
		typeof EntitlementBlob,
		'new'
	>;

	/**
	 * Entitlements data.
	 *
	 * @returns Pointer starting from entitlements.
	 */
	public get body(): Ptr<number> {
		return new Uint8Ptr(this.buffer, this.byteOffset + 8);
	}

	/**
	 * Entitlements length.
	 *
	 * @returns Byte length.
	 */
	public get bodyLength(): number {
		return this.length - 8;
	}

	public static override readonly typeMagic = kSecCodeMagicEntitlement;

	static {
		constant(this, 'typeMagic');
	}
}
