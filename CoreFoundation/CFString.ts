import type { UInt32 } from '../MacOSX/MacTypes.ts';

/**
 * String encoding.
 */
export type CFStringEncoding = UInt32;

// CF_ENUM(CFStringEncoding, CFStringBuiltInEncodings) {

/**
 * Internal requirements for code.
 */
export type CFStringBuiltInEncodings =
	& CFStringEncoding
	& (
		| typeof kCFStringEncodingMacRoman
		| typeof kCFStringEncodingWindowsLatin1
		| typeof kCFStringEncodingISOLatin1
		| typeof kCFStringEncodingNextStepLatin
		| typeof kCFStringEncodingASCII
		| typeof kCFStringEncodingUnicode
		| typeof kCFStringEncodingUTF8
		| typeof kCFStringEncodingNonLossyASCII
		| typeof kCFStringEncodingUTF16
		| typeof kCFStringEncodingUTF16BE
		| typeof kCFStringEncodingUTF16LE
		| typeof kCFStringEncodingUTF32
		| typeof kCFStringEncodingUTF32BE
		| typeof kCFStringEncodingUTF32LE
	);

/**
 * MacRoman encoding.
 */
const kCFStringEncodingMacRoman = 0;

/**
 * ANSI codepage 1252.
 */
const kCFStringEncodingWindowsLatin1 = 0x0500;

/**
 * ISO 8859-1.
 */
const kCFStringEncodingISOLatin1 = 0x0201;

/**
 * NextStep encoding.
 */
const kCFStringEncodingNextStepLatin = 0x0B01;

/**
 * ASCII encoding.
 */
const kCFStringEncodingASCII = 0x0600;

/**
 * kTextEncodingUnicodeDefault + kTextEncodingDefaultFormat.
 */
const kCFStringEncodingUnicode = 0x0100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF8Format
 */
const kCFStringEncodingUTF8 = 0x08000100;

/**
 * 7bit Unicode variants used by Cocoa & Java.
 */
const kCFStringEncodingNonLossyASCII = 0x0BFF;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF16Format.
 */
const kCFStringEncodingUTF16 = 0x0100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF16BEFormat
 */
const kCFStringEncodingUTF16BE = 0x10000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF16LEFormat
 */
const kCFStringEncodingUTF16LE = 0x14000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF32Format
 */
const kCFStringEncodingUTF32 = 0x0c000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF32BEFormat
 */
const kCFStringEncodingUTF32BE = 0x18000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF32LEFormat
 */
const kCFStringEncodingUTF32LE = 0x1c000100;

// }
