import { assertEquals } from '@std/assert';
import { Uint8Ptr } from '@hqtsm/struct';
import { ENOMEM } from '../../libc/errno.ts';
import { PLATFORM_MACOS } from '../../mach-o/loader.ts';
import {
	assertThrowsMacOSError,
	assertThrowsUnixError,
} from '../../spec/assert.ts';
import { unhex } from '../../spec/hex.ts';
import { testOOM } from '../../spec/memory.ts';
import { errSecCSReqUnsupported } from '../CSCommon.ts';
import { kSecCodeMagicRequirement } from '../CSCommonPriv.ts';
import {
	Security_CodeSigning_opAnd,
	Security_CodeSigning_opOr,
	Security_CodeSigning_Requirement,
} from './requirement.ts';
import {
	Security_CodeSigning_Requirement_Maker,
	Security_CodeSigning_Requirement_Maker_Chain,
} from './reqmaker.ts';

function fibinacci(n: number): number[] {
	const fib = [1, 1];
	for (let i = 2; i <= n; i++) {
		fib[i] = fib[i - 2] + fib[i - 1];
	}
	fib.length = n;
	return fib;
}

Deno.test('Security_CodeSigning_Requirement_Maker: alloc', () => {
	// identifier "com.apple.simple"
	const data = unhex(
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	const add = Security_CodeSigning_Requirement_Maker.alloc(
		maker,
		data.byteLength,
	);
	add.set(data);
	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	const dv = new DataView(
		r.buffer,
		r.byteOffset,
		Security_CodeSigning_Requirement.size(r),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Security_CodeSigning_Requirement.size(r));
	assertEquals(dv.getUint32(8), Security_CodeSigning_Requirement.exprForm);
	assertEquals(
		new Uint8Array(
			r.buffer,
			r.byteOffset + 12,
			Security_CodeSigning_Requirement.size(r) - 12,
		),
		data,
	);
});

Deno.test('Security_CodeSigning_Requirement_Maker: alloc grow fibonacci', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.lwcrForm,
	);
	for (const size of fibinacci(25)) {
		const d = new Uint8Array(size);
		d.fill((size % 255) + 1);
		Security_CodeSigning_Requirement_Maker.alloc(maker, size).set(d);
	}
	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	const dv = new DataView(
		r.buffer,
		r.byteOffset,
		Security_CodeSigning_Requirement.size(r),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Security_CodeSigning_Requirement.size(r));
	assertEquals(dv.getUint32(8), Security_CodeSigning_Requirement.lwcrForm);
});

Deno.test('Security_CodeSigning_Requirement_Maker: alloc grow fast', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.lwcrForm,
	);
	for (const size of [0xff, 0xfff, 0xffff, 0xfffff, 0xffffff]) {
		const d = new Uint8Array(size);
		d.fill((size % 255) + 1);
		Security_CodeSigning_Requirement_Maker.alloc(maker, size).set(d);
	}
	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	const dv = new DataView(
		r.buffer,
		r.byteOffset,
		Security_CodeSigning_Requirement.size(r),
	);
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Security_CodeSigning_Requirement.size(r));
	assertEquals(dv.getUint32(8), Security_CodeSigning_Requirement.lwcrForm);
});

Deno.test('Security_CodeSigning_Requirement_Maker: alloc error', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.lwcrForm,
	);
	testOOM([0xD1E0 + 12], () => {
		assertThrowsUnixError(
			() => Security_CodeSigning_Requirement_Maker.alloc(maker, 0xD1E0),
			ENOMEM,
		);
	});
});

Deno.test('Security_CodeSigning_Requirement_Maker: identifier "com.apple.simple"', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 24 00 00 00 01',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.simple'),
	);
	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(
			r.buffer,
			r.byteOffset,
			Security_CodeSigning_Requirement.size(r),
		),
		data,
	);
});

