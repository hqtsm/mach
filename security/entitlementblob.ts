import { constant, toStringTag } from '@hqtsm/class';
import { Blob } from './blob.ts';
import { kSecCodeMagicEntitlement } from './CSCommonPriv.ts';

/**
 * For embedding entitlement configuration data.
 */
export class EntitlementBlob extends Blob {
	public static override readonly typeMagic = kSecCodeMagicEntitlement;

	static {
		toStringTag(this, 'EntitlementBlob');
		constant(this, 'typeMagic');
	}
}
