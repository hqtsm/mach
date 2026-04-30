import { constant, toStringTag } from '@hqtsm/class';
import type { PLData, PLDictionary } from '@hqtsm/plist';
import { array, member, type Ptr, Uint8Ptr } from '@hqtsm/struct';
import type { size_t } from '../../libc/stddef.ts';
import type { uint8_t } from '../../libc/stdint.ts';
import { malloc } from '../../libc/stdlib.ts';
import { Blob, BlobCore, BlobWrapper } from '../blob.ts';
import { makeCFData, makeCFDictionaryFrom } from '../cfutilities.ts';
import { errSecCSSignatureInvalid } from '../CSCommon.ts';
import {
	kSecCodeMagicDetachedSignature,
	kSecCodeMagicEmbeddedSignature,
	kSecCodeMagicEntitlement,
	kSecCodeMagicEntitlementDER,
	kSecCodeMagicLaunchConstraint,
} from '../CSCommonPriv.ts';
import { MacOSError } from '../errors.ts';
import {
	SuperBlob,
	SuperBlob_Maker,
	SuperBlobCore,
	SuperBlobCore_Maker,
} from '../superblob.ts';
import {
	cdComponentIsBlob,
	CodeDirectory,
	type CodeDirectory_SpecialSlot,
} from './codedirectory.ts';

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

	/**
	 * Get blob data for slot.
	 *
	 * @param slot Slot.
	 * @param blob Blob.
	 * @returns Blob data.
	 */
	public static blobData(
		slot: CodeDirectory_SpecialSlot,
		blob: BlobCore,
	): PLData {
		if (CodeDirectory.slotAttributes(slot) & cdComponentIsBlob) {
			return makeCFData(BlobCore, blob);
		}
		const wrap = BlobWrapper.specific(blob);
		if (wrap) {
			return makeCFData(BlobWrapper, wrap);
		}
		MacOSError.throwMe(errSecCSSignatureInvalid);
	}

	/**
	 * Find blob data for slot.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @returns Blob data or null.
	 */
	public static component(
		_this: EmbeddedSignatureBlob,
		slot: CodeDirectory_SpecialSlot,
	): PLData | null {
		const blob = EmbeddedSignatureBlob.find(_this, slot);
		if (blob) {
			return EmbeddedSignatureBlob.blobData(slot, blob);
		}
		return null;
	}

	static {
		toStringTag(this, 'EmbeddedSignatureBlob');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlob_Maker extends SuperBlobCore_Maker {
	public static override readonly SuperBlob: typeof EmbeddedSignatureBlob<
		ArrayBuffer
	> = EmbeddedSignatureBlob;

	/**
	 * Add component to super blob.
	 *
	 * @param _this This.
	 * @param slot Slot.
	 * @param data Blob data.
	 */
	public static component(
		_this: EmbeddedSignatureBlob_Maker,
		slot: CodeDirectory_SpecialSlot,
		data: PLData,
	): void {
		if (CodeDirectory.slotAttributes(slot) & cdComponentIsBlob) {
			EmbeddedSignatureBlob_Maker.add(
				_this,
				slot,
				BlobCore.clone(new BlobCore(data.buffer))!,
			);
		} else {
			EmbeddedSignatureBlob_Maker.add(
				_this,
				slot,
				BlobWrapper.alloc(data.buffer, data.byteLength),
			);
		}
	}

	static {
		toStringTag(this, 'EmbeddedSignatureBlob_Maker');
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
export class DetachedSignatureBlob_Maker extends SuperBlob_Maker {
	public static override readonly SuperBlob: typeof DetachedSignatureBlob<
		ArrayBuffer
	> = DetachedSignatureBlob;

	static {
		toStringTag(this, 'DetachedSignatureBlob_Maker');
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
export class LibraryDependencyBlob_Maker extends SuperBlob_Maker {
	public static override readonly SuperBlob: typeof LibraryDependencyBlob<
		ArrayBuffer
	> = LibraryDependencyBlob;

	static {
		toStringTag(this, 'LibraryDependencyBlob_Maker');
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

	/**
	 * Decode entitlements dictionary.
	 *
	 * @param _this This.
	 * @returns Entitlements dictionary or null.
	 */
	public static entitlements(_this: EntitlementBlob): PLDictionary | null {
		const { BYTE_LENGTH } = EntitlementBlob;
		return makeCFDictionaryFrom(
			EntitlementBlob.at(
				_this,
				Uint8Ptr,
				BYTE_LENGTH,
				_this.littleEndian,
			),
			EntitlementBlob.size(_this) - BYTE_LENGTH,
		);
	}

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
	 * Create entitlement DER blob.
	 *
	 * @param length Body length.
	 * @returns Entitlement DER blob or null.
	 */
	public static alloc(
		length: size_t,
	): EntitlementDERBlob<ArrayBuffer> | null {
		const blobLength = length + BlobCore.BYTE_LENGTH;
		const d = malloc(blobLength);
		if (!d) {
			return null;
		}

		const b = new EntitlementDERBlob(d);
		BlobCore.initialize(b, kSecCodeMagicEntitlementDER, blobLength);
		return b;
	}

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
	 * Create launch constraint blob.
	 *
	 * @param length Body length.
	 * @returns Launch constraint blob or null.
	 */
	public static alloc(
		length: size_t,
	): LaunchConstraintBlob<ArrayBuffer> | null {
		const blobLength = length + BlobCore.BYTE_LENGTH;
		const d = malloc(blobLength);
		if (!d) {
			return null;
		}

		const b = new LaunchConstraintBlob(d);
		BlobCore.initialize(b, kSecCodeMagicLaunchConstraint, blobLength);
		return b;
	}

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
