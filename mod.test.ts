import { assertEquals } from '@std/assert';
import type { Class } from '@hqtsm/class';
import deno from './deno.json' with { type: 'json' };

type Exports = Record<string, unknown>;

const file = (function file(m?: RegExpMatchArray | null): string {
	const trace = { stack: file.name.slice(0, 0) };
	Error.captureStackTrace(trace);
	if ((m = trace.stack.match(/\((file:\/\/)?(.*):\d+:\d+\)/i))) {
		return m[1] ? decodeURIComponent(m[2]) : m[2];
	}
	throw new Error('Unknown filename');
})();
const dir = file.replace(/[\\\/][^/]+$/, '');
const ext = `.${file.split('.').at(-1)!}`;

const exports = (() => {
	let r;
	return (): Promise<[string, Exports][]> =>
		r ??= Promise.all(
			Object.entries(deno.exports).map(async ([name, path]) => [
				name,
				await import(`${dir}/${path.replace(/\.ts$/, ext)}`),
			]),
		);
})();

function isFunction(arg: unknown): arg is (...args: unknown[]) => unknown {
	return (
		typeof arg === 'function' &&
		!!(Object.getOwnPropertyDescriptor(arg, 'prototype')?.writable ?? true)
	);
}

function isClass(arg: unknown): arg is Class {
	return (
		typeof arg === 'function' &&
		Object.getOwnPropertyDescriptor(arg, 'prototype')?.writable === false
	);
}

Deno.test('class constants', async () => {
	const builtins = new Set<unknown>(Object.getOwnPropertyNames(class {}));

	for (const [_, mod] of await exports()) {
		for (const [k, v] of Object.entries(mod)) {
			if (!isClass(v)) {
				continue;
			}

			{
				const tag = `${k}[Symbol.toStringTag]`;
				if (v.prototype.toString === Object.prototype.toString) {
					assertEquals(String(v.prototype), `[object ${k}]`, tag);
				}
				assertEquals(
					Object.getOwnPropertyDescriptor(
						v.prototype,
						Symbol.toStringTag,
					),
					{
						value: k,
						configurable: true,
						enumerable: false,
						writable: false,
					},
					tag,
				);
			}

			for (
				const p of Object.getOwnPropertyNames(v) as (keyof typeof v)[]
			) {
				if (builtins.has(p) || isFunction(v[p])) {
					continue;
				}

				const tag = `${k}.${p}`;
				const desc = Object.getOwnPropertyDescriptor(v, p)!;
				assertEquals(desc.writable ?? false, false, tag);
				assertEquals(desc.enumerable ?? false, false, tag);
				assertEquals(desc.configurable ?? false, false, tag);
			}
		}
	}
});
