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
import { opAnd, opOr, Requirement } from './requirement.ts';
import { Requirement_Maker, Requirement_Maker_Chain } from './reqmaker.ts';

function fibinacci(n: number): number[] {
	const fib = [1, 1];
	for (let i = 2; i <= n; i++) {
		fib[i] = fib[i - 2] + fib[i - 1];
	}
	fib.length = n;
	return fib;
}

Deno.test('RequirementMaker: alloc', () => {
	// identifier "com.apple.simple"
	const data = unhex(
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new Requirement_Maker(Requirement.exprForm);
	const add = Requirement_Maker.alloc(maker, data.byteLength);
	add.set(data);
	const r = Requirement_Maker.make(maker);
	const dv = new DataView(r.buffer, r.byteOffset, Requirement.size(r));
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Requirement.size(r));
	assertEquals(dv.getUint32(8), Requirement.exprForm);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset + 12, Requirement.size(r) - 12),
		data,
	);
});

Deno.test('RequirementMaker: alloc grow fibonacci', () => {
	const maker = new Requirement_Maker(Requirement.lwcrForm);
	for (const size of fibinacci(25)) {
		const d = new Uint8Array(size);
		d.fill((size % 255) + 1);
		Requirement_Maker.alloc(maker, size).set(d);
	}
	const r = Requirement_Maker.make(maker);
	const dv = new DataView(r.buffer, r.byteOffset, Requirement.size(r));
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Requirement.size(r));
	assertEquals(dv.getUint32(8), Requirement.lwcrForm);
});

Deno.test('RequirementMaker: alloc grow fast', () => {
	const maker = new Requirement_Maker(Requirement.lwcrForm);
	for (const size of [0xff, 0xfff, 0xffff, 0xfffff, 0xffffff]) {
		const d = new Uint8Array(size);
		d.fill((size % 255) + 1);
		Requirement_Maker.alloc(maker, size).set(d);
	}
	const r = Requirement_Maker.make(maker);
	const dv = new DataView(r.buffer, r.byteOffset, Requirement.size(r));
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Requirement.size(r));
	assertEquals(dv.getUint32(8), Requirement.lwcrForm);
});

Deno.test('RequirementMaker: alloc error', () => {
	const maker = new Requirement_Maker(Requirement.lwcrForm);
	testOOM([0xD1E0 + 12], () => {
		assertThrowsUnixError(
			() => Requirement_Maker.alloc(maker, 0xD1E0),
			ENOMEM,
		);
	});
});

