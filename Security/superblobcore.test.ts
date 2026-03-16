import { assertEquals, assertInstanceOf } from '@std/assert';
import { type Class, constant } from '@hqtsm/class';
import { SuperBlobCore } from './superblobcore.ts';
import { BlobCore } from './blobcore.ts';

const MAGIC = 0x12345678;

class Example extends SuperBlobCore {
	declare public readonly ['constructor']: Class<typeof Example>;

	public static override readonly typeMagic = MAGIC;

	static {
		constant(this, 'typeMagic');
	}
}

Deno.test('count', () => {
	const data = new ArrayBuffer(100);
	const example = new Example(data);
	Example.setup(example, 12 + 2 * 8, 2);
	assertEquals(Example.count(example), 2);
});

Deno.test('type', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new Example(data);
	Example.setup(example, 12 + 2 * 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	assertEquals(Example.type(example, 0), 0x11111111);
	assertEquals(Example.type(example, 1), 0x22222222);
});

Deno.test('blob', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new Example(data);
	Example.setup(example, 12 + 2 * 8 + 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	view.setUint32(24, 12 + 2 * 8);
	view.setUint32(28, 0x11223344);
	view.setUint32(32, 8);
	assertEquals(Example.blob(example, 0), null);
	const blob = Example.blob(example, 1);
	assertInstanceOf(blob, BlobCore);
	assertEquals(BlobCore.magic(blob), 0x11223344);
	assertEquals(BlobCore.size(blob), 8);
});

Deno.test('find', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new Example(data);
	Example.setup(example, 12 + 2 * 8 + 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	view.setUint32(24, 12 + 2 * 8);
	view.setUint32(28, 0x11223344);
	view.setUint32(32, 8);
	assertEquals(Example.find(example, 0x11111111), null);
	const blob = Example.find(example, 0x22222222);
	assertInstanceOf(blob, BlobCore);
	assertEquals(BlobCore.magic(blob), 0x11223344);
	assertEquals(BlobCore.size(blob), 8);
});
