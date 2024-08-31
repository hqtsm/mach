import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {stringToBytes} from './util.ts';

void describe('util', () => {
	void describe('stringToBytes', () => {
		void it('foo', async () => {
			const b = stringToBytes('foo');
			deepStrictEqual(b, new Uint8Array([0x66, 0x6f, 0x6f]));
		});

		void it('foo null', async () => {
			const b = stringToBytes('foo\0');
			deepStrictEqual(b, new Uint8Array([0x66, 0x6f, 0x6f, 0x00]));
		});

		void it('U+00A3', async () => {
			const b = stringToBytes('\u00A3');
			deepStrictEqual(b, new Uint8Array([0xc2, 0xa3]));
		});

		void it('U+20AC', async () => {
			const b = stringToBytes('\u20AC');
			deepStrictEqual(b, new Uint8Array([0xe2, 0x82, 0xac]));
		});

		void it('U+10348', async () => {
			const b = stringToBytes('\u{10348}');
			deepStrictEqual(b, new Uint8Array([0xf0, 0x90, 0x8d, 0x88]));
		});
	});
});
