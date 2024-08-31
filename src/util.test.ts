import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {stringToBytes} from './util.ts';

void describe('util', () => {
	void describe('stringToBytes', () => {
		void it('abc', () => {
			const b = stringToBytes('abc');
			deepStrictEqual(b, new Uint8Array([0x61, 0x62, 0x63]));
		});

		void it('abc null', () => {
			const b = stringToBytes('abc\0');
			deepStrictEqual(b, new Uint8Array([0x61, 0x62, 0x63, 0x00]));
		});

		void it('U+00A3', () => {
			const b = stringToBytes('\u00A3');
			deepStrictEqual(b, new Uint8Array([0xc2, 0xa3]));
		});

		void it('U+20AC', () => {
			const b = stringToBytes('\u20AC');
			deepStrictEqual(b, new Uint8Array([0xe2, 0x82, 0xac]));
		});

		void it('U+10348', () => {
			const b = stringToBytes('\u{10348}');
			deepStrictEqual(b, new Uint8Array([0xf0, 0x90, 0x8d, 0x88]));
		});
	});
});
