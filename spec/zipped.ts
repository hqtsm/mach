import { assert } from '@std/assert';

async function inflate(
	data: Readonly<Uint8Array>,
	size: number,
	crc: number,
): Promise<Uint8Array> {
	const d = new Uint8Array(size);
	const r: ReadableStreamDefaultReader<Uint8Array> = new ReadableStream<
		Uint8Array
	>({
		start(controller): void {
			controller.enqueue(
				new Uint8Array([31, 139, 8, 0, 0, 0, 0, 0, 0, 0]),
			);
			controller.enqueue(data);
			const tail = new ArrayBuffer(8);
			const view = new DataView(tail);
			view.setUint32(0, crc, true);
			view.setUint32(4, size, true);
			controller.enqueue(new Uint8Array(tail));
			controller.close();
		},
	})
		.pipeThrough(new DecompressionStream('gzip'))
		.getReader();
	let i = 0;
	for (;;) {
		// deno-lint-ignore no-await-in-loop
		const { done, value } = await r.read();
		if (done) {
			break;
		}
		d.set(value, i);
		i += value.length;
	}
	return d;
}

export async function* zipped(file: string): AsyncGenerator<
	readonly [string, () => Promise<Uint8Array>]
> {
	const d = await Deno.readFile(file);
	const v = new DataView(d.buffer, d.byteOffset, d.byteLength);
	const dirSize = v.getUint32(d.byteLength - 22 + 12, true);
	const dirOffset = v.getUint32(d.byteLength - 22 + 16, true);

	for (let i = 0; i < dirSize;) {
		i += 4;
		i += 2;
		i += 2;
		i += 2;
		const compression = v.getUint16(dirOffset + i, true);
		i += 2;
		i += 2;
		i += 2;
		const crc = v.getUint32(dirOffset + i, true);
		i += 4;
		const cSize = v.getUint32(dirOffset + i, true);
		i += 4;
		const uSize = v.getUint32(dirOffset + i, true);
		i += 4;
		const nameSize = v.getUint16(dirOffset + i, true);
		i += 2;
		const extraSize = v.getUint16(dirOffset + i, true);
		i += 2;
		const commentSize = v.getUint16(dirOffset + i, true);
		i += 2;
		i += 2;
		i += 2;
		i += 4;
		const headerOffset = v.getUint32(dirOffset + i, true);
		i += 4;
		const name = new TextDecoder().decode(
			d.subarray(dirOffset + i, dirOffset + i + nameSize),
		);
		i += nameSize;
		i += extraSize;
		i += commentSize;

		yield [name, async () => {
			assert(
				compression === 0 || compression === 8,
				`Unknown compression type: ${compression}`,
			);
			const inflater = compression ? inflate : null;

			let i = 0;
			i += 4;
			i += 2;
			i += 2;
			i += 2;
			i += 2;
			i += 2;
			i += 4;
			i += 4;
			i += 4;
			const fileNameSize = v.getUint16(headerOffset + i, true);
			i += 2;
			const extraSize = v.getUint16(headerOffset + i, true);
			i += 2;
			i += fileNameSize;
			i += extraSize;

			const cData = new Uint8Array(
				d.buffer,
				d.byteOffset + headerOffset + i,
				cSize,
			);
			return inflater ? await inflater(cData, uSize, crc) : cData;
		}];
	}
}
