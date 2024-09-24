import {Blob} from './blob.ts';
import {kSecCodeMagicEntitlement} from './const.ts';
import {subview} from './util.ts';

/**
 * Entitlement Blob.
 */
export class EntitlementBlob extends Blob {
	public declare readonly ['constructor']: typeof EntitlementBlob;

	/**
	 * Entitlements data.
	 *
	 * @returns View of entitlements data.
	 */
	public get body() {
		return subview(
			Uint8Array,
			this.dataView,
			8,
			Math.max(this.bodyLength, 0)
		);
	}

	/**
	 * Entitlements length.
	 *
	 * @returns Byte length.
	 */
	public get bodyLength() {
		return this.length - 8;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = kSecCodeMagicEntitlement;
}
