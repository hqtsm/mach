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
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static der(_this: LaunchConstraintBlob): Uint8Ptr {
		const { data } = _this;
		return new Uint8Ptr(data.buffer, data.byteOffset, _this.littleEndian);
	}

	/**
	 * DER length.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static derLength(_this: LaunchConstraintBlob): number {
		return BlobCore.size(_this) - BlobCore.BYTE_LENGTH;
	}

	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

	static {
		toStringTag(this, 'LaunchConstraintBlob');
		member(array(Uint8Ptr, 0), this, 'data' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
