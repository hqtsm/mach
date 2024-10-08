import {kSecCodeMagicEntitlementDER} from '../const.ts';
import {constant} from '../util.ts';

import {Blob} from './blob.ts';

/**
 * For embedding entitlement configuration data, in DER format.
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

	static {
		constant(this, 'typeMagic', kSecCodeMagicEntitlementDER);
	}
}
