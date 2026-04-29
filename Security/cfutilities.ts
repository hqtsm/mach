import type { ArrayBufferPointer } from '@hqtsm/struct';
import {
	decode,
	type DecodeXmlDecoder,
	PLData,
	PLDictionary,
} from '@hqtsm/plist';
import type { size_t } from '../libc/stddef.ts';
import { pointerBytes, viewBytes } from '../util/memory.ts';
import { CFError } from './errors.ts';

/**
 * Make CFData from a buffer pointer and size.
 *
 * @param data Buffer pointer.
 * @param size Size in bytes.
 * @returns CFData copy of data.
 */
export function makeCFData(data: ArrayBufferPointer, size: size_t): PLData;

/**
 * Make CFData from a generic type.
 *
 * @template T Generic type.
 * @param Type Generic methods.
 * @param source Generic value.
 * @returns CFData copy of data.
 */
export function makeCFData<T>(
	Type: {
		data(value: T): ArrayBufferPointer;
		size(value: T): size_t;
	},
	source: T,
): PLData;

/**
 * Make CFData from a buffer pointer and size or generic type.
 *
 * @template T Generic type.
 * @param data Buffer pointer or generic methods.
 * @param size Size in bytes or generic value.
 * @returns CFData copy of data.
 */
export function makeCFData<T>(
	data: ArrayBufferPointer | {
		data(value: T): ArrayBufferPointer;
		size(value: T): size_t;
	},
	size: T | size_t,
): PLData {
	let d;
	let s;
	if (typeof size === 'number') {
		d = data as ArrayBufferPointer;
		s = size;
	} else {
		d = (data as { data(value: T): ArrayBufferPointer }).data(size);
		s = (data as { size(value: T): size_t }).size(size);
	}
	const r = new PLData(s);
	new Uint8Array(r.buffer).set(new Uint8Array(d.buffer, d.byteOffset, s));
	return r;
}

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
