import type { ArrayBufferPointer } from '@hqtsm/struct';
import { decode, type DecodeXmlDecoder, PLDictionary } from '@hqtsm/plist';
import type { size_t } from '../libc/stddef.ts';
import { pointerBytes, viewBytes } from '../util/memory.ts';
import { CFError } from './errors.ts';

/**
 * Decode plist dictionary from buffer.
 *
 * @param data Data buffer.
 * @param decoder Optional XML decoder for obscure encoding.
 * @returns Dictionary or null.
 */
export function makeCFDictionaryFrom(
	data: ArrayBufferLike | ArrayBufferView | null,
	decoder?: DecodeXmlDecoder,
): PLDictionary | null;

/**
 * Decode plist dictionary from pointer.
 *
 * @param data Data pointer.
 * @param length Data length in bytes.
 * @param decoder Optional XML decoder for obscure encoding.
 * @returns Dictionary or null.
 */
export function makeCFDictionaryFrom(
	data: ArrayBufferPointer | null,
	length: size_t,
	decoder?: DecodeXmlDecoder,
): PLDictionary | null;

/**
 * Decode plist dictionary from buffer or pointer.
 *
 * @param data Data buffer or pointer.
 * @param length Data length in bytes, or optional XML decoder.
 * @param decoder Optional XML decoder for obscure encoding.
 * @returns Dictionary or null.
 */
export function makeCFDictionaryFrom(
	data: ArrayBufferLike | ArrayBufferView | ArrayBufferPointer | null,
	length?: size_t | DecodeXmlDecoder,
	decoder?: DecodeXmlDecoder,
): PLDictionary | null {
	if (data) {
		let d;
		if (typeof length === 'number') {
			d = pointerBytes(data, length);
		} else {
			decoder = length;
			d = viewBytes(data as ArrayBufferLike | ArrayBufferView);
		}
		let plist = null;
		try {
			// Attempt decode using Mac CF constraints.
			({ plist } = decode(d, {
				binary: {
					int64: true,
					stringKeys: true,
				},
				xml: {
					int64: true,
					decoder,
				},
				openstep: {
					utf16le: true,
				},
			}));
		} catch {
			// Ignore.
		}
		if (plist && !PLDictionary.is(plist)) {
			CFError.throwMe();
		}
		return plist;
	}
	return null;
}
