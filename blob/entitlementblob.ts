import { type Class, constant, toStringTag } from '@hqtsm/class';
import { kSecCodeMagicEntitlement } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * For embedding entitlement configuration data.
 */
export class EntitlementBlob extends Blob {
	declare public readonly ['constructor']: Class<typeof EntitlementBlob>;

	public static override readonly typeMagic = kSecCodeMagicEntitlement;

	static {
		toStringTag(this, 'EntitlementBlob');
		constant(this, 'typeMagic');
	}
}
