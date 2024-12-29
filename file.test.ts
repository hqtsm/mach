// deno-lint-ignore no-external-import
import { open, stat } from 'node:fs/promises';
import { assertEquals } from '@std/assert';
import { type File, MemoryFile } from './file.ts';

const BS = 4096;

Deno.test('write expand', () => {
	let r;
	const d = new Uint8Array(1);
	const m = new MemoryFile();

	r = m.write(d, 0, 1, 10);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, 11);

	r = m.write(d, 0, 1, 99);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, 100);

	r = m.write(d, 0, 1, 100);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, 101);

	r = m.write(d, 0, 1, 99);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, 101);

	r = m.write(d, 0, 1, BS - 1);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, BS);

	r = m.write(d, 0, 1, BS);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, BS + 1);

	r = m.write(d, 0, 1, BS * 2);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, BS * 2 + 1);
});

Deno.test('sparse', () => {
	let r;
	const d = new Uint8Array(1);
	const m = new MemoryFile();

	r = m.write(d, 0, 1, 10000);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, 10001);

	d[0] = 123;
	r = m.read(d, 0, 1, 0);
	assertEquals(r.bytesRead, 1);
	assertEquals((m.stat()).size, 10001);
	assertEquals(d[0], 0);

	r = m.write(d, 0, 1, 0);
	assertEquals(r.bytesWritten, 1);
	assertEquals((m.stat()).size, 10001);
});

Deno.test('write many pieces overlapping', () => {
	const m = new MemoryFile();
	let offset = 0;
	for (let l = 0; l < 10000; l++) {
		const sub = offset ? 1 : 0;
		const d = new Uint8Array(l);

		const r = m.write(d, 0, l, offset - sub);
		assertEquals(r.bytesWritten, l);

		offset += l - sub;

		assertEquals((m.stat()).size, offset);
	}
});

Deno.test('read simple', () => {
	let r;
	let dr;
	const m = new MemoryFile();
	const dw = new Uint8Array([1, 2, 3, 4, 5]);

	r = m.write(dw, 0, dw.length, 5);
	assertEquals(r.bytesWritten, dw.length);

	dr = new Uint8Array(dw.length);
	r = m.read(dr, 0, dw.length, 5);
	assertEquals(r.bytesRead, dw.length);
	assertEquals(dr, dw);

	dr = new Uint8Array([9, 9, 9, 9, 9]);
	r = m.read(dr, 0, 0, 5);
	assertEquals(r.bytesRead, 0);
	assertEquals(dr, new Uint8Array([9, 9, 9, 9, 9]));

	dr = new Uint8Array([9, 9, 9, 9, 9]);
	r = m.read(dr, 2, 1, 5);
	assertEquals(r.bytesRead, 1);
	assertEquals(dr, new Uint8Array([9, 9, 1, 9, 9]));

	dr = new Uint8Array([9, 9, 9, 9, 9]);
	r = m.read(dr, 1, 3, 5);
	assertEquals(r.bytesRead, 3);
	assertEquals(dr, new Uint8Array([9, 1, 2, 3, 9]));
});

Deno.test('read over', () => {
	let r;
	const m = new MemoryFile();
	const dw = new Uint8Array([1, 2, 3, 4, 5]);

	r = m.write(dw, 0, dw.length, 5);
	assertEquals(r.bytesWritten, dw.length);

	const dr = new Uint8Array(dw.length);
	r = m.read(dr, 0, dw.length, 6);
	assertEquals(r.bytesRead, 4);
	assertEquals(dr, new Uint8Array([2, 3, 4, 5, 0]));
});

Deno.test('read multiple blocks', () => {
	let r;
	const m = new MemoryFile();
	const dw = new Uint8Array(Math.round(BS * 5.5));
	for (let i = 0; i < dw.length; i++) {
		dw[i] = i % 256;
	}

	r = m.write(dw, 0, dw.length, 5);
	assertEquals(r.bytesWritten, dw.length);

	const dr = new Uint8Array(dw.length);
	r = m.read(dr, 0, dw.length, 5);
	assertEquals(r.bytesRead, dw.length);
	assertEquals(dr, dw);
});

