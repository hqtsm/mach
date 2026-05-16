import { toStringTag } from '@hqtsm/class';
import type { Ptr } from '@hqtsm/struct';
import type { size_t } from '../libc/stddef.ts';
import type { uint8_t } from '../libc/stdint.ts';

/**
 * CSSM data.
 */
export class cssm_data {
	/**
	 * Data length.
	 */
	public Length: size_t = 0;

	/**
	 * Data pointer.
	 */
	public Data: Ptr<uint8_t> | null = null;

	static {
		toStringTag(this, 'cssm_data');
	}
}

/**
 * ASN.1 item.
 */
export type SecAsn1Item = cssm_data;

/**
 * ASN.1 OID.
 */
export type SecAsn1Oid = cssm_data;
