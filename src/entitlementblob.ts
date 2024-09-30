import {Blob} from './blob.ts';
import {kSecCodeMagicEntitlement} from './const.ts';

/**
 * For embedding entitlement configuration data.
 */
export class EntitlementBlob extends Blob(kSecCodeMagicEntitlement) {
	public declare readonly ['constructor']: typeof EntitlementBlob;

	/**
	 * Entitlements data.
	 *
	 * @returns View starting from entitlements.
	 */
	public get body() {
		return new Uint8Array(this.buffer, this.byteOffset + 8);
	}

	/**
	 * Entitlements length.
	 *
	 * @returns Byte length.
	 */
	public get bodyLength() {
		return this.length - 8;
	}
}
