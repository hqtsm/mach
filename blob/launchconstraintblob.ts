import { type Class, constant, toStringTag } from '@hqtsm/class';
import { array, member, Uint8Ptr } from '@hqtsm/struct';
import { kSecCodeMagicLaunchConstraint } from '../const.ts';
import { Blob } from './blob.ts';
import { BlobCore } from './blobcore.ts';

/**
 * Launch constraint in DER format.
 */
export class LaunchConstraintBlob extends Blob {
	declare public readonly ['constructor']: Class<typeof LaunchConstraintBlob>;

	/**
	 * Data of payload (only).
	 */
	declare public readonly data: Uint8Ptr;

	/**
	 * DER data.
	 *
	 * @param self This.
	 * @returns Data pointer.
	 */
	public static der(self: LaunchConstraintBlob): Uint8Ptr {
		const { data } = self;
		return new Uint8Ptr(data.buffer, data.byteOffset, self.littleEndian);
	}

	/**
	 * DER length.
	 *
	 * @param self This.
	 * @returns Byte length.
	 */
	public static derLength(self: LaunchConstraintBlob): number {
		return BlobCore.size(self) - BlobCore.BYTE_LENGTH;
	}

	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

	static {
		toStringTag(this, 'LaunchConstraintBlob');
		member(array(Uint8Ptr, 0), this, 'data' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
