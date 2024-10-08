import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';
import {open} from 'node:fs/promises';

import {MemoryFile} from './memoryfile.ts';
import type {FileLike} from './type.ts';

const BS = 4096;

void describe('MemoryFile', () => {
	void it('stat two blocks', async () => {
		const size = BS * 2;
		const m = new MemoryFile(size);

		const r = await m.stat();
		strictEqual(r.size, size);
		strictEqual(r.blocks, 2);
		strictEqual(r.blksize, BS);
	});

	void it('stat two blocks plus one', async () => {
		const size = BS * 2;
		const m = new MemoryFile(size + 1);

		const r = await m.stat();
		strictEqual(r.size, size + 1);
		strictEqual(r.blocks, 3);
		strictEqual(r.blksize, BS);
	});

	void it('stat custom blksize', async () => {
		const CBS = 42;
		const size = Math.round(CBS * 2.5);
		const m = new MemoryFile(size, CBS);

		const r = await m.stat();
		strictEqual(r.size, size);
		strictEqual(r.blocks, 3);
		strictEqual(r.blksize, CBS);
	});

	void it('write expand', async () => {
		let r;
		const d = new Uint8Array(1);
		const m = new MemoryFile();

		r = await m.write(d, 0, 1, 10);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, 11);

		r = await m.write(d, 0, 1, 99);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, 100);

		r = await m.write(d, 0, 1, 100);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, 101);

		r = await m.write(d, 0, 1, 99);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, 101);

		r = await m.write(d, 0, 1, BS - 1);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, BS);

		r = await m.write(d, 0, 1, BS);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, BS + 1);

		r = await m.write(d, 0, 1, BS * 2);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, BS * 2 + 1);
	});

	void it('sparse', async () => {
		let r;
		const d = new Uint8Array(1);
		const m = new MemoryFile();

		r = await m.write(d, 0, 1, 10000);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, 10001);

		d[0] = 123;
		r = await m.read(d, 0, 1, 0);
		strictEqual(r.bytesRead, 1);
		strictEqual((await m.stat()).size, 10001);
		strictEqual(d[0], 0);

		r = await m.write(d, 0, 1, 0);
		strictEqual(r.bytesWritten, 1);
		strictEqual((await m.stat()).size, 10001);
	});

	void it('write many pieces overlapping', async () => {
		const m = new MemoryFile();
		let offset = 0;
		for (let l = 0; l < 10000; l++) {
			const sub = offset ? 1 : 0;
			const d = new Uint8Array(l);

			// eslint-disable-next-line no-await-in-loop
			const r = await m.write(d, 0, l, offset - sub);
			strictEqual(r.bytesWritten, l);

			offset += l - sub;

			// eslint-disable-next-line no-await-in-loop
			strictEqual((await m.stat()).size, offset);
		}
	});

	void it('read simple', async () => {
		let r;
		let dr;
		const m = new MemoryFile();
		const dw = new Uint8Array([1, 2, 3, 4, 5]);

		r = await m.write(dw, 0, dw.length, 5);
		strictEqual(r.bytesWritten, dw.length);

		dr = new Uint8Array(dw.length);
		r = await m.read(dr, 0, dw.length, 5);
		strictEqual(r.bytesRead, dw.length);
		deepStrictEqual(dr, dw);

		dr = new Uint8Array([9, 9, 9, 9, 9]);
		r = await m.read(dr, 0, 0, 5);
		strictEqual(r.bytesRead, 0);
		deepStrictEqual(dr, new Uint8Array([9, 9, 9, 9, 9]));

		dr = new Uint8Array([9, 9, 9, 9, 9]);
		r = await m.read(dr, 2, 1, 5);
		strictEqual(r.bytesRead, 1);
		deepStrictEqual(dr, new Uint8Array([9, 9, 1, 9, 9]));

		dr = new Uint8Array([9, 9, 9, 9, 9]);
		r = await m.read(dr, 1, 3, 5);
		strictEqual(r.bytesRead, 3);
		deepStrictEqual(dr, new Uint8Array([9, 1, 2, 3, 9]));
	});

	void it('read over', async () => {
		let r;
		const m = new MemoryFile();
		const dw = new Uint8Array([1, 2, 3, 4, 5]);

		r = await m.write(dw, 0, dw.length, 5);
		strictEqual(r.bytesWritten, dw.length);

		const dr = new Uint8Array(dw.length);
		r = await m.read(dr, 0, dw.length, 6);
		strictEqual(r.bytesRead, 4);
		deepStrictEqual(dr, new Uint8Array([2, 3, 4, 5, 0]));
	});

	void it('read multiple blocks', async () => {
		let r;
		const m = new MemoryFile();
		const dw = new Uint8Array(Math.round(BS * 5.5));
		for (let i = 0; i < dw.length; i++) {
			dw[i] = i % 256;
		}

		r = await m.write(dw, 0, dw.length, 5);
		strictEqual(r.bytesWritten, dw.length);

		const dr = new Uint8Array(dw.length);
		r = await m.read(dr, 0, dw.length, 5);
		strictEqual(r.bytesRead, dw.length);
		deepStrictEqual(dr, dw);
	});

	void it('truncate bigger', async () => {
		for (const size of [0, BS - 1, BS, BS + 1, BS * 2, BS * 3.5]) {
			const m = new MemoryFile(size);

			const dw = new Uint8Array(size);
			for (let i = dw.length; i--; ) {
				dw[i] = (i + 1) % 256;
			}

			// eslint-disable-next-line no-await-in-loop
			await m.write(dw, 0, dw.length, 0);

			for (const more of [1, 22, 333, 4444, 55555, 666666]) {
				const bigger = size + more;

				// eslint-disable-next-line no-await-in-loop
				await m.truncate(bigger);

				// eslint-disable-next-line no-await-in-loop
				const r = await m.stat();
				deepStrictEqual(r.size, bigger);
				deepStrictEqual(r.blocks, Math.ceil(bigger / BS));

				const dr = new Uint8Array(size);

				// eslint-disable-next-line no-await-in-loop
				await m.read(dr, 0, size, 0);
				deepStrictEqual(dr, dw);

				const dm = new Uint8Array(more);
				dm.fill(1);

				// eslint-disable-next-line no-await-in-loop
				await m.read(dm, 0, more, size);
				deepStrictEqual(dm, new Uint8Array(more));
			}
		}
	});

	void it('truncate smaller', async () => {
		for (const size of [0, BS - 1, BS, BS + 1, BS * 2, BS * 3.5]) {
			for (const more of [1, 22, 333, 4444, 55555, 666666]) {
				const bigger = size + more;
				const m = new MemoryFile(bigger);

				const dw = new Uint8Array(bigger);
				for (let i = dw.length; i--; ) {
					dw[i] = (i + 1) % 256;
				}

				// eslint-disable-next-line no-await-in-loop
				await m.write(dw, 0, dw.length, 0);

				// eslint-disable-next-line no-await-in-loop
				await m.truncate(size);

				// eslint-disable-next-line no-await-in-loop
				const r = await m.stat();
				deepStrictEqual(r.size, size);
				deepStrictEqual(r.blocks, Math.ceil(size / BS));

				// eslint-disable-next-line no-await-in-loop
				await m.truncate(bigger);

				const drKeep = new Uint8Array(size);
				// eslint-disable-next-line no-await-in-loop
				await m.read(drKeep, 0, size, 0);
				deepStrictEqual(drKeep, dw.subarray(0, size));

				const drLost = new Uint8Array(more);
				// eslint-disable-next-line no-await-in-loop
				await m.read(drLost, 0, more, size);
				deepStrictEqual(drLost, new Uint8Array(more));
			}
		}
	});

	void it('like node', async () => {
		const m = new MemoryFile();
		const f = await open('LICENSE.txt', 'r');
		try {
			const n: FileLike = f;
			let d;
			{
				const {size} = await n.stat();
				d = new Uint8Array(size);
				await n.read(d, 0, d.length, 0);
				await m.write(d, 0, d.length, 0);
			}

			for (let i = 0, o = 0, l = 0; o < d.length; i++) {
				const md = new Uint8Array(l + 2);
				const nd = new Uint8Array(l + 2);

				nd[0] = md[0] = (i % 10) + 1;
				nd[l + 1] = md[l + 1] = ((i + 1) % 10) + 1;

				// eslint-disable-next-line no-await-in-loop
				const mr = await m.read(md, 1, l, o);
				// eslint-disable-next-line no-await-in-loop
				const nr = await n.read(nd, 1, l, o);

				strictEqual(mr.bytesRead, nr.bytesRead);
				deepStrictEqual(md, nd);

				l = Math.round((l || 1) * 1.5);
				o += l;
			}
		} finally {
			await f.close();
		}
	});
});
