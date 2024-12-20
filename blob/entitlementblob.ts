import { kSecCodeMagicEntitlement } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * For embedding entitlement configuration data.
 */
export class EntitlementBlob extends Blob {
	declare public readonly ['constructor']: typeof EntitlementBlob;

	/**
	 * Entitlements data.
	 *
	 * @returns View starting from entitlements.
	 */
	public get body(): Uint8Array {
		return new Uint8Array(this.buffer, this.byteOffset + 8);
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
}
