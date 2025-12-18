import { assertEquals, assertThrows } from '@std/assert';
import {
	kSecCodeMagicRequirement,
	opAnd,
	opOr,
	PLATFORM_MACOS,
} from '../const.ts';
import { unhex } from '../spec/hex.ts';
import { Requirement } from './requirement.ts';
import { RequirementMaker } from './requirementmaker.ts';
import { RequirementMakerChain } from './requirementmakerchain.ts';
import { Uint8Ptr } from '@hqtsm/struct';

function fibinacci(n: number): number[] {
	const fib = [1, 1];
	for (let i = 2; i <= n; i++) {
		fib[i] = fib[i - 2] + fib[i - 1];
	}
	fib.length = n;
	return fib;
}

Deno.test('alloc', () => {
	// identifier "com.apple.simple"
	const data = unhex(
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new RequirementMaker(Requirement.exprForm);
	const add = RequirementMaker.alloc(maker, data.byteLength);
	add.set(data);
	const r = RequirementMaker.make(maker);
	const dv = new DataView(r.buffer, r.byteOffset, Requirement.size(r));
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Requirement.size(r));
	assertEquals(dv.getUint32(8), Requirement.exprForm);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset + 12, Requirement.size(r) - 12),
		data,
	);
});

Deno.test('alloc grow fibonacci', () => {
	const maker = new RequirementMaker(Requirement.lwcrForm);
	for (const size of fibinacci(25)) {
		const d = new Uint8Array(size);
		d.fill((size % 255) + 1);
		RequirementMaker.alloc(maker, size).set(d);
	}
	const r = RequirementMaker.make(maker);
	const dv = new DataView(r.buffer, r.byteOffset, Requirement.size(r));
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Requirement.size(r));
	assertEquals(dv.getUint32(8), Requirement.lwcrForm);
});

Deno.test('alloc grow fast', () => {
	const maker = new RequirementMaker(Requirement.lwcrForm);
	for (const size of [0xff, 0xfff, 0xffff, 0xfffff, 0xffffff]) {
		const d = new Uint8Array(size);
		d.fill((size % 255) + 1);
		RequirementMaker.alloc(maker, size).set(d);
	}
	const r = RequirementMaker.make(maker);
	const dv = new DataView(r.buffer, r.byteOffset, Requirement.size(r));
	assertEquals(dv.getUint32(0), kSecCodeMagicRequirement);
	assertEquals(dv.getUint32(4), Requirement.size(r));
	assertEquals(dv.getUint32(8), Requirement.lwcrForm);
});

