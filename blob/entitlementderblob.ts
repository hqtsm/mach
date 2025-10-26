import { constant, Uint8Ptr } from '@hqtsm/struct';
import { kSecCodeMagicEntitlementDER } from '../const.ts';
import { type BlobConstructor, templateBlob } from './blob.ts';

const Blob: BlobConstructor<
	EntitlementDERBlob,
	typeof kSecCodeMagicEntitlementDER
> = templateBlob(
	() => EntitlementDERBlob,
	kSecCodeMagicEntitlementDER,
);

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
	 * @returns Data pointer.
	 */
	public der(): Uint8Ptr {
		return new Uint8Ptr(
			this.buffer,
			this.byteOffset + 8,
			this.littleEndian,
		);
	}

	/**
	 * DER length.
	 *
	 * @returns Byte length.
	 */
	public derLength(): number {
		return this.length() - 8;
	}

	public static override readonly typeMagic = kSecCodeMagicEntitlementDER;

	static {
		constant(this, 'typeMagic');
	}
}
