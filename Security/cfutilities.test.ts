import { assertEquals, assertInstanceOf } from '@std/assert';
import { encodeBinary, encodeXml, PLArray, PLDictionary } from '@hqtsm/plist';
import { assertThrowsCFError } from '../spec/assert.ts';
import { BlobCore } from './blob.ts';
import { makeCFData, makeCFDictionaryFrom } from './cfutilities.ts';

Deno.test('makeCFData: pointer', () => {
	const source = new Uint8Array(32);
	for (let i = source.length; i--;) {
		source[i] = i;
	}
	const data = makeCFData(source, source.byteLength);
	assertEquals(data.byteLength, source.byteLength);
	assertEquals(new Uint8Array(data.buffer), source);
});

Deno.test('makeCFData: generic', () => {
	const buffer = new ArrayBuffer(32);
	const source = new BlobCore(buffer);
	BlobCore.initialize(source, 0x12345678, buffer.byteLength);
	const data = makeCFData(BlobCore, source);
	assertEquals(data.byteLength, buffer.byteLength);
	assertEquals(new Uint8Array(data.buffer), new Uint8Array(buffer));
});

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
