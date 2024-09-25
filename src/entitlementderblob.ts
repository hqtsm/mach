import {Blob} from './blob.ts';
import {kSecCodeMagicEntitlementDER} from './const.ts';

/**
 * Entitlement DER Blob.
 */
export class EntitlementDERBlob extends Blob {
	public declare readonly ['constructor']: typeof EntitlementDERBlob;

	/**
	 * DER data.
	 *
	 * @returns View starting from DER.
	 */
	public get der() {
		return new Uint8Array(this.buffer, this.byteOffset + 8);
	}

	/**
	 * DER length.
	 *
	 * @returns Byte length.
	 */
	public get derLength() {
		return this.length - 8;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = kSecCodeMagicEntitlementDER;
}
