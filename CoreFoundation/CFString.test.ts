import { assertEquals, assertInstanceOf } from '@std/assert';
import { PLString } from '@hqtsm/plist';
import {
	CFStringCreateWithBytes,
	kCFStringEncodingASCII,
	kCFStringEncodingInvalidId,
	kCFStringEncodingISOLatin1,
	kCFStringEncodingUTF16,
	kCFStringEncodingUTF8,
} from './CFString.ts';

Deno.test('CFStringCreateWithBytes: kCFStringEncodingASCII valid', () => {
	const a = new Uint8Array(1);
	for (let i = 0; i <= 0x7F; i++) {
		a[0] = i;
		const str = CFStringCreateWithBytes(a, kCFStringEncodingASCII, false);
		assertInstanceOf(str, PLString);
		assertEquals(str.value, String.fromCharCode(i));
	}
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingASCII invalid', () => {
	const a = new Uint8Array(1);
	for (let i = 0x80; i <= 0xFF; i++) {
		a[0] = i;
		const str = CFStringCreateWithBytes(a, kCFStringEncodingASCII, false);
		assertEquals(str, null);
	}
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingISOLatin1', () => {
	const a = new Uint8Array(1);
	for (let i = 0; i <= 0xFF; i++) {
		a[0] = i;
		const str = CFStringCreateWithBytes(
			a,
			kCFStringEncodingISOLatin1,
			false,
		);
		assertInstanceOf(str, PLString);
		assertEquals(str.value, String.fromCharCode(i));
	}
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF8 RAW', () => {
	const str = CFStringCreateWithBytes(
		new Uint8Array([0x61, 0x62, 0x63]),
		kCFStringEncodingUTF8,
		false,
	);
	assertInstanceOf(str, PLString);
	assertEquals(str.value, 'abc');
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF8 BOM', () => {
	const str = CFStringCreateWithBytes(
		new Uint8Array([0xEF, 0xBB, 0xBF, 0x61, 0x62, 0x63]),
		kCFStringEncodingUTF8,
		false,
	);
	assertInstanceOf(str, PLString);
	assertEquals(str.value, 'abc');
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF8 invalid', () => {
	const str = CFStringCreateWithBytes(
		new Uint8Array([0xC2]),
		kCFStringEncodingUTF8,
		false,
	);
	assertEquals(str, null);
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF16 native', () => {
	const str = CFStringCreateWithBytes(
		new Uint16Array([0x61, 0x62, 0x63]),
		kCFStringEncodingUTF16,
		false,
	);
	assertInstanceOf(str, PLString);
	assertEquals(str.value, 'abc');
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF16 external', () => {
	const view = new DataView(new ArrayBuffer(6));
	view.setUint16(0, 0x61);
	view.setUint16(2, 0x62);
	view.setUint16(4, 0x63);
	const str = CFStringCreateWithBytes(
		view,
		kCFStringEncodingUTF16,
		true,
	);
	assertInstanceOf(str, PLString);
	assertEquals(str.value, 'abc');
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF16 BE-BOM', () => {
	const view = new DataView(new ArrayBuffer(8));
	view.setUint16(0, 0xFEFF);
	view.setUint16(2, 0x61);
	view.setUint16(4, 0x62);
	view.setUint16(6, 0x63);
	const str = CFStringCreateWithBytes(
		view,
		kCFStringEncodingUTF16,
		false,
	);
	assertInstanceOf(str, PLString);
	assertEquals(str.value, 'abc');
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF16 LE-BOM', () => {
	const view = new DataView(new ArrayBuffer(8));
	view.setUint16(0, 0xFEFF, true);
	view.setUint16(2, 0x61, true);
	view.setUint16(4, 0x62, true);
	view.setUint16(6, 0x63, true);
	const str = CFStringCreateWithBytes(
		view,
		kCFStringEncodingUTF16,
		false,
	);
	assertInstanceOf(str, PLString);
	assertEquals(str.value, 'abc');
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingUTF16 invalid', () => {
	const str = CFStringCreateWithBytes(
		new Uint16Array([0xD83D]),
		kCFStringEncodingUTF16,
		false,
	);
	assertEquals(str, null);
});

Deno.test('CFStringCreateWithBytes: kCFStringEncodingInvalidId', () => {
	const str = CFStringCreateWithBytes(
		new Uint8Array([0x61, 0x62, 0x63]),
		kCFStringEncodingInvalidId,
		false,
	);
	assertEquals(str, null);
});
