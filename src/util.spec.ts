import {open} from 'node:fs/promises';
import {inflateRaw} from 'node:zlib';

async function zlibInflateRaw(data: Buffer) {
	return new Promise<Buffer>((resolve, reject) => {
		inflateRaw(data, (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(data);
		});
	});
}

export async function* zipped(file: string) {
	const f = await open(file, 'r');
	try {
		const {size} = await f.stat();
		const tail = Buffer.alloc(22);
		await f.read(tail, 0, 22, size - 22);
		const dirSize = tail.readUInt32LE(12);
		const dirOffset = tail.readUInt32LE(16);
		const dirData = Buffer.alloc(dirSize);
		await f.read(dirData, 0, dirSize, dirOffset);
		for (let i = 0; i < dirSize; ) {
			i += 4;
			i += 2;
			i += 2;
			i += 2;
			const compression = dirData.readUint16LE(i);
			i += 2;
			i += 2;
			i += 2;
			i += 4;
			const cSize = dirData.readUint32LE(i);
			i += 4;
			const uSize = dirData.readUint32LE(i);
			i += 4;
			const nameSize = dirData.readUint16LE(i);
			i += 2;
			const extraSize = dirData.readUint16LE(i);
			i += 2;
			const commentSize = dirData.readUint16LE(i);
			i += 2;
			i += 2;
			i += 2;
			i += 4;
			const headerOffset = dirData.readUint32LE(i);
			i += 4;
			const name = dirData.toString('utf8', i, i + nameSize);
			i += nameSize;
			i += extraSize;
			i += commentSize;

			yield [
				name,
				async () => {
					let inflater: ((data: Buffer) => Promise<Buffer>) | null;
					switch (compression) {
						case 0: {
							inflater = null;
							break;
						}
						case 8: {
							inflater = zlibInflateRaw;
							break;
						}
						default: {
							throw new Error(
								`Unknown compression type: ${compression}`
							);
						}
					}

					if (!uSize) {
						return new Uint8Array(0);
					}

					const header = Buffer.alloc(30);
					await f.read(header, 0, 30, headerOffset);
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
					const fileNameSize = header.readUint16LE(i);
					i += 2;
					const extraSize = header.readUint16LE(i);
					i += 2;
					i += fileNameSize;
					i += extraSize;

					const cData = Buffer.alloc(cSize);
					await f.read(cData, 0, cSize, headerOffset + i);
					if (!inflater) {
						return new Uint8Array(
							cData.buffer,
							cData.byteOffset,
							cData.byteLength
						);
					}

					const uData = await inflater(cData);
					const {length} = uData;
					if (length !== uSize) {
						throw new Error(
							`Bad decompressed size: ${length} != ${uSize}`
						);
					}
					return new Uint8Array(
						uData.buffer,
						uData.byteOffset,
						uData.byteLength
					);
				}
			] as const;
		}
	} finally {
		await f.close();
	}
}

export async function fixtureMacho(
	kind: string,
	arch: string,
	files: string[]
) {
	const m = new Map(files.map((name, i) => [name, i]));
	const datas: Uint8Array[] = [];
	for await (const [name, read] of zipped(
		`spec/fixtures/macho/${kind}/dist/${arch}.zip`
	)) {
		const i = m.get(name) ?? -1;
		if (i < 0) {
			continue;
		}
		datas[i] = await read();
		m.delete(name);
	}
	if (m.size) {
		throw new Error(`Missing files: ${[...m.keys()].join(' ')}`);
	}
	return datas;
}
