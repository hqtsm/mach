import { assertEquals } from '@std/assert';
import { type Class, constant } from '@hqtsm/class';
import { BlobWrapper } from './blobwrapper.ts';
import { SuperBlob } from './superblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';
import { BlobCore } from './blobcore.ts';

const MAGIC = 0x12345678;

class Example extends SuperBlob {
	declare public readonly ['constructor']: Class<typeof Example>;

	public static override readonly typeMagic = MAGIC;

	static {
		constant(this, 'typeMagic');
	}
}

class ExampleMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Class<typeof ExampleMaker>;

	public static override readonly SuperBlob = Example;

	static {
		constant(this, 'SuperBlob');
	}
}

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SuperBlob.BYTE_LENGTH, 12);
});

Deno.test('type', () => {
	const maker = new ExampleMaker();
	const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const blob = BlobWrapper.alloc(data, data.byteLength);
	maker.add(0x01020304, blob);
	maker.add(0x10203040, blob);
	const sb = maker.make();
	assertEquals(Example.type(sb, 0), 0x01020304);
	assertEquals(Example.type(sb, 1), 0x10203040);
});

Deno.test('blob', () => {
	const maker = new ExampleMaker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1, data1.byteLength);
	const blob2 = BlobWrapper.alloc(data2, data2.byteLength);
	maker.add(1, blob1);
	maker.add(2, blob2);
	const sb = maker.make();
	const get1 = Example.blob(sb, 0)!;
	const get2 = Example.blob(sb, 1)!;

	assertEquals(
		new Uint8Array(get1.buffer, get1.byteOffset, BlobCore.size(get1)),
		new Uint8Array(blob1.buffer, 0, 16),
	);

	// No offset means null. What would create this?
	new DataView(sb.buffer).setUint32(16, 0);
	assertEquals(Example.blob(sb, 0), null);

	assertEquals(
		new Uint8Array(get2.buffer, get2.byteOffset, BlobCore.size(get2)),
		new Uint8Array(blob2.buffer, 0, 16),
	);
});

Deno.test('find', () => {
	const maker = new ExampleMaker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1, data1.byteLength);
	const blob2 = BlobWrapper.alloc(data2, data2.byteLength);
	maker.add(1, blob1);
	maker.add(2, blob2);
	const sb = maker.make();
	const get1 = Example.find(sb, 1)!;
	const get2 = Example.find(sb, 2)!;
	const get3 = Example.find(sb, 3)!;
	assertEquals(
		new Uint8Array(get1.buffer, get1.byteOffset, BlobCore.size(get1)),
		new Uint8Array(blob1.buffer, 0, 16),
	);
	assertEquals(
		new Uint8Array(get2.buffer, get2.byteOffset, BlobCore.size(get2)),
		new Uint8Array(blob2.buffer, 0, 16),
	);
	assertEquals(get3, null);
});

Deno.test('count', () => {
	const maker = new ExampleMaker();
	const data1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
	const data2 = new Uint8Array([2, 3, 4, 5, 6, 7, 8, 9]);
	const blob1 = BlobWrapper.alloc(data1, data1.byteLength);
	const blob2 = BlobWrapper.alloc(data2, data2.byteLength);
	maker.add(1, blob1);
	maker.add(2, blob1);
	maker.add(2, blob2);
	const sb = maker.make();
	assertEquals(Example.count(sb), 2);
});
