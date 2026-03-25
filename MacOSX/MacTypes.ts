import type { Ptr as _Ptr } from '@hqtsm/struct';
import type {
	char,
	double,
	float,
	int,
	short,
	uchar,
	uint,
	ushort,
} from '../libc/c.ts';

/**
 * Unsigned 8-bit integer.
 */
export type UInt8 = uchar;

/**
 * Signed 8-bit integer.
 */
export type SInt8 = char;

/**
 * Unsigned 16-bit integer.
 */
export type UInt16 = ushort;

/**
 * Signed 16-bit integer.
 */
export type SInt16 = short;

/**
 * Unsigned 32-bit integer.
 */
export type UInt32 = uint;

/**
 * Signed 32-bit integer.
 */
export type SInt32 = int;

/**
 * Float 32-bit.
 */
export type Float32 = float;

/**
 * Float 64-bit.
 */
export type Float64 = double;

/**
 * Char pointer.
 */
export type Ptr = _Ptr<char>;

/**
 * Handle pointer.
 */
export type Handle = _Ptr<Ptr>;

/**
 * Size in bytes.
 */
export type Size = number;

/**
 * Big size in bytes.
 */
export type BigSize = bigint;

/**
 * OS error code.
 */
export type OSErr = SInt16;

/**
 * OS status code.
 */
export type OSStatus = SInt32;

/**
 * Byte pointer.
 */
export type BytePtr = _Ptr<UInt8>;

/**
 * Byte count.
 */
export type ByteCount = Size;

/**
 * Big byte count.
 */
export type BigByteCount = BigSize;

/**
 * Byte offset.
 */
export type ByteOffset = Size;

/**
 * Big byte offset.
 */
export type BigByteOffset = BigSize;

/**
 * Duration in ticks.
 */
export type Duration = SInt32;

/**
 * Item count.
 */
export type ItemCount = Size;

/**
 * Big item count.
 */
export type BigItemCount = BigSize;

/**
 * Version number.
 */
export type PBVersion = UInt32;

/**
 * Script code.
 */
export type ScriptCode = SInt16;

/**
 * Language code.
 */
export type LangCode = SInt16;

/**
 * Region code.
 */
export type RegionCode = SInt16;

/**
 * Four character code.
 */
export type FourCharCode = UInt32;

/**
 * OS type.
 */
export type OSType = FourCharCode;

/**
 * Resource type.
 */
export type ResType = FourCharCode;

/**
 * OS type pointer.
 */
export type OSTypePtr = _Ptr<OSType>;

/**
 * Resource type pointer.
 */
export type ResTypePtr = _Ptr<ResType>;

/**
 * Boolean.
 */
export type Boolean = uchar;

/**
 * No error.
 */
export const noErr = 0;

/**
 * No options.
 */
export const kNilOptions = 0;

/**
 * Invalid ID.
 */
export const kInvalidID = 0;

/**
 * Variable length array.
 */
export const kVariableLengthArray = 1;

/**
 * Unknown type (`????`).
 */
export const kUnknownType = 0x3F3F3F3F;
