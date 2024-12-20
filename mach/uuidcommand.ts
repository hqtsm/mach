import {
	type Arr,
	array,
	member,
	Struct,
	uint32,
	Uint8Ptr,
} from '@hqtsm/struct';

/**
 * UUID command.
 */
export class UuidCommand extends Struct {
	declare public readonly ['constructor']: typeof UuidCommand;

	/**
	 * Command type.
	 */
	declare public cmd: number;

	/**
	 * Command size.
	 */
	declare public cmdsize: number;

	/**
	 * 128-bit UUID.
	 */
	declare public uuid: Arr<number>;

	static {
		uint32(this, 'cmd');
		uint32(this, 'cmdsize');
		member(array(Uint8Ptr, 16), this, 'uuid');
	}
}
