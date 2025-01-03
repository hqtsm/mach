import { assertEquals } from '@std/assert';
import * as mod from './mod.ts';

interface Exports {
	[k: string]: unknown;
}

declare const module: { require: (name: string) => Exports } | undefined;

function getFilename(): string {
	let trace;
	let original;
	const E = Error as unknown as { prepareStackTrace: unknown };
	const own = Object.hasOwn(E, 'prepareStackTrace');
	if (own) {
		original = E.prepareStackTrace;
		E.prepareStackTrace = (s: { stack: string }) => s.stack;
	}
	try {
		trace = new Error('.').stack;
	} finally {
		if (own) {
			E.prepareStackTrace = original;
		} else {
			delete E.prepareStackTrace;
		}
	}
	const m = trace?.match(/\((file:\/\/)?(.*):\d+:\d+\)/i);
	if (!m) {
		throw new Error('Unknown filename');
	}
	return m[1] ? decodeURIComponent(m[2]) : m[2];
}

function getImport(): (name: string) => Promise<Exports> {
	const m = typeof module !== 'undefined' ? module : null;
	return m
		// deno-lint-ignore require-await
		? async (name: string) => m.require(name)
		// deno-lint-ignore require-await
		: async (name: string) => import(name);
}

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

function isClass(x: unknown): boolean {
	return (
		typeof x === 'function' &&
		!Object.getOwnPropertyDescriptor(x, 'prototype')?.writable
	);
}

const file = getFilename();
const dir = file.replace(/[\\\/][^/]+$/, '');
const impire = getImport();

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
		const m = await impire(uri);
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
	const defaultClassProperties = new Set<unknown>(
		Object.getOwnPropertyNames(class {}),
	);
	for (const [k, v] of Object.entries(mod)) {
		if (
			typeof v !== 'function' ||
			Object.getOwnPropertyDescriptor(v, 'prototype')?.writable
		) {
			continue;
		}
		for (const p of Object.getOwnPropertyNames(v) as (keyof typeof v)[]) {
			if (
				defaultClassProperties.has(p) ||
				typeof v[p] === 'function'
			) {
				continue;
			}
			const desc = Object.getOwnPropertyDescriptor(v, p)!;
			assertEquals(desc.writable ?? false, false, `${k}.${p}`);
			assertEquals(desc.enumerable ?? false, false, `${k}.${p}`);
			assertEquals(desc.configurable ?? false, false, `${k}.${p}`);
		}
	}
});
