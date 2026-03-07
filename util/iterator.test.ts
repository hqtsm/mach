import { assertEquals, assertStrictEquals } from '@std/assert';
import { sizeAsyncIterators, type SizeIteratorNext } from './iterator.ts';

Deno.test('sizeAsyncIterators sizes', async () => {
	let i = 0;
	const total = 100;
	const [iA, iB] = sizeAsyncIterators<number[]>(
		{
			next(size): Promise<SizeIteratorNext<number[]>> {
				if (i >= total) {
					return Promise.resolve({ done: true });
				}
				size = Math.max(size || 0, 2);
				const value = [];
				for (; i < total && size-- > 0; i) {
					value.push(++i);
				}
				return Promise.resolve({ done: false, value });
			},
		},
		(sizes) => Math.max(...sizes),
		2,
	);
	{
		const [rA, rB] = await Promise.all([iA.next(), iB.next()]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, false);
		assertEquals(rA.value, [1, 2]);
	}
	{
		const [rA, rB] = await Promise.all([iA.next(3), iB.next(3)]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, false);
		assertEquals(rA.value, [3, 4, 5]);
	}
	{
		const [rA, rB] = await Promise.all([iA.next(4), iB.next(5)]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, false);
		assertEquals(rA.value, [6, 7, 8, 9, 10]);
	}
	{
		const [rA, rB] = await Promise.all([iA.next(10), iB.next()]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, false);
		assertEquals(rA.value?.length, 10);
	}
	{
		const [rA, rB] = await Promise.all([iA.next(), iB.next(20)]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, false);
		assertEquals(rA.value?.length, 20);
	}
	{
		const [rA, rB] = await Promise.all([
			iA.next(Infinity),
			iB.next(Infinity),
		]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, false);
		assertEquals(rA.value?.length, 60);
	}
	{
		const [rA, rB] = await Promise.all([iA.next(), iB.next()]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, true);
		assertEquals(rA.value, undefined);
	}
	{
		const [rA, rB] = await Promise.all([iA.next(), iB.next()]);
		assertStrictEquals(rA, rB);
		assertEquals(rA.done, true);
		assertEquals(rA.value, undefined);
	}

	await iB.return?.();
	await iA.return?.();
	await iA.return?.();
	await iB.return?.();

	{
		const [rA, rB] = await Promise.all([iA.next(), iB.next()]);
		assertEquals(rA.done, true);
		assertEquals(rA.value, undefined);
		assertEquals(rB.done, true);
		assertEquals(rB.value, undefined);
	}
});

Deno.test('sizeAsyncIterators error', async () => {
	let i = 0;
	const total = 10;
	let error: Error | null = null;
	const [iA, iB] = sizeAsyncIterators<number[]>(
		{
			next(size): Promise<SizeIteratorNext<number[]>> {
				if (!error) {
					throw error = new Error('Example error');
				}
				if (i >= total) {
					return Promise.resolve({ done: true });
				}
				size = Math.max(size || 0, 2);
				const value = [];
				for (; i < total && size-- > 0; i) {
					value.push(++i);
				}
				return Promise.resolve({ done: false, value });
			},
		},
		(sizes) => Math.max(...sizes),
		2,
	);

	{
		const [eA, eB] = await Promise.all([
			iA.next(4).catch((err) => err),
			iB.next(4).catch((err) => err),
		]);
		assertStrictEquals(eA, error);
		assertStrictEquals(eB, error);
	}
	{
		const [rA, rB] = await Promise.all([iA.next(5), iB.next(5)]);
		assertStrictEquals(rA, rB);
		assertStrictEquals(rA.done, false);
		assertEquals(rA.value, [1, 2, 3, 4, 5]);
	}
	{
		const [rA, rB] = await Promise.all([
			iA.next(Infinity),
			iB.next(Infinity),
		]);
		assertStrictEquals(rA, rB);
		assertStrictEquals(rA.done, false);
		assertEquals(rA.value, [6, 7, 8, 9, 10]);
	}
	{
		const [rA, rB] = await Promise.all([
			iA.next(Infinity),
			iB.next(Infinity),
		]);
		assertStrictEquals(rA, rB);
		assertStrictEquals(rA.done, true);
		assertEquals(rA.value, undefined);
	}

	await iA.return?.();
	await iB.return?.();
});

Deno.test('sizeAsyncIterators return', async () => {
	let i = 0;
	const total = 10;
	let returns = 0;
	const [iA, iB, iC] = sizeAsyncIterators<number[]>(
		{
			next(size): Promise<SizeIteratorNext<number[]>> {
				if (i >= total) {
					return Promise.resolve({ done: true });
				}
				size = Math.max(size || 0, 2);
				const value = [];
				for (; i < total && size-- > 0; i) {
					value.push(++i);
				}
				return Promise.resolve({ done: false, value });
			},
			return(): Promise<void> {
				returns++;
				return Promise.resolve();
			},
		},
		(sizes) => Math.max(...sizes),
		3,
	);

	{
		const all = [];
		const state: unknown[] = [];
		all.push(iA.next().then((v) => state.push(v)));
		all.push(iA.next().then((v) => state.push(v)));
		all.push(iA.next().then((v) => state.push(v)));
		await iA.return?.()?.then(() => state.push('RETURN: A'));
		await Promise.all(all);
		assertEquals(state, [
			{ done: true },
			{ done: true },
			{ done: true },
			'RETURN: A',
		]);
		assertEquals(returns, 0);
	}

	{
		const all = [];
		const state: unknown[] = [];
		all.push(iB.next().then((v) => state.push(v)));
		all.push(iB.next().then((v) => state.push(v)));
		all.push(iB.next().then((v) => state.push(v)));
		await iC.return?.()?.then(() => state.push('RETURN: C'));
		await Promise.all(all);
		assertEquals(state, [
			'RETURN: C',
			{ done: false, value: [1, 2] },
			{ done: false, value: [3, 4] },
			{ done: false, value: [5, 6] },
		]);
		assertEquals(returns, 0);
		assertEquals(await iB.next(), { done: false, value: [7, 8] });
		assertEquals(returns, 0);
		await iB.return?.();
		assertEquals(returns, 1);
	}
});
