import { assertEquals, assertInstanceOf } from '@std/assert';
import { encodeBinary, encodeXml, PLArray, PLDictionary } from '@hqtsm/plist';
import { assertThrowsCFError } from '../spec/assert.ts';
import { makeCFDictionaryFrom } from './cfutilities.ts';

Deno.test('makeCFDictionaryFrom: view', () => {
	const data = encodeXml(new PLDictionary());
	const dict = makeCFDictionaryFrom(data);
	assertInstanceOf(dict, PLDictionary);
});

Deno.test('makeCFDictionaryFrom: pointer', () => {
	const data = encodeBinary(new PLDictionary());
	const view = new Uint8Array(data.byteLength + 2);
	view.set(data, 1);
	const dict = makeCFDictionaryFrom(view.subarray(1), data.byteLength);
	assertInstanceOf(dict, PLDictionary);
});

Deno.test('makeCFDictionaryFrom: null', () => {
	const dict = makeCFDictionaryFrom(null);
	assertEquals(dict, null);
});

Deno.test('makeCFDictionaryFrom: array', () => {
	const data = encodeXml(new PLArray());
	assertThrowsCFError(() => makeCFDictionaryFrom(data));
});

Deno.test('makeCFDictionaryFrom: bad', () => {
	const invalid = new TextEncoder().encode('<badplist>');
	assertEquals(makeCFDictionaryFrom(invalid), null);
});
