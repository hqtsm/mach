import { assertEquals } from '@std/assert';
import * as mod from './mod.ts';

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

async function* findModules(
	dir: string,
	exclude: Set<string>,
): AsyncIterableIterator<string> {
	for (const q = ['.']; q.length;) {
		const path = q.shift()!;
		for await (const e of Deno.readDir(path ? `${dir}/${path}` : dir)) {
			const { name } = e;
			if (name.startsWith('.') || name.startsWith('_dnt.')) {
				continue;
			}
			const p = `${path}/${name}`;
			if (exclude.has(p)) {
				continue;
			}
			if (e.isDirectory) {
				q.push(p);
				continue;
			}
			if (
				!/\.[cm]?[jt]sx?$/i.test(name) ||
				/\.(test|spec)\.[^.]+$/i.test(name) ||
				/\.d\.ts$/i.test(name)
			) {
				continue;
			}
			yield p;
		}
	}
}

function assertExported(
	subset: Exports,
	superset: Exports,
	what: string,
): void {
	for (const key of Object.keys(subset).sort()) {
		assertEquals(
			key === 'default' ? superset : superset[key],
			subset[key],
			`${what}: export[${key}]`,
		);
	}
}

function isFunction(x: unknown): boolean {
	return (
		typeof x === 'function' &&
		!!(Object.getOwnPropertyDescriptor(x, 'prototype')?.writable ?? true)
	);
}

function isClass(x: unknown): boolean {
	return (
		typeof x === 'function' &&
		!Object.getOwnPropertyDescriptor(x, 'prototype')?.writable
	);
}

Deno.test('public', async () => {
	const filed = new Map([
		['MemoryFile', 'file'],
	]);
	for await (
		const uri of findModules(
			dir,
			new Set([
				'./scripts',
				'./spec',
				'./docs',
				'./coverage',
				'./npm',
				'./node_modules',
				'./deps',
				'./test_runner.js',
			]),
		)
	) {
		const m = await import(uri);
		assertExported(m, mod, uri);

		const [file] = uri.split('/').pop()!.split('.');
		if (file === 'mod') {
			continue;
		}

		for (const name of Object.keys(m)) {
			const Class = m[name];
			if (!isClass(Class)) {
				continue;
			}
			assertEquals(
				filed.get(name) ?? name.toLowerCase(),
				file,
				`${file}: ${uri}`,
			);
		}
	}
});

Deno.test('class constants', () => {
	const builtins = new Set<unknown>(Object.getOwnPropertyNames(class {}));

	for (const [k, v] of Object.entries(mod)) {
		if (!isClass(v)) {
			continue;
		}

		for (const p of Object.getOwnPropertyNames(v) as (keyof typeof v)[]) {
			if (builtins.has(p) || isFunction(v[p])) {
				continue;
			}

			const desc = Object.getOwnPropertyDescriptor(v, p)!;
			assertEquals(desc.writable ?? false, false, `${k}.${p}`);
			assertEquals(desc.enumerable ?? false, false, `${k}.${p}`);
			assertEquals(desc.configurable ?? false, false, `${k}.${p}`);
		}
	}
});
