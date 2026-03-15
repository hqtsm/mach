import { constant, toStringTag } from '@hqtsm/class';
import { kSecCodeMagicEntitlement } from '../const.ts';
import { Blob } from './blob.ts';

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
