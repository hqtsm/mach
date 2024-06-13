import {describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';
import {open} from 'node:fs/promises';

import {MemoryFile} from './memoryfile';
import {FileLike} from './types';

const BS = 4096;

void describe('memoryfile', () => {
	void describe('MemoryFile', () => {
		void it('stat', async () => {
			const size = 123456;
			const m = new MemoryFile(size);

			const r = await m.stat();
			strictEqual(r.size, size);
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
			const dw = new Uint8Array(20000);
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

				for (let i = 0, l = 1; i + l < d.length; l *= 2) {
					const md = new Uint8Array(l);
					const nd = new Uint8Array(l);

					// eslint-disable-next-line no-await-in-loop
					const mr = await m.read(md, 0, l, i);
					// eslint-disable-next-line no-await-in-loop
					const nr = await n.read(nd, 0, l, i);

					strictEqual(mr.bytesRead, nr.bytesRead);
				}
			} finally {
				await f.close();
			}
		});
	});
});