Deno.test('RequirementMaker: identifier "com.apple.simple"', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 24 00 00 00 01',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.simple'),
	);
	const r = Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('RequirementMaker: anchor apple and identifier "com.apple.simple"', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 2C 00 00 00 01',
		'00 00 00 06',
		'00 00 00 03',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new Requirement_Maker(Requirement.exprForm);

	const and = new Requirement_Maker_Chain(maker, opAnd);
	assertEquals(Requirement_Maker_Chain.empty(and), true);
	Requirement_Maker.anchor(maker);
	Requirement_Maker_Chain.add(and);
	assertEquals(Requirement_Maker_Chain.empty(and), false);
	Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.simple'),
	);
	Requirement_Maker_Chain.add(and);
	assertEquals(Requirement_Maker_Chain.empty(and), false);

	const r = Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('RequirementMaker: identifier "com.apple.simple" or anchor apple generic', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 2C 00 00 00 01',
		'00 00 00 07',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
		'00 00 00 0F',
	);
	const maker = new Requirement_Maker(Requirement.exprForm);

	const or = new Requirement_Maker_Chain(maker, opOr);
	assertEquals(Requirement_Maker_Chain.empty(or), true);
	Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.simple'),
	);
	Requirement_Maker_Chain.add(or);
	assertEquals(Requirement_Maker_Chain.empty(or), false);
	Requirement_Maker.anchorGeneric(maker);
	Requirement_Maker_Chain.add(or);
	assertEquals(Requirement_Maker_Chain.empty(or), false);

	const r = Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('RequirementMaker: (a and b) or (c and d)', () => {
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
	const maker = new Requirement_Maker(Requirement.exprForm);

	const or = new Requirement_Maker_Chain(maker, opOr);
	let and;

	and = new Requirement_Maker_Chain(maker, opAnd);
	Requirement_Maker.ident(maker, new TextEncoder().encode('com.apple.app'));
	Requirement_Maker_Chain.add(and);
	Requirement_Maker.anchor(maker);
	Requirement_Maker_Chain.add(and);

	Requirement_Maker_Chain.add(or);

	and = new Requirement_Maker_Chain(maker, opAnd);
	Requirement_Maker.ident(maker, new TextEncoder().encode('com.apple.gen'));
	Requirement_Maker_Chain.add(and);
	Requirement_Maker.anchorGeneric(maker);
	Requirement_Maker_Chain.add(and);

	Requirement_Maker_Chain.add(or);

	const r = Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('RequirementMaker: (a or b) and (c or d)', () => {
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
	const maker = new Requirement_Maker(Requirement.exprForm);

	const and = new Requirement_Maker_Chain(maker, opAnd);
	let or;

	or = new Requirement_Maker_Chain(maker, opOr);
	Requirement_Maker.ident(maker, new TextEncoder().encode('com.apple.app'));
	Requirement_Maker_Chain.add(or);
	Requirement_Maker.anchor(maker);
	Requirement_Maker_Chain.add(or);

	Requirement_Maker_Chain.add(and);

	or = new Requirement_Maker_Chain(maker, opOr);
	Requirement_Maker.ident(
		maker,
		new TextEncoder().encode('com.apple.gen').buffer,
	);
	Requirement_Maker_Chain.add(or);
	Requirement_Maker.anchorGeneric(maker);
	Requirement_Maker_Chain.add(or);

	Requirement_Maker_Chain.add(and);

	const r = Requirement_Maker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('RequirementMaker: anchor digested', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.anchor(maker, 1, hash);
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: anchor digest', async () => {
	const cert = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const maker = new Requirement_Maker(Requirement.exprForm);
	await Requirement_Maker.anchor(maker, 1, cert, cert.length);
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: trustedAnchor', () => {
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.trustedAnchor(maker);
	Requirement_Maker.trustedAnchor(maker, 1);
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: infoKey', () => {
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.infoKey(
		maker,
		new Uint8Array([1, 2]),
		new Uint8Array([3, 4]),
	);
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: cdhash', () => {
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.cdhash(maker, new Uint8Array([1, 2, 3, 4]));
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: platform', () => {
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.platform(maker, PLATFORM_MACOS);
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: copy Pointer', () => {
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.copy(maker, new Uint8Array([1, 2, 3, 4]), 4);
	const ptr = new Uint8Ptr(new Uint8Array([1, 2, 3, 4]).buffer);
	Requirement_Maker.copy(maker, ptr, 2);
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: copy Requirement', () => {
	const a = new Requirement_Maker(Requirement.exprForm);
	const b = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.copy(a, Requirement_Maker.make(b));
	Requirement_Maker.make(a);

	const c = new Requirement_Maker(Requirement.lwcrForm);
	const d = new Requirement_Maker(Requirement.lwcrForm);
	const dr = Requirement_Maker.make(d);
	assertThrowsMacOSError(
		() => Requirement_Maker.copy(c, dr),
		errSecCSReqUnsupported,
	);
});

Deno.test('RequirementMaker: put', () => {
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.put(maker, new Uint8Array([1, 2, 3, 4]).buffer);
	Requirement_Maker.make(maker);
});

Deno.test('RequirementMaker: kind', () => {
	const maker = new Requirement_Maker(Requirement.exprForm);
	Requirement_Maker.kind(maker, Requirement.lwcrForm);
	assertEquals(
		Requirement.kind(Requirement_Maker.make(maker)),
		Requirement.lwcrForm,
	);
});
