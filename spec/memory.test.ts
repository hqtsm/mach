import { assertRejects, assertStrictEquals, assertThrows } from '@std/assert';
import { testOOM } from './memory.ts';

Deno.test('testOOM', async () => {
	const AB = ArrayBuffer;

	{
		let ab;
		assertStrictEquals(
			testOOM([43], () => ab = new ArrayBuffer(42)),
			ab,
		);
		assertStrictEquals(ArrayBuffer, AB);
	}

	{
		let ab;
		assertStrictEquals(
			await testOOM(
				[43],
				async () => await Promise.resolve(ab = new ArrayBuffer(42)),
			),
			ab,
		);
		assertStrictEquals(ArrayBuffer, AB);
	}

	assertThrows(
		() => testOOM([42], () => new ArrayBuffer(42)),
		RangeError,
		'TEST-OOM',
	);
	assertStrictEquals(ArrayBuffer, AB);

	await assertRejects(
		() =>
			testOOM([42], async () => {
				await new Promise((resolve) => setTimeout(resolve, 10));
				new ArrayBuffer(42);
			}),
		RangeError,
		'TEST-OOM',
	);
	assertStrictEquals(ArrayBuffer, AB);
});
