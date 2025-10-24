import { assertEquals } from '@std/assert';
import { unhex } from '../spec/hex.ts';
import { Requirements } from './requirements.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(Requirements.BYTE_LENGTH, 12);
});

Deno.test('empty', () => {
	const { BYTE_LENGTH } = Requirements;
	const buffer = new ArrayBuffer(BYTE_LENGTH);
	const rs = new Requirements(buffer);
	rs.initializeLength(BYTE_LENGTH);
	assertEquals(
		new Uint8Array(buffer),
		unhex('FA DE 0C 01 00 00 00 0C 00 00 00 00'),
	);
});
