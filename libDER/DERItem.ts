import { toStringTag } from '@hqtsm/class';
import type { Ptr } from '@hqtsm/struct';
import type { DERByte, DERSize } from './libDER_config.ts';

/**
 * DER item.
 */
export class DERItem {
	/**
	 * Constructor.
	 *
	 * @param data DER data.
	 * @param length DER length.
	 */
	constructor(
		data: Ptr<DERByte> | null = null,
		length: DERSize = 0,
	) {
		this.data = data;
		this.length = length;
	}

	/**
	 * DER data.
	 */
	public data: Ptr<DERByte> | null;

	/**
	 * DER length.
	 */
	public length: DERSize;

	static {
		toStringTag(this, 'DERItem');
	}
}
