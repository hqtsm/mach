import { constant, toStringTag } from '@hqtsm/class';
import { array, member, Uint8Ptr } from '@hqtsm/struct';
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
 */
export class EmbeddedSignatureBlob extends SuperBlobCore {
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
	public static override readonly SuperBlob = EmbeddedSignatureBlob;

	static {
		toStringTag(this, 'EmbeddedSignatureBlobMaker');
		constant(this, 'SuperBlob');
	}
}

/**
 * Multiple architecture EmbeddedSignatureBlobs for Mach-O detached signatures.
 * Indexed by main architecture.
 */
export class DetachedSignatureBlob extends SuperBlob {
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
	public static override readonly SuperBlob = DetachedSignatureBlob;

	static {
		toStringTag(this, 'DetachedSignatureBlobMaker');
		constant(this, 'SuperBlob');
	}
}

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 */
export class LibraryDependencyBlob extends SuperBlob {
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
	public static override readonly SuperBlob = LibraryDependencyBlob;

	static {
		toStringTag(this, 'LibraryDependencyBlobMaker');
		constant(this, 'SuperBlob');
	}
}

/**
 * For embedding entitlement configuration data.
 */
export class EntitlementBlob extends Blob {
	public static override readonly typeMagic = kSecCodeMagicEntitlement;

	static {
		toStringTag(this, 'EntitlementBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * For embedding entitlement configuration data, in DER format.
 */
export class EntitlementDERBlob extends Blob {
	public static override readonly typeMagic = kSecCodeMagicEntitlementDER;

	/**
	 * DER data.
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static der(_this: EntitlementDERBlob): Uint8Ptr {
		const { data } = _this;
		return new Uint8Ptr(data.buffer, data.byteOffset, _this.littleEndian);
	}

	/**
	 * DER length.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static derLength(_this: EntitlementDERBlob): number {
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
 */
export class LaunchConstraintBlob extends Blob {
	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

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
