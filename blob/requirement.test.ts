import { assertEquals } from '@std/assert';
import { unhex } from '../spec/hex.ts';
import { Requirement } from './requirement.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Requirement.BYTE_LENGTH, 12);
});

Deno.test('empty kind 0 (invalid?)', () => {
	const { BYTE_LENGTH } = Requirement;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const r = new Requirement(buffer);
	r.initialize2(BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 00 00 00 00 0C 00 00 00 00'),
	);
});

Deno.test('empty kind 1 (invalid?)', () => {
	const { BYTE_LENGTH } = Requirement;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const r = new Requirement(buffer);
	r.initialize2(BYTE_LENGTH);
	r.kind = Requirement.exprForm;
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 00 00 00 00 0C 00 00 00 01'),
	);
});

Deno.test('empty kind 2 (invalid?)', () => {
	const { BYTE_LENGTH } = Requirement;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const r = new Requirement(buffer);
	r.initialize2(BYTE_LENGTH);
	r.kind = Requirement.lwcrForm;
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 00 00 00 00 0C 00 00 00 02'),
	);
});