Deno.test('truncate bigger', () => {
	for (const size of [0, BS - 1, BS, BS + 1, BS * 2, BS * 3.5]) {
		const m = new MemoryFile();
		m.truncate(size);

		const dw = new Uint8Array(size);
		for (let i = dw.length; i--;) {
			dw[i] = (i + 1) % 256;
		}

		m.write(dw, 0, dw.length, 0);

		for (const more of [1, 22, 333, 4444, 55555, 666666]) {
			const bigger = size + more;

			m.truncate(bigger);

			const r = m.stat();
			assertEquals(r.size, bigger);
			assertEquals(r.blocks, Math.ceil(bigger / BS));

			const dr = new Uint8Array(size);

			m.read(dr, 0, size, 0);
			assertEquals(dr, dw);

			const dm = new Uint8Array(more);
			dm.fill(1);

			m.read(dm, 0, more, size);
			for (let i = 0; i < more; i++) {
				if (dm[i] !== 0) {
					throw new Error(`[${i}] = ${dm[i]}`);
				}
			}
		}
	}
});

Deno.test('truncate smaller', () => {
	for (const size of [0, BS - 1, BS, BS + 1, BS * 2, BS * 3.5]) {
		for (const more of [1, 22, 333, 4444, 55555, 666666]) {
			const bigger = size + more;
			const m = new MemoryFile();
			m.truncate(bigger);

			const dw = new Uint8Array(bigger);
			for (let i = dw.length; i--;) {
				dw[i] = (i + 1) % 256;
			}

			m.write(dw, 0, dw.length, 0);

			m.truncate(size);

			const r = m.stat();
			assertEquals(r.size, size);
			assertEquals(r.blocks, Math.ceil(size / BS));

			m.truncate(bigger);

			const drKeep = new Uint8Array(size);
			m.read(drKeep, 0, size, 0);
			assertEquals(drKeep, dw.subarray(0, size));

			const drLost = new Uint8Array(more);
			m.read(drLost, 0, more, size);
			for (let i = 0; i < more; i++) {
				if (drLost[i] !== 0) {
					throw new Error(`[${i}] = ${drLost[i]}`);
				}
			}
		}
	}
});

Deno.test('stat two blocks', () => {
	const size = BS * 2;
	const m = new MemoryFile();
	m.truncate(size);

	const r = m.stat();
	assertEquals(r.size, size);
	assertEquals(r.blocks, 2);
	assertEquals(r.blksize, BS);
});

Deno.test('stat two blocks plus one', () => {
	const size = BS * 2;
	const m = new MemoryFile();
	m.truncate(size + 1);

	const r = m.stat();
	assertEquals(r.size, size + 1);
	assertEquals(r.blocks, 3);
	assertEquals(r.blksize, BS);
});

Deno.test('like node', async () => {
	let size = 0;
	let file = '';
	for (const f of ['LICENSE.txt', '../LICENSE.txt']) {
		// deno-lint-ignore no-await-in-loop
		const st = await stat(f).catch(() => null);
		if (st) {
			file = f;
			size = st.size;
			break;
		}
	}
	const m: File = new MemoryFile();
	const f = await open(file, 'r');
	try {
		const n: File = f;
		let d;
		{
			d = new Uint8Array(size);
			await n.read(d, 0, d.length, 0);
			await m.write(d, 0, d.length, 0);
			assertEquals((await m.stat()).size, size);
		}

		for (let i = 0, o = 0, l = 0; o < d.length; i++) {
			const md = new Uint8Array(l + 2);
			const nd = new Uint8Array(l + 2);

			nd[0] = md[0] = (i % 10) + 1;
			nd[l + 1] = md[l + 1] = ((i + 1) % 10) + 1;

			// deno-lint-ignore no-await-in-loop
			const mr = await m.read(md, 1, l, o);
			// deno-lint-ignore no-await-in-loop
			const nr = await n.read(nd, 1, l, o);

			assertEquals(mr.bytesRead, nr.bytesRead);
			assertEquals(md, nd);

			l = Math.round((l || 1) * 1.5);
			o += l;
		}
	} finally {
		await f.close();
	}
});