Deno.test('Security_CodeSigning_Requirement_Maker: anchor apple and identifier "com.apple.simple"', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 2C 00 00 00 01',
		'00 00 00 06',
		'00 00 00 03',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);

	const and = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opAnd,
	);
	assertEquals(Security_CodeSigning_Requirement_Maker_Chain.empty(and), true);
	Security_CodeSigning_Requirement_Maker.anchor(maker);
	Security_CodeSigning_Requirement_Maker_Chain.add(and);
	assertEquals(
		Security_CodeSigning_Requirement_Maker_Chain.empty(and),
		false,
	);
	Security_CodeSigning_Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.simple'),
	);
	Security_CodeSigning_Requirement_Maker_Chain.add(and);
	assertEquals(
		Security_CodeSigning_Requirement_Maker_Chain.empty(and),
		false,
	);

	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(
			r.buffer,
			r.byteOffset,
			Security_CodeSigning_Requirement.size(r),
		),
		data,
	);
});

Deno.test('Security_CodeSigning_Requirement_Maker: identifier "com.apple.simple" or anchor apple generic', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 2C 00 00 00 01',
		'00 00 00 07',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
		'00 00 00 0F',
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);

	const or = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opOr,
	);
	assertEquals(Security_CodeSigning_Requirement_Maker_Chain.empty(or), true);
	Security_CodeSigning_Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.simple'),
	);
	Security_CodeSigning_Requirement_Maker_Chain.add(or);
	assertEquals(Security_CodeSigning_Requirement_Maker_Chain.empty(or), false);
	Security_CodeSigning_Requirement_Maker.anchorGeneric(maker);
	Security_CodeSigning_Requirement_Maker_Chain.add(or);
	assertEquals(Security_CodeSigning_Requirement_Maker_Chain.empty(or), false);

	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(
			r.buffer,
			r.byteOffset,
			Security_CodeSigning_Requirement.size(r),
		),
		data,
	);
});

Deno.test('Security_CodeSigning_Requirement_Maker: (a and b) or (c and d)', () => {
	// identifier "com.apple.app" and anchor apple or
	// identifier "com.apple.gen" and anchor apple generic
	const data = unhex(
		'FA DE 0C 00 00 00 00 50 00 00 00 01',
		'00 00 00 07',
		'00 00 00 06',
		'00 00 00 02',
		'00 00 00 0D',
		'63 6F 6D 2E 61 70 70 6C 65 2E 61 70 70 00 00 00',
		'00 00 00 03',
		'00 00 00 06',
		'00 00 00 02',
		'00 00 00 0D',
		'63 6F 6D 2E 61 70 70 6C 65 2E 67 65 6E 00 00 00',
		'00 00 00 0F',
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);

	const or = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opOr,
	);
	let and;

	and = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opAnd,
	);
	Security_CodeSigning_Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.app'),
	);
	Security_CodeSigning_Requirement_Maker_Chain.add(and);
	Security_CodeSigning_Requirement_Maker.anchor(maker);
	Security_CodeSigning_Requirement_Maker_Chain.add(and);

	Security_CodeSigning_Requirement_Maker_Chain.add(or);

	and = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opAnd,
	);
	Security_CodeSigning_Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.gen'),
	);
	Security_CodeSigning_Requirement_Maker_Chain.add(and);
	Security_CodeSigning_Requirement_Maker.anchorGeneric(maker);
	Security_CodeSigning_Requirement_Maker_Chain.add(and);

	Security_CodeSigning_Requirement_Maker_Chain.add(or);

	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(
			r.buffer,
			r.byteOffset,
			Security_CodeSigning_Requirement.size(r),
		),
		data,
	);
});

