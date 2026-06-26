import { toStringTag } from '@hqtsm/class';
import { DERItem } from './DERItem.ts';

/**
 * DER attribute type and value.
 */
export class DERAttributeTypeAndValue {
	/**
	 * Type.
	 */
	public type: DERItem;

	/**
	 * Value.
	 */
	public value: DERItem;

	/**
	 * Constructor.
	 *
	 * @param type Type.
	 * @param value Value.
	 */
	constructor(type: DERItem = new DERItem(), value: DERItem = new DERItem()) {
		this.type = type;
		this.value = value;
	}

	static {
		toStringTag(this, 'DERAttributeTypeAndValue');
	}
}
