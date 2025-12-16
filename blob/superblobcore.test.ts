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
	example.setup(12 + 2 * 8, 2);
	assertEquals(example.count(), 2);
});

Deno.test('type', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new Example(data);
	example.setup(12 + 2 * 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	assertEquals(example.type(0), 0x11111111);
	assertEquals(example.type(1), 0x22222222);
});

Deno.test('blob', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new Example(data);
	example.setup(12 + 2 * 8 + 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	view.setUint32(24, 12 + 2 * 8);
	view.setUint32(28, 0x11223344);
	view.setUint32(32, 8);
	assertEquals(example.blob(0), null);
	const blob = example.blob(1);
	assertInstanceOf(blob, BlobCore);
	assertEquals(blob.magic(), 0x11223344);
	assertEquals(blob.length(), 8);
});

Deno.test('find', () => {
	const data = new ArrayBuffer(100);
	const view = new DataView(data);
	const example = new Example(data);
	example.setup(12 + 2 * 8 + 8, 2);
	view.setUint32(12, 0x11111111);
	view.setUint32(20, 0x22222222);
	view.setUint32(24, 12 + 2 * 8);
	view.setUint32(28, 0x11223344);
	view.setUint32(32, 8);
	assertEquals(example.find(0x11111111), null);
	const blob = example.find(0x22222222);
	assertInstanceOf(blob, BlobCore);
	assertEquals(blob.magic(), 0x11223344);
	assertEquals(blob.length(), 8);
});