Deno.test('Security_CodeSigning_Requirement_Maker: (a or b) and (c or d)', () => {
	// (identifier "com.apple.app" or anchor apple) and
	// (identifier "com.apple.gen" or anchor apple generic)
	const data = unhex(
		'FA DE 0C 00 00 00 00 50 00 00 00 01',
		'00 00 00 06',
		'00 00 00 07',
		'00 00 00 02',
		'00 00 00 0D',
		'63 6F 6D 2E 61 70 70 6C 65 2E 61 70 70 00 00 00',
		'00 00 00 03',
		'00 00 00 07',
		'00 00 00 02',
		'00 00 00 0D',
		'63 6F 6D 2E 61 70 70 6C 65 2E 67 65 6E 00 00 00',
		'00 00 00 0F',
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);

	const and = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opAnd,
	);
	let or;

	or = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opOr,
	);
	Security_CodeSigning_Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.app'),
	);
	Security_CodeSigning_Requirement_Maker_Chain.add(or);
	Security_CodeSigning_Requirement_Maker.anchor(maker);
	Security_CodeSigning_Requirement_Maker_Chain.add(or);

	Security_CodeSigning_Requirement_Maker_Chain.add(and);

	or = new Security_CodeSigning_Requirement_Maker_Chain(
		maker,
		Security_CodeSigning_opOr,
	);
	Security_CodeSigning_Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.gen').buffer,
	);
	Security_CodeSigning_Requirement_Maker_Chain.add(or);
	Security_CodeSigning_Requirement_Maker.anchorGeneric(maker);
	Security_CodeSigning_Requirement_Maker_Chain.add(or);

	Security_CodeSigning_Requirement_Maker_Chain.add(and);

	const r = Security_CodeSigning_Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(
			r.buffer,
			r.byteOffset,
			Security_CodeSigning_Requirement.size(r),
		),
		data,
	);
});

Deno.test('Security_CodeSigning_Requirement_Maker: anchor digested', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.anchor(maker, 1, hash);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: anchor digest', async () => {
	const cert = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	await Security_CodeSigning_Requirement_Maker.anchor(
		maker,
		1,
		cert,
		cert.length,
	);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: trustedAnchor', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.trustedAnchor(maker);
	Security_CodeSigning_Requirement_Maker.trustedAnchor(maker, 1);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: infoKey', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.infoKey(
		maker,
		new Uint8Array([1, 2]),
		new Uint8Array([3, 4]),
	);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: cdhash', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.cdhash(
		maker,
		new Uint8Array([1, 2, 3, 4]),
	);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: platform', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.platform(maker, PLATFORM_MACOS);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: copy Pointer', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.copy(
		maker,
		new Uint8Array([1, 2, 3, 4]),
		4,
	);
	const ptr = new Uint8Ptr(new Uint8Array([1, 2, 3, 4]).buffer);
	Security_CodeSigning_Requirement_Maker.copy(maker, ptr, 2);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: copy Requirement', () => {
	const a = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	const b = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.copy(
		a,
		Security_CodeSigning_Requirement_Maker.make(b),
	);
	Security_CodeSigning_Requirement_Maker.make(a);

	const c = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.lwcrForm,
	);
	const d = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.lwcrForm,
	);
	const dr = Security_CodeSigning_Requirement_Maker.make(d);
	assertThrowsMacOSError(
		() => Security_CodeSigning_Requirement_Maker.copy(c, dr),
		errSecCSReqUnsupported,
	);
});

Deno.test('Security_CodeSigning_Requirement_Maker: put', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.put(
		maker,
		new Uint8Array([1, 2, 3, 4]).buffer,
	);
	Security_CodeSigning_Requirement_Maker.make(maker);
});

Deno.test('Security_CodeSigning_Requirement_Maker: kind', () => {
	const maker = new Security_CodeSigning_Requirement_Maker(
		Security_CodeSigning_Requirement.exprForm,
	);
	Security_CodeSigning_Requirement_Maker.kind(
		maker,
		Security_CodeSigning_Requirement.lwcrForm,
	);
	assertEquals(
		Security_CodeSigning_Requirement.kind(
			Security_CodeSigning_Requirement_Maker.make(maker),
		),
		Security_CodeSigning_Requirement.lwcrForm,
	);
});
