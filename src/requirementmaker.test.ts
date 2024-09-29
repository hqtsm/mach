import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {kSecCodeMagicRequirement} from './const.ts';
import {unhex} from './util.spec.ts';
import {RequirementMaker} from './requirementmaker.ts';

function fibinacci(n: number) {
	const fib = [1, 1];
	for (let i = 2; i <= n; i++) {
		fib[i] = fib[i - 2] + fib[i - 1];
	}
	fib.length = n;
	return fib;
}

void describe('requirementmaker', () => {
	void it('alloc', () => {
		// identifier "com.apple.simple"
		const data = unhex(
			'00 00 00 02',
			'00 00 00 10',
			'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65'
		);
		const rm = new RequirementMaker(Requirement.exprForm);
		const add = rm.alloc(data.byteLength);
		add.set(data);
		const r = rm.make();
		const dv = new DataView(r.buffer, r.byteOffset, r.byteLength);
		strictEqual(dv.getUint32(0), kSecCodeMagicRequirement);
		strictEqual(dv.getUint32(4), r.byteLength);
		strictEqual(dv.getUint32(8), Requirement.exprForm);
		deepStrictEqual(
			new Uint8Array(r.buffer, r.byteOffset + 12, r.byteLength - 12),
			data
		);
	});

	void it('alloc grow fibonacci', () => {
		const rm = new RequirementMaker(Requirement.lwcrForm);
		for (const size of fibinacci(25)) {
			const d = new Uint8Array(size);
			d.fill((size % 255) + 1);
			rm.alloc(size).set(d);
		}
		const r = rm.make();
		const dv = new DataView(r.buffer, r.byteOffset, r.byteLength);
		strictEqual(dv.getUint32(0), kSecCodeMagicRequirement);
		strictEqual(dv.getUint32(4), r.byteLength);
		strictEqual(dv.getUint32(8), Requirement.lwcrForm);
	});

	void it('alloc grow fast', () => {
		const rm = new RequirementMaker(Requirement.lwcrForm);
		for (const size of [0xff, 0xfff, 0xffff, 0xfffff, 0xffffff]) {
			const d = new Uint8Array(size);
			d.fill((size % 255) + 1);
			rm.alloc(size).set(d);
		}
		const r = rm.make();
		const dv = new DataView(r.buffer, r.byteOffset, r.byteLength);
		strictEqual(dv.getUint32(0), kSecCodeMagicRequirement);
		strictEqual(dv.getUint32(4), r.byteLength);
		strictEqual(dv.getUint32(8), Requirement.lwcrForm);
	});
});
