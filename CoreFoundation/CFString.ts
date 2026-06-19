import { BIG_ENDIAN } from '@hqtsm/struct';
import {
	type ArrayBufferLikeData,
	bufferBytes,
	viewBytes,
} from '../helpers/memory.ts';
import type { UInt32 } from '../MacOSX/MacTypes.ts';

/**
 * String encoding.
 */
export type CFStringEncoding = UInt32;

/**
 * Invalid encoding ID.
 */
export const kCFStringEncodingInvalidId = 0xffffffff;

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
export const kCFStringEncodingMacRoman = 0;

/**
 * ANSI codepage 1252.
 */
export const kCFStringEncodingWindowsLatin1 = 0x0500;

/**
 * ISO 8859-1.
 */
export const kCFStringEncodingISOLatin1 = 0x0201;

/**
 * NextStep encoding.
 */
export const kCFStringEncodingNextStepLatin = 0x0B01;

/**
 * ASCII encoding.
 */
export const kCFStringEncodingASCII = 0x0600;

/**
 * kTextEncodingUnicodeDefault + kTextEncodingDefaultFormat.
 */
export const kCFStringEncodingUnicode = 0x0100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF8Format
 */
export const kCFStringEncodingUTF8 = 0x08000100;

/**
 * 7bit Unicode variants used by Cocoa & Java.
 */
export const kCFStringEncodingNonLossyASCII = 0x0BFF;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF16Format.
 */
export const kCFStringEncodingUTF16 = 0x0100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF16BEFormat
 */
export const kCFStringEncodingUTF16BE = 0x10000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF16LEFormat
 */
export const kCFStringEncodingUTF16LE = 0x14000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF32Format
 */
export const kCFStringEncodingUTF32 = 0x0c000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF32BEFormat
 */
export const kCFStringEncodingUTF32BE = 0x18000100;

/**
 * kTextEncodingUnicodeDefault + kUnicodeUTF32LEFormat
 */
export const kCFStringEncodingUTF32LE = 0x1c000100;

// }

/**
 * Decode bytes to string.
 *
 * @param bytes Array buffer.
 * @param encoding Encoding.
 * @param isExternalRepresentation Is external representation.
 * @returns String.
 */
export function CFStringCreateWithBytes(
	bytes: ArrayBufferLikeData,
	encoding: CFStringEncoding,
	isExternalRepresentation: boolean,
): string | null {
	let view = viewBytes(bytes);
	let s = '';
	switch (encoding) {
		case kCFStringEncodingASCII: {
			for (let i = 0, l = view.length; i < l; i++) {
				const c = view[i];
				if (c > 127) {
					return null;
				}
				s += String.fromCharCode(c);
			}
			break;
		}
		case kCFStringEncodingISOLatin1: {
			for (let i = 0, l = view.length; i < l; i++) {
				s += String.fromCharCode(view[i]);
			}
			break;
		}
		case kCFStringEncodingUTF8: {
			const td = new TextDecoder('utf-8', {
				fatal: true,
			});
			try {
				s = td.decode(
					bufferBytes(view.buffer, view.byteOffset, view.byteLength),
				);
			} catch {
				return null;
			}
			break;
		}
		case kCFStringEncodingUTF16: {
			let label;
			view = bufferBytes(view.buffer, view.byteOffset, view.byteLength);
			switch (view[0] << 8 | view[1]) {
				case 0xFEFF: {
					label = 'utf-16be';
					view = view.subarray(2);
					break;
				}
				case 0xFFFE: {
					label = 'utf-16le';
					view = view.subarray(2);
					break;
				}
				default: {
					label = isExternalRepresentation
						? 'utf-16be'
						: ['utf-16le', 'utf-16be'][+BIG_ENDIAN];
				}
			}
			const td = new TextDecoder(label, {
				fatal: true,
			});
			try {
				s = td.decode(view);
			} catch {
				return null;
			}
			break;
		}
		// TODO: Implement the remaining encodings.
		default: {
			return null;
		}
	}
	return s;
}
