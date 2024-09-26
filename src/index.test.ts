import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';
import {resolve, dirname} from 'node:path';
import {readFile, readdir} from 'node:fs/promises';

import * as index from './index.ts';

interface Exports {
	[k: string]: unknown;
}

function getFilename() {
	let trace;
	let original;
	if (Object.hasOwn(Error, 'prepareStackTrace')) {
		original = Error.prepareStackTrace;
		Error.prepareStackTrace = s => s.stack;
	}
	try {
		trace = new Error('.').stack;
	} finally {
		if (original) {
			Error.prepareStackTrace = original;
		}
	}
	const m = trace?.match(/\((file:\/\/)?(.*):\d+:\d+\)/i);
	if (!m) {
		throw new Error('Unknown filename');
	}
	return m[1] ? decodeURIComponent(m[2]) : m[2];
}

function getImport(): (name: string) => Promise<Exports> {
	// eslint-disable-next-line unicorn/prefer-module
	const m = typeof module === 'undefined' ? null : module;
	if (m) {
		return async (name: string) => m.require(name);
	}
	return async (name: string) => import(name);
}

const file = getFilename();
const dir = dirname(file);
const impire = getImport();

function assertExported(subset: Exports, superset: Exports, what: string) {
	for (const key of Object.keys(subset).sort()) {
		strictEqual(
			key === 'default' ? superset : superset[key],
			subset[key],
			`${what}: export[${key}]`
		);
	}
}

async function* findModules(dir: string) {
	for (const q = ['']; q.length; ) {
		const path = q.shift()!;
		// eslint-disable-next-line no-await-in-loop
		const list = await readdir(path ? resolve(dir, path) : dir, {
			withFileTypes: true
		});
		list.sort((a, b) => a.name.localeCompare(b.name));
		for (const e of list) {
			const {name} = e;
			if (name.startsWith('.')) {
				continue;
			}
			if (e.isDirectory()) {
				q.push(path ? `${path}/${name}` : name);
				continue;
			}
			if (
				!/\.(c|m|)[jt]s?$/i.test(name) ||
				/\.(test|spec)\.[^.]+$/i.test(name)
			) {
				continue;
			}
			yield path ? `${path}/${name}` : name;
		}
	}
}

void describe('index', () => {
	void it('exports', async () => {
		const {name} = JSON.parse(
			await readFile(resolve(dir, '../package.json'), 'utf8')
		);
		const iIndex = await impire(name);
		assertExported(iIndex, index, 'exports');
	});

	void it('imports', async () => {
		for await (const file of findModules(dir)) {
			const m = await impire(resolve(dir, file));
			assertExported(m, index, file);
		}
	});
});
