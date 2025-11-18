import type { Class } from '@hqtsm/class';
import type { ArrayBufferPointer } from '@hqtsm/struct';
import { MachOBase } from './machobase.ts';

/**
 * A Mach-O binary over a buffer.
 */
export class MachOImage extends MachOBase {
	declare public readonly ['constructor']: Class<typeof MachOImage>;

	/**
	 * Construct a Mach-O binary over a buffer.
	 *
	 * @param address Buffer pointer.
	 */
	constructor(address: ArrayBufferLike | ArrayBufferPointer) {
		super();

		this.initHeader(address);

		let buffer;
		let byteOffset = this.headerSize();
		if ('buffer' in address) {
			buffer = address.buffer;
			byteOffset += address.byteOffset;
		} else {
			buffer = address;
		}
		this.initCommands({
			buffer,
			byteOffset,
		});
	}

	/**
	 * Get address of Mach-O.
	 *
	 * @returns Pionter to Mach-O header.
	 */
	public address(): ArrayBufferPointer {
		return this.header()!;
	}
}
