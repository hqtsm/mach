import { assert, assertEquals } from '@std/assert';
import {
	CPU_SUBTYPE_POWERPC_7400,
	CPU_SUBTYPE_POWERPC_970,
	CPU_SUBTYPE_POWERPC_ALL,
	CPU_TYPE_ARM64,
	CPU_TYPE_I386,
	CPU_TYPE_POWERPC,
	CPU_TYPE_POWERPC64,
	CPU_TYPE_X86_64,
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
} from '../const.ts';
import { zipped } from './zipped.ts';

let fixturesCache: string | null = null;

function graceful<T>(f: () => T): T | null {
	try {
		return f();
	} catch (_) {
		return null;
	}
}

export function fixtures(): string {
	if (fixturesCache) {
		return fixturesCache;
	}
	graceful(() => {
		throw new Error('Coverage');
	});
	for (
		const s of [
			'spec/fixtures',
			'../spec/fixtures',
			'../../spec/fixtures',
		]
	) {
		fixturesCache = graceful(() => Deno.realPathSync(s));
		if (fixturesCache) {
			break;
		}
	}
	assert(fixturesCache, 'Could not find fixtures');
	return fixturesCache;
}

export const CPU_ARCHITECTURES: ReadonlyMap<string, [number, number | null]> =
	new Map([
		['arm64', [CPU_TYPE_ARM64, null]],
		['x86_64', [CPU_TYPE_X86_64, null]],
		['i386', [CPU_TYPE_I386, null]],
		['ppc64', [CPU_TYPE_POWERPC64, null]],
		['ppc7400', [CPU_TYPE_POWERPC, CPU_SUBTYPE_POWERPC_7400]],
		['ppc970', [CPU_TYPE_POWERPC, CPU_SUBTYPE_POWERPC_970]],
		['ppc', [CPU_TYPE_POWERPC, CPU_SUBTYPE_POWERPC_ALL]],
	]);

export interface FixtureMachoSignatureInfo {
	offset: number;
	version: number;
	flags: number;
	identifier: string;
	teamid: string;
	hashes: number[];
	page: number;
	requirements: string;
	execsegbase: bigint;
	execseglimit: bigint;
	execsegflags: bigint;
}

function fixtureMachosRead(): {
	kind: string;
	arch: string;
	file: string;
	archs: Readonly<
		Map<string, Readonly<FixtureMachoSignatureInfo>>
	>;
}[] {
	const hashTypes: { [key: string]: number } = {
		sha1: kSecCodeSignatureHashSHA1,
		sha256: kSecCodeSignatureHashSHA256,
		sha384: kSecCodeSignatureHashSHA384,
		sha512: kSecCodeSignatureHashSHA512,
	};
	const lines = Deno.readTextFileSync(`${fixtures()}/macho.txt`)
		.split('\n');
	const all = new Map<
		string,
		Map<string, FixtureMachoSignatureInfo | null>
	>();
	let group = null;
	let arch = null;
	while (lines.length) {
		const line = lines.shift()!;
		if (!line) {
			continue;
		}
		const mg = line.match(/^(\t*)([^\t].*):$/);
		if (mg) {
			const indent = mg[1].length;
			assert(indent < 2, `Bad line: ${line}`);
			switch (indent) {
				case 0: {
					[, , group] = mg;
					arch = null;
					all.set(mg[2], new Map());
					break;
				}
				case 1: {
					[, , arch] = mg;
					assert(group, `Bad line: ${line}`);
					const a = all.get(group);
					assert(a, `Bad line: ${line}`);
					a.set(arch, null);
					break;
				}
			}
			continue;
		}
		const mv = line.match(/^\t\t([^=]+)=(.*)$/);
		assert(mv && group && arch, `Bad line: ${line}`);
		const [, k, v] = mv;
		const a = all.get(group)!.get(arch)! || {
			offset: 0,
			version: 0,
			flags: 0,
			identifier: '',
			teamid: '',
			hashes: [],
			page: 0,
			execsegbase: 0n,
			execseglimit: 0n,
			execsegflags: 0n,
		};
		switch (k) {
			case 'offset':
			case 'version':
			case 'flags':
			case 'page': {
				a[k] = +v;
				break;
			}
			case 'execsegbase':
			case 'execseglimit':
			case 'execsegflags': {
				a[k] = BigInt(v);
				break;
			}
			case 'identifier':
			case 'teamid':
			case 'requirements': {
				a[k] = v;
				break;
			}
			case 'hashes': {
				a[k] = v
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
					.map((s) => hashTypes[s]);
				break;
			}
		}
		all.get(group)!.set(arch, a);
	}
	const r = [];
	for (const [g, a] of all) {
		const [, kind, , arch, ...parts] = g.split('/');
		r.push({
			kind,
			arch,
			file: parts.join('/'),
			archs: a as Readonly<
				Map<string, Readonly<FixtureMachoSignatureInfo>>
			>,
		});
	}
	return r;
}

let staticFixtureMachos: ReturnType<typeof fixtureMachosRead> | null = null;

export function fixtureMachos(): ReturnType<typeof fixtureMachosRead> {
	staticFixtureMachos ??= fixtureMachosRead();
	return staticFixtureMachos;
}

export async function fixtureMacho(
	kind: string,
	arch: string,
	files: readonly string[],
): Promise<Uint8Array<ArrayBuffer>[]> {
	const m = new Map(files.map((name, i) => [name, i]));
	const datas: Uint8Array<ArrayBuffer>[] = [];
	for await (
		const [name, read] of zipped(
			`${fixtures()}/macho/${kind}/dist/${arch}.zip`,
		)
	) {
		const i = m.get(name) ?? -1;
		if (i < 0) {
			continue;
		}
		datas[i] = await read();
		m.delete(name);
	}
	assertEquals(m.size, 0, `Missing files: ${[...m.keys()].join(' ')}`);
	return datas;
}

export async function fixtureMachoSigned(
	kind: string,
	arch: string,
	file: string,
): Promise<{
	macho: Uint8Array<ArrayBuffer>;
	infoPlist: Uint8Array<ArrayBuffer> | null;
	codeResources: Uint8Array<ArrayBuffer> | null;
}> {
	let resources: string[] | null = null;
	const bundle = file.match(
		/^((.*\/)?([^./]+\.(app|framework)))\/([^.]+\/)[^/]+$/,
	);
	if (bundle) {
		const [, path, , , ext] = bundle;
		resources = ext === 'framework'
			? [
				`${path}/Versions/A/Resources/Info.plist`,
				`${path}/Versions/A/_CodeSignature/CodeResources`,
			]
			: [
				`${path}/Contents/Info.plist`,
				`${path}/Contents/_CodeSignature/CodeResources`,
			];
	}
	const files = await fixtureMacho(kind, arch, [file, ...(resources || [])]);
	const [macho] = files;
	const infoPlist = resources ? files[1] : null;
	const codeResources = resources ? files[2] : null;
	return {
		macho,
		infoPlist,
		codeResources,
	};
}
