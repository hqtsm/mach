import { toStringTag } from '@hqtsm/class';
import { ASN1_OBJECT_ID } from '../libDER/asn1Types.ts';
import {
	DER_DEC_ASN_ANY,
	DER_DEC_NO_OPTS,
	DER_DEC_SAVE_DER,
} from './DER_Decode.ts';
import { DERItem } from './DERItem.ts';
import type { DER_OFFSET, DERItemSpec } from './libDER.ts';

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

/**
 * DERAttributeTypeAndValue specs.
 */
export const DERAttributeTypeAndValueItemSpecs: readonly DERItemSpec<
	DER_OFFSET<DERAttributeTypeAndValue>
>[] = [
	[
		'type',
		ASN1_OBJECT_ID,
		DER_DEC_NO_OPTS,
	],
	[
		'value',
		0n,
		DER_DEC_ASN_ANY | DER_DEC_SAVE_DER,
	],
];
