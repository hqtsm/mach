import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {Requirement} from './requirement.ts';
import {kSecCodeMagicRequirement, opAnd, opOr} from './const.ts';
import {unhex} from './util.spec.ts';
import {RequirementMaker} from './requirementmaker.ts';
import {RequirementMakerChain} from './requirementmakerchain.ts';

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
		const maker = new RequirementMaker(Requirement.exprForm);
		const add = maker.alloc(data.byteLength);
		add.set(data);
		const r = maker.make();
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
		const maker = new RequirementMaker(Requirement.lwcrForm);
		for (const size of fibinacci(25)) {
			const d = new Uint8Array(size);
			d.fill((size % 255) + 1);
			maker.alloc(size).set(d);
		}
		const r = maker.make();
		const dv = new DataView(r.buffer, r.byteOffset, r.byteLength);
		strictEqual(dv.getUint32(0), kSecCodeMagicRequirement);
		strictEqual(dv.getUint32(4), r.byteLength);
		strictEqual(dv.getUint32(8), Requirement.lwcrForm);
	});

	void it('alloc grow fast', () => {
		const maker = new RequirementMaker(Requirement.lwcrForm);
		for (const size of [0xff, 0xfff, 0xffff, 0xfffff, 0xffffff]) {
			const d = new Uint8Array(size);
			d.fill((size % 255) + 1);
			maker.alloc(size).set(d);
		}
		const r = maker.make();
		const dv = new DataView(r.buffer, r.byteOffset, r.byteLength);
		strictEqual(dv.getUint32(0), kSecCodeMagicRequirement);
		strictEqual(dv.getUint32(4), r.byteLength);
		strictEqual(dv.getUint32(8), Requirement.lwcrForm);
	});

	void it('identifier "com.apple.simple"', () => {
		const data = unhex(
			'FA DE 0C 00 00 00 00 24 00 00 00 01',
			'00 00 00 02',
			'00 00 00 10',
			'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65'
		);
		const maker = new RequirementMaker(Requirement.exprForm);
		maker.ident(new TextEncoder().encode('com.apple.simple'));
		const r = maker.make();
		deepStrictEqual(
			new Uint8Array(r.buffer, r.byteOffset, r.byteLength),
			data
		);
	});

	void it('anchor apple and identifier "com.apple.simple"', () => {
		const data = unhex(
			'FA DE 0C 00 00 00 00 2C 00 00 00 01',
			'00 00 00 06',
			'00 00 00 03',
			'00 00 00 02',
			'00 00 00 10',
			'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65'
		);
		const maker = new RequirementMaker(Requirement.exprForm);

		const and = new RequirementMakerChain(maker, opAnd);
		maker.anchor();
		and.add();
		maker.ident(new TextEncoder().encode('com.apple.simple'));
		and.add();

		const r = maker.make();
		deepStrictEqual(
			new Uint8Array(r.buffer, r.byteOffset, r.byteLength),
			data
		);
	});

	void it('identifier "com.apple.simple" or anchor apple generic', () => {
		const data = unhex(
			'FA DE 0C 00 00 00 00 2C 00 00 00 01',
			'00 00 00 07',
			'00 00 00 02',
			'00 00 00 10',
			'63 6F 6D 2E 61 70 70 6C 65 2E 73 69 6D 70 6C 65',
			'00 00 00 0F'
		);
		const maker = new RequirementMaker(Requirement.exprForm);

		const or = new RequirementMakerChain(maker, opOr);
		maker.ident(new TextEncoder().encode('com.apple.simple'));
		or.add();
		maker.anchorGeneric();
		or.add();

		const r = maker.make();
		deepStrictEqual(
			new Uint8Array(r.buffer, r.byteOffset, r.byteLength),
			data
		);
	});

	void it('(a and b) or (c and d)', () => {
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
			'00 00 00 0F'
		);
		const maker = new RequirementMaker(Requirement.exprForm);

		const or = new RequirementMakerChain(maker, opOr);
		let and;

		and = new RequirementMakerChain(maker, opAnd);
		maker.ident(new TextEncoder().encode('com.apple.app'));
		and.add();
		maker.anchor();
		and.add();

		or.add();

		and = new RequirementMakerChain(maker, opAnd);
		maker.ident(new TextEncoder().encode('com.apple.gen'));
		and.add();
		maker.anchorGeneric();
		and.add();

		or.add();

		const r = maker.make();
		deepStrictEqual(
			new Uint8Array(r.buffer, r.byteOffset, r.byteLength),
			data
		);
	});

	void it('(a or b) and (c or d)', () => {
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
			'00 00 00 0F'
		);
		const maker = new RequirementMaker(Requirement.exprForm);

		const and = new RequirementMakerChain(maker, opAnd);
		let or;

		or = new RequirementMakerChain(maker, opOr);
		maker.ident(new TextEncoder().encode('com.apple.app'));
		or.add();
		maker.anchor();
		or.add();

		and.add();

		or = new RequirementMakerChain(maker, opOr);
		maker.ident(new TextEncoder().encode('com.apple.gen'));
		or.add();
		maker.anchorGeneric();
		or.add();

		and.add();

		const r = maker.make();
		deepStrictEqual(
			new Uint8Array(r.buffer, r.byteOffset, r.byteLength),
			data
		);
	});
});
