import { constant, toStringTag } from '@hqtsm/class';
import { array, member, type Ptr, Uint8Ptr } from '@hqtsm/struct';
import type { size_t } from '../../libc/stddef.ts';
import type { uint8_t } from '../../libc/stdint.ts';
import { Blob, BlobCore } from '../blob.ts';
import {
	kSecCodeMagicDetachedSignature,
	kSecCodeMagicEmbeddedSignature,
	kSecCodeMagicEntitlement,
	kSecCodeMagicEntitlementDER,
	kSecCodeMagicLaunchConstraint,
} from '../CSCommonPriv.ts';
import {
	SuperBlob,
	SuperBlobCore,
	SuperBlobCoreMaker,
	SuperBlobMaker,
} from '../superblob.ts';

/**
 * An EmbeddedSignatureBlob is a SuperBlob indexed by component slot number.
 * For embedded Mach-O signatures and detached non-Mach-O binaries.
 *
 * @template TArrayBuffer Buffer type.
 */
export class EmbeddedSignatureBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends SuperBlobCore<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicEmbeddedSignature;

	static {
		toStringTag(this, 'EmbeddedSignatureBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobCoreMaker {
	public static override readonly SuperBlob: typeof EmbeddedSignatureBlob<
		ArrayBuffer
	> = EmbeddedSignatureBlob;

	static {
		toStringTag(this, 'EmbeddedSignatureBlobMaker');
		constant(this, 'SuperBlob');
	}
}

/**
 * Multiple architecture EmbeddedSignatureBlobs for Mach-O detached signatures.
 * Indexed by main architecture.
 *
 * @template TArrayBuffer Buffer type.
 */
export class DetachedSignatureBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends SuperBlob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicDetachedSignature;

	static {
		toStringTag(this, 'DetachedSignatureBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker {
	public static override readonly SuperBlob: typeof DetachedSignatureBlob<
		ArrayBuffer
	> = DetachedSignatureBlob;

	static {
		toStringTag(this, 'DetachedSignatureBlobMaker');
		constant(this, 'SuperBlob');
	}
}

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 *
 * @template TArrayBuffer Buffer type.
 */
export class LibraryDependencyBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends SuperBlob<TArrayBuffer> {
	public static override readonly typeMagic = 0xfade0c05;

	static {
		toStringTag(this, 'LibraryDependencyBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for LibraryDependencyBlob.
 */
export class LibraryDependencyBlobMaker extends SuperBlobMaker {
	public static override readonly SuperBlob: typeof LibraryDependencyBlob<
		ArrayBuffer
	> = LibraryDependencyBlob;

	static {
		toStringTag(this, 'LibraryDependencyBlobMaker');
		constant(this, 'SuperBlob');
	}
}

/**
 * For embedding entitlement configuration data.
 *
 * @template TArrayBuffer Buffer type.
 */
export class EntitlementBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicEntitlement;

	static {
		toStringTag(this, 'EntitlementBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * For embedding entitlement configuration data, in DER format.
 *
 * @template TArrayBuffer Buffer type.
 */
export class EntitlementDERBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicEntitlementDER;

	/**
	 * DER data.
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static der(_this: EntitlementDERBlob): Ptr<uint8_t> {
		const { data } = _this;
		return new Uint8Ptr(data.buffer, data.byteOffset, _this.littleEndian);
	}

	/**
	 * DER length.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static derLength(_this: EntitlementDERBlob): size_t {
		return BlobCore.size(_this) - BlobCore.BYTE_LENGTH;
	}

	/**
	 * Data of payload (only).
	 */
	declare private readonly data: Uint8Ptr;

	static {
		toStringTag(this, 'EntitlementDERBlob');
		member(array(Uint8Ptr, 0), this, 'data' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}

/**
 * Launch constraint in DER format.
 *
 * @template TArrayBuffer Buffer type.
 */
export class LaunchConstraintBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

	/**
	 * DER data.
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static der(_this: LaunchConstraintBlob): Ptr<uint8_t> {
		const { data } = _this;
		return new Uint8Ptr(data.buffer, data.byteOffset, _this.littleEndian);
	}

	/**
	 * DER length.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static derLength(_this: LaunchConstraintBlob): size_t {
		return BlobCore.size(_this) - BlobCore.BYTE_LENGTH;
	}

	/**
	 * Data of payload (only).
	 */
	declare private readonly data: Uint8Ptr;

	static {
		toStringTag(this, 'LaunchConstraintBlob');
		member(array(Uint8Ptr, 0), this, 'data' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
