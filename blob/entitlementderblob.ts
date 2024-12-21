import { constant, type Ptr, Uint8Ptr } from '@hqtsm/struct';
import { kSecCodeMagicEntitlementDER } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * For embedding entitlement configuration data, in DER format.
 */
export class EntitlementDERBlob extends Blob {
	declare public readonly ['constructor']: Omit<
		typeof EntitlementDERBlob,
		'new'
	>;

	/**
	 * DER data.
	 *
	 * @returns Pointer starting from DER.
	 */
	public get der(): Ptr<number> {
		return new Uint8Ptr(this.buffer, this.byteOffset + 8);
	}

	/**
	 * DER length.
	 *
	 * @returns Byte length.
	 */
	public get derLength(): number {
		return this.length - 8;
	}

	public static override readonly typeMagic = kSecCodeMagicEntitlementDER;

	static {
		constant(this, 'typeMagic');
	}
}
