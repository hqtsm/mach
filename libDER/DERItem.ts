import type { Ptr } from '@hqtsm/struct';
import type { DERByte, DERSize } from './libDER_config.ts';

/**
 * DER item.
 */
export class DERItem {
	/**
	 * DER data.
	 */
	public data: Ptr<DERByte> | null = null;

	/**
	 * DER length.
	 */
	public length: DERSize = 0;
}
