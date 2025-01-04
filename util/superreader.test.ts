import { assertEquals } from '@std/assert';
import { SuperReader } from './superreader.ts';

Deno.test('SuperReader size', () => {
	assertEquals(new SuperReader().size, 0);
	assertEquals(new SuperReader([]).size, 0);
	assertEquals(new SuperReader([new Blob([])]).size, 0);
	assertEquals(new SuperReader([new Blob(['a'])]).size, 1);
	assertEquals(new SuperReader([new Blob(['a']), new Blob(['b'])]).size, 2);
});

Deno.test('SuperReader slice', async () => {
	const texts = ['aaaa', 'bbbb', 'cccc', 'dddd'];
	const reader = new SuperReader(texts.map((s) => new Blob([s])));
	const text = texts.join('');
	const offsets = [
		NaN,
		Infinity,
		-Infinity,
		Number.EPSILON,
		-Number.EPSILON,
		1.1,
		-1.1,
		1.5,
		-1.5,
	];
	for (let i = -(text.length + 2); i < text.length + 2; i++) {
		offsets.push(i);
	}
	for (const start of offsets) {
		for (const end of offsets) {
			// Undefined slice rounding behaviour in Blob.
			// Some implementations will round/truncate/infinity=0.
			// Matching consistency with other slice methods.
			const expt = text.slice(start, end);
			const slice = reader.slice(start, end);
			assertEquals(slice.size, expt.length, `start=${start} end=${end}`);
			assertEquals(
				// deno-lint-ignore no-await-in-loop
				new Uint8Array(await slice.arrayBuffer()),
				new TextEncoder().encode(expt),
				`start=${start} end=${end}`,
			);
		}
	}
});

Deno.test('SuperReader type', () => {
	assertEquals(new SuperReader().type, new Blob([]).type);
	assertEquals(new SuperReader([]).type, new Blob([]).type);
	assertEquals(
		new SuperReader([], { type: 'test' }).type,
		new Blob([], { type: 'test' }).type,
	);
	assertEquals(
		new SuperReader([], { type: 'test' }).slice().type,
		new Blob([], { type: 'test' }).slice().type,
	);
	assertEquals(
		new SuperReader([], { type: 'test' }).slice(0, Infinity, 'type').type,
		new Blob([], { type: 'test' }).slice(0, Infinity, 'type').type,
	);
});
