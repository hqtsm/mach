import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {cast} from './util.ts';

void describe('util', () => {
	void describe('cast', () => {
		void it('all', () => {
			const b = new ArrayBuffer(3);
			const a = new Uint8Array(b);
			a.set([0x61, 0x62, 0x63]);
			const dv = cast(DataView, a);
			strictEqual(dv.byteOffset, 0);
			strictEqual(dv.byteLength, 3);
			strictEqual(dv.getUint8(0), 0x61);
			strictEqual(dv.getUint8(1), 0x62);
			strictEqual(dv.getUint8(2), 0x63);
		});

		void it('sub', () => {
			const b = new ArrayBuffer(4);
			const a = new Uint8Array(b);
			a.set([0x61, 0x62, 0x63, 0x64]);
			const dv = cast(DataView, a.subarray(1));
			strictEqual(dv.byteOffset, 1);
			strictEqual(dv.byteLength, 3);
			strictEqual(dv.getUint8(0), 0x62);
			strictEqual(dv.getUint8(1), 0x63);
			strictEqual(dv.getUint8(2), 0x64);
		});
	});
});
