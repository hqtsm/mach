import { constant, toStringTag } from '@hqtsm/class';
import {
	type Arr,
	array,
	Int8Ptr,
	member,
	Struct,
	uint32,
	uint64,
} from '@hqtsm/struct';

/**
 * Note command.
 */
export class NoteCommand extends Struct {
	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * Owner name.
	 */
	declare public dataOwner: Arr<number>;

	/**
	 * File offset.
	 */
	declare public offset: bigint;

	/**
	 * Byte length.
	 */
	declare public size: bigint;

	static {
		toStringTag(this, 'NoteCommand');
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Int8Ptr, 16), this, 'dataOwner');
		uint64(this, 'offset');
		uint64(this, 'size');
		constant(this, 'BYTE_LENGTH');
	}
}