Deno.test('identifier "com.apple.simple"', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 24 00 00 00 01',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.ident(maker, new TextEncoder().encode('com.apple.simple'));
	const r = RequirementMaker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('anchor apple and identifier "com.apple.simple"', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 2C 00 00 00 01',
		'00 00 00 06',
		'00 00 00 03',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
	);
	const maker = new RequirementMaker(Requirement.exprForm);

	const and = new RequirementMakerChain(maker, opAnd);
	assertEquals(RequirementMakerChain.empty(and), true);
	RequirementMaker.anchor(maker);
	RequirementMakerChain.add(and);
	assertEquals(RequirementMakerChain.empty(and), false);
	RequirementMaker.ident(maker, new TextEncoder().encode('com.apple.simple'));
	RequirementMakerChain.add(and);
	assertEquals(RequirementMakerChain.empty(and), false);

	const r = RequirementMaker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('identifier "com.apple.simple" or anchor apple generic', () => {
	const data = unhex(
		'FA DE 0C 00 00 00 00 2C 00 00 00 01',
		'00 00 00 07',
		'00 00 00 02',
		'00 00 00 10',
		'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
		'00 00 00 0F',
	);
	const maker = new RequirementMaker(Requirement.exprForm);

	const or = new RequirementMakerChain(maker, opOr);
	assertEquals(RequirementMakerChain.empty(or), true);
	RequirementMaker.ident(maker, new TextEncoder().encode('com.apple.simple'));
	RequirementMakerChain.add(or);
	assertEquals(RequirementMakerChain.empty(or), false);
	RequirementMaker.anchorGeneric(maker);
	RequirementMakerChain.add(or);
	assertEquals(RequirementMakerChain.empty(or), false);

	const r = RequirementMaker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('(a and b) or (c and d)', () => {
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
	const maker = new RequirementMaker(Requirement.exprForm);

	const or = new RequirementMakerChain(maker, opOr);
	let and;

	and = new RequirementMakerChain(maker, opAnd);
	RequirementMaker.ident(maker, new TextEncoder().encode('com.apple.app'));
	RequirementMakerChain.add(and);
	RequirementMaker.anchor(maker);
	RequirementMakerChain.add(and);

	RequirementMakerChain.add(or);

	and = new RequirementMakerChain(maker, opAnd);
	RequirementMaker.ident(maker, new TextEncoder().encode('com.apple.gen'));
	RequirementMakerChain.add(and);
	RequirementMaker.anchorGeneric(maker);
	RequirementMakerChain.add(and);

	RequirementMakerChain.add(or);

	const r = RequirementMaker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('(a or b) and (c or d)', () => {
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
	const maker = new RequirementMaker(Requirement.exprForm);

	const and = new RequirementMakerChain(maker, opAnd);
	let or;

	or = new RequirementMakerChain(maker, opOr);
	RequirementMaker.ident(maker, new TextEncoder().encode('com.apple.app'));
	RequirementMakerChain.add(or);
	RequirementMaker.anchor(maker);
	RequirementMakerChain.add(or);

	RequirementMakerChain.add(and);

	or = new RequirementMakerChain(maker, opOr);
	RequirementMaker.ident(
		maker,
		new TextEncoder().encode('com.apple.gen').buffer,
	);
	RequirementMakerChain.add(or);
	RequirementMaker.anchorGeneric(maker);
	RequirementMakerChain.add(or);

	RequirementMakerChain.add(and);

	const r = RequirementMaker.make(maker);
	assertEquals(
		new Uint8Array(r.buffer, r.byteOffset, Requirement.size(r)),
		data,
	);
});

Deno.test('anchorDigest', () => {
	const hash = new Uint8Array(
		[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
	);
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.anchorDigest(maker, 1, hash);
	RequirementMaker.make(maker);
});

Deno.test('trustedAnchor', () => {
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.trustedAnchor(maker, null);
	RequirementMaker.trustedAnchor(maker, 1);
	RequirementMaker.make(maker);
});

Deno.test('infoKey', () => {
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.infoKey(
		maker,
		new Uint8Array([1, 2]),
		new Uint8Array([3, 4]),
	);
	RequirementMaker.make(maker);
});

Deno.test('cdhash', () => {
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.cdhash(maker, new Uint8Array([1, 2, 3, 4]));
	RequirementMaker.make(maker);
});

Deno.test('platform', () => {
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.platform(maker, PLATFORM_MACOS);
	RequirementMaker.make(maker);
});

Deno.test('copy Pointer', () => {
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.copy(maker, new Uint8Array([1, 2, 3, 4]), 4);
	const ptr = new Uint8Ptr(new Uint8Array([1, 2, 3, 4]).buffer);
	RequirementMaker.copy(maker, ptr, 2);
	RequirementMaker.make(maker);
});

Deno.test('copy Requirement', () => {
	const a = new RequirementMaker(Requirement.exprForm);
	const b = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.copy(a, RequirementMaker.make(b));
	RequirementMaker.make(a);

	const c = new RequirementMaker(Requirement.lwcrForm);
	const d = new RequirementMaker(Requirement.lwcrForm);
	const dr = RequirementMaker.make(d);
	assertThrows(
		() => RequirementMaker.copy(c, dr),
		RangeError,
		`Unsupported requirement kind: ${Requirement.kind(dr)}`,
	);
});

Deno.test('put', () => {
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.put(maker, new Uint8Array([1, 2, 3, 4]).buffer);
	RequirementMaker.make(maker);
});

Deno.test('kind', () => {
	const maker = new RequirementMaker(Requirement.exprForm);
	RequirementMaker.kind(maker, Requirement.lwcrForm);
	assertEquals(
		Requirement.kind(RequirementMaker.make(maker)),
		Requirement.lwcrForm,
	);
});
