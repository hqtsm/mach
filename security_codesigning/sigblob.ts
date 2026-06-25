import { constant, toStringTag } from '@hqtsm/class';
import { array, member, type Ptr, Uint8Ptr } from '@hqtsm/struct';
import type { CFDataRef } from '../CoreFoundation/CFData.ts';
import type { CFDictionaryRef } from '../CoreFoundation/CFDictionary.ts';
import { type ArrayBufferLikeData, viewBytes } from '../helpers/memory.ts';
import type { size_t } from '../libc/stddef.ts';
import type { uint8_t } from '../libc/stdint.ts';
import { malloc } from '../libc/stdlib.ts';
import {
	Security_Blob,
	Security_BlobCore,
	Security_BlobWrapper,
} from '../Security/blob.ts';
import {
	Security_makeCFData,
	Security_makeCFDictionaryFrom,
} from '../Security/cfutilities.ts';
import { errSecCSSignatureInvalid } from '../Security/CSCommon.ts';
import {
	kSecCodeMagicDetachedSignature,
	kSecCodeMagicEmbeddedSignature,
	kSecCodeMagicEntitlement,
	kSecCodeMagicEntitlementDER,
	kSecCodeMagicLaunchConstraint,
} from '../Security/CSCommonPriv.ts';
import { Security_MacOSError } from '../Security/errors.ts';
import {
	Security_SuperBlob,
	Security_SuperBlob_Maker,
	Security_SuperBlobCore,
	Security_SuperBlobCore_Maker,
} from '../Security/superblob.ts';
import {
	Security_CodeSigning_cdComponentIsBlob,
	Security_CodeSigning_CodeDirectory,
	type Security_CodeSigning_CodeDirectory_SpecialSlot,
} from './codedirectory.ts';

