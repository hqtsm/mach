import { toStringTag } from '@hqtsm/class';
import type { ArrayBufferPointer } from '@hqtsm/struct';
import { MachOBase } from './machobase.ts';

/**
 * A Mach-O binary over a buffer.
 */
export class MachOImage extends MachOBase {
	/**
	 * Construct a Mach-O binary over a buffer.
	 *
	 * @param address Buffer pointer.
	 */
	constructor(address: ArrayBufferLike | ArrayBufferPointer) {
		super();

		MachOImage.initHeader(this, address);

		let buffer;
		let byteOffset = MachOImage.headerSize(this);
		if ('buffer' in address) {
			buffer = address.buffer;
			byteOffset += address.byteOffset;
		} else {
			buffer = address;
		}
		MachOImage.initCommands(this, {
			buffer,
			byteOffset,
		});
	}

	/**
	 * Get address of Mach-O.
	 *
	 * @param _this This.
	 * @returns Pionter to Mach-O header.
	 */
	public static address(_this: MachOImage): ArrayBufferPointer {
		return MachOImage.header(_this)!;
	}

	static {
		toStringTag(this, 'MachOImage');
	}
}
