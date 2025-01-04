import { assertEquals, assertThrows } from '@std/assert';
import { thin } from './macho.ts';
import { unhex } from './hex.ts';

Deno.test('machoThin', () => {
	assertThrows(() => thin(new Uint8Array(4), 0));
	assertEquals(
		thin(
			unhex(
				[
					'CA FE BA BE',
					'00 00 00 01',
					'00 00 00 01',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
	assertEquals(
		thin(
			unhex(
				[
					'BE BA FE CA',
					'01 00 00 00',
					'01 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
	assertEquals(
		thin(
			unhex(
				[
					'CA FE BA BF',
					'00 00 00 01',
					'00 00 00 01',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
	assertEquals(
		thin(
			unhex(
				[
					'BF BA FE CA',
					'01 00 00 00',
					'01 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
					'00 00 00 00',
				].join(' '),
			),
			1,
		),
		new Uint8Array(),
	);
});
