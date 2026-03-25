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

export type UInt8 = uchar;

export type SInt8 = char;

export type UInt16 = ushort;

export type SInt16 = short;

export type UInt32 = uint;

export type SInt32 = int;

export type Float32 = float;

export type Float64 = double;

export type Ptr = _Ptr<char>;

export type Handle = _Ptr<Ptr>;

export type Size = number;

export type BigSize = bigint;

export type OSErr = SInt16;

export type OSStatus = SInt32;

export type BytePtr = _Ptr<UInt8>;

export type ByteCount = Size;

export type BigByteCount = BigSize;

export type ByteOffset = Size;

export type BigByteOffset = BigSize;

export type Duration = SInt32;

export type ItemCount = Size;

export type BigItemCount = BigSize;

export type PBVersion = UInt32;

export type ScriptCode = SInt16;

export type LangCode = SInt16;

export type RegionCode = SInt16;

export type FourCharCode = UInt32;

export type OSType = FourCharCode;

export type ResType = FourCharCode;

export type OSTypePtr = _Ptr<OSType>;

export type ResTypePtr = _Ptr<ResType>;

export type Boolean = uchar;

export const noErr = 0;

export const kNilOptions = 0;

export const kInvalidID = 0;

export const kVariableLengthArray = 1;

export const kUnknownType = 0x3F3F3F3F;