/**
 * An EmbeddedSignatureBlob is a SuperBlob indexed by component slot number.
 * For embedded Mach-O signatures and detached non-Mach-O binaries.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_EmbeddedSignatureBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_SuperBlobCore<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicEmbeddedSignature;

	/**
	 * Get blob data for slot.
	 *
	 * @param slot Slot.
	 * @param blob Blob.
	 * @returns Blob data.
	 */
	public static blobData(
		slot: Security_CodeSigning_CodeDirectory_SpecialSlot,
		blob: Security_BlobCore,
	): CFDataRef {
		if (
			Security_CodeSigning_CodeDirectory.slotAttributes(slot) &
			Security_CodeSigning_cdComponentIsBlob
		) {
			return Security_makeCFData(Security_BlobCore, blob);
		}
		const wrap = Security_BlobWrapper.specific(blob);
		if (wrap) {
			return Security_makeCFData(Security_BlobWrapper, wrap);
		}
		Security_MacOSError.throwMe(errSecCSSignatureInvalid);
	}

	/**
	 * Find blob data for slot.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @returns Blob data or null.
	 */
	public static component(
		_this: Security_CodeSigning_EmbeddedSignatureBlob,
		slot: Security_CodeSigning_CodeDirectory_SpecialSlot,
	): CFDataRef | null {
		const blob = Security_CodeSigning_EmbeddedSignatureBlob.find(
			_this,
			slot,
		);
		if (blob) {
			return Security_CodeSigning_EmbeddedSignatureBlob.blobData(
				slot,
				blob,
			);
		}
		return null;
	}

	static {
		toStringTag(this, 'Security_CodeSigning_EmbeddedSignatureBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class Security_CodeSigning_EmbeddedSignatureBlob_Maker
	extends Security_SuperBlobCore_Maker {
	public static override readonly SuperBlob:
		typeof Security_CodeSigning_EmbeddedSignatureBlob<
			ArrayBuffer
		> = Security_CodeSigning_EmbeddedSignatureBlob;

	/**
	 * Add component to super blob.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @param data Blob data.
	 */
	public static component(
		_this: Security_CodeSigning_EmbeddedSignatureBlob_Maker,
		slot: Security_CodeSigning_CodeDirectory_SpecialSlot,
		data: ArrayBufferLikeData,
	): void {
		data = viewBytes(data);
		if (
			Security_CodeSigning_CodeDirectory.slotAttributes(slot) &
			Security_CodeSigning_cdComponentIsBlob
		) {
			Security_CodeSigning_EmbeddedSignatureBlob_Maker.add(
				_this,
				slot,
				Security_BlobCore.clone(
					new Security_BlobCore(data.buffer, data.byteOffset),
				)!,
			);
		} else {
			Security_CodeSigning_EmbeddedSignatureBlob_Maker.add(
				_this,
				slot,
				Security_BlobWrapper.alloc(data, data.byteLength),
			);
		}
	}

	static {
		toStringTag(this, 'Security_CodeSigning_EmbeddedSignatureBlob_Maker');
		constant(this, 'SuperBlob');
	}
}

/**
 * Multiple architecture EmbeddedSignatureBlobs for Mach-O detached signatures.
 * Indexed by main architecture.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_DetachedSignatureBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_SuperBlob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicDetachedSignature;

	static {
		toStringTag(this, 'Security_CodeSigning_DetachedSignatureBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class Security_CodeSigning_DetachedSignatureBlob_Maker
	extends Security_SuperBlob_Maker {
	public static override readonly SuperBlob:
		typeof Security_CodeSigning_DetachedSignatureBlob<
			ArrayBuffer
		> = Security_CodeSigning_DetachedSignatureBlob;

	static {
		toStringTag(this, 'Security_CodeSigning_DetachedSignatureBlob_Maker');
		constant(this, 'SuperBlob');
	}
}

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_LibraryDependencyBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_SuperBlob<TArrayBuffer> {
	public static override readonly typeMagic = 0xfade0c05;

	static {
		toStringTag(this, 'Security_CodeSigning_LibraryDependencyBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for LibraryDependencyBlob.
 */
export class Security_CodeSigning_LibraryDependencyBlob_Maker
	extends Security_SuperBlob_Maker {
	public static override readonly SuperBlob:
		typeof Security_CodeSigning_LibraryDependencyBlob<
			ArrayBuffer
		> = Security_CodeSigning_LibraryDependencyBlob;

	static {
		toStringTag(this, 'Security_CodeSigning_LibraryDependencyBlob_Maker');
		constant(this, 'SuperBlob');
	}
}

/**
 * For embedding entitlement configuration data.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_EntitlementBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicEntitlement;

	/**
	 * Decode entitlements dictionary.
	 *
	 * @param _this This.
	 * @returns Entitlements dictionary or null.
	 */
	public static entitlements(
		_this: Security_CodeSigning_EntitlementBlob,
	): CFDictionaryRef | null {
		const { BYTE_LENGTH } = Security_CodeSigning_EntitlementBlob;
		return Security_makeCFDictionaryFrom(
			Security_CodeSigning_EntitlementBlob.at(
				_this,
				Uint8Ptr,
				BYTE_LENGTH,
				_this.littleEndian,
			),
			Security_CodeSigning_EntitlementBlob.size(_this) - BYTE_LENGTH,
		);
	}

	static {
		toStringTag(this, 'Security_CodeSigning_EntitlementBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * For embedding entitlement configuration data, in DER format.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_EntitlementDERBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicEntitlementDER;

	/**
	 * Create entitlement DER blob.
	 *
	 * @param length Body length.
	 * @returns Entitlement DER blob or null.
	 */
	public static alloc(
		length: size_t,
	): Security_CodeSigning_EntitlementDERBlob<ArrayBuffer> | null {
		const blobLength = length + Security_BlobCore.BYTE_LENGTH;
		const d = malloc(blobLength);
		if (!d) {
			return null;
		}

		const b = new Security_CodeSigning_EntitlementDERBlob(d);
		Security_BlobCore.initialize(
			b,
			kSecCodeMagicEntitlementDER,
			blobLength,
		);
		return b;
	}

	/**
	 * DER data.
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static der(
		_this: Security_CodeSigning_EntitlementDERBlob,
	): Ptr<uint8_t> {
		const { data } = _this;
		return new Uint8Ptr(data.buffer, data.byteOffset, _this.littleEndian);
	}

	/**
	 * DER length.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static derLength(
		_this: Security_CodeSigning_EntitlementDERBlob,
	): size_t {
		return Security_BlobCore.size(_this) - Security_BlobCore.BYTE_LENGTH;
	}

	/**
	 * Data of payload (only).
	 */
	declare private readonly data: Uint8Ptr;

	static {
		toStringTag(this, 'Security_CodeSigning_EntitlementDERBlob');
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
export class Security_CodeSigning_LaunchConstraintBlob<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_Blob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

	/**
	 * Create launch constraint blob.
	 *
	 * @param length Body length.
	 * @returns Launch constraint blob or null.
	 */
	public static alloc(
		length: size_t,
	): Security_CodeSigning_LaunchConstraintBlob<ArrayBuffer> | null {
		const blobLength = length + Security_BlobCore.BYTE_LENGTH;
		const d = malloc(blobLength);
		if (!d) {
			return null;
		}

		const b = new Security_CodeSigning_LaunchConstraintBlob(d);
		Security_BlobCore.initialize(
			b,
			kSecCodeMagicLaunchConstraint,
			blobLength,
		);
		return b;
	}

	/**
	 * DER data.
	 *
	 * @param _this This.
	 * @returns Data pointer.
	 */
	public static der(
		_this: Security_CodeSigning_LaunchConstraintBlob,
	): Ptr<uint8_t> {
		const { data } = _this;
		return new Uint8Ptr(data.buffer, data.byteOffset, _this.littleEndian);
	}

	/**
	 * DER length.
	 *
	 * @param _this This.
	 * @returns Byte length.
	 */
	public static derLength(
		_this: Security_CodeSigning_LaunchConstraintBlob,
	): size_t {
		return Security_BlobCore.size(_this) - Security_BlobCore.BYTE_LENGTH;
	}

	/**
	 * Data of payload (only).
	 */
	declare private readonly data: Uint8Ptr;

	static {
		toStringTag(this, 'Security_CodeSigning_LaunchConstraintBlob');
		member(array(Uint8Ptr, 0), this, 'data' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
