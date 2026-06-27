import { assertEquals, assertInstanceOf } from '@std/assert';
import { encodeBinary, encodeXml, PLArray, PLDictionary } from '@hqtsm/plist';
import { assertThrowsCFError } from '../spec/mod.ts';
import { Security_BlobCore } from './blob.ts';
import {
	Security_makeCFData,
	Security_makeCFDictionaryFrom,
} from './cfutilities.ts';

Deno.test('Security_makeCFData: pointer', () => {
	const source = new Uint8Array(32);
	for (let i = source.length; i--;) {
		source[i] = i;
	}
	const data = Security_makeCFData(source, source.byteLength);
	assertEquals(data.byteLength, source.byteLength);
	assertEquals(new Uint8Array(data.buffer), source);
});

Deno.test('Security_makeCFData: generic', () => {
	const buffer = new ArrayBuffer(32);
	const source = new Security_BlobCore(buffer);
	Security_BlobCore.initialize(source, 0x12345678, buffer.byteLength);
	const data = Security_makeCFData(Security_BlobCore, source);
	assertEquals(data.byteLength, buffer.byteLength);
	assertEquals(new Uint8Array(data.buffer), new Uint8Array(buffer));
});

Deno.test('Security_makeCFDictionaryFrom: view', () => {
	const data = encodeXml(new PLDictionary());
	const dict = Security_makeCFDictionaryFrom(data);
	assertInstanceOf(dict, PLDictionary);
});

Deno.test('Security_makeCFDictionaryFrom: pointer', () => {
	const data = encodeBinary(new PLDictionary());
	const view = new Uint8Array(data.byteLength + 2);
	view.set(data, 1);
	const dict = Security_makeCFDictionaryFrom(
		view.subarray(1),
		data.byteLength,
	);
	assertInstanceOf(dict, PLDictionary);
});

Deno.test('Security_makeCFDictionaryFrom: null', () => {
	const dict = Security_makeCFDictionaryFrom(null);
	assertEquals(dict, null);
});

Deno.test('Security_makeCFDictionaryFrom: array', () => {
	const data = encodeXml(new PLArray());
	assertThrowsCFError(() => Security_makeCFDictionaryFrom(data));
});

Deno.test('Security_makeCFDictionaryFrom: bad', () => {
	const invalid = new TextEncoder().encode('<badplist>');
	assertEquals(Security_makeCFDictionaryFrom(invalid), null);
});
