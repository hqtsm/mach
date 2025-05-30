// deno-lint-ignore-file no-top-level-await no-console

import { build, type BuildOptions, emptyDir } from '@deno/dnt';
import denoJson from '../deno.json' with { type: 'json' };

if (Deno.args.length !== 1 || !/^(dev|prod)$/.test(Deno.args[0])) {
	console.error('Args: dev|prod');
	Deno.exit(1);
}

const [env] = Deno.args;

const mappings: BuildOptions['mappings'] = {
	'jsr:@hqtsm/struct': '@hqtsm/struct',
};

const GITHUB_REPOSITORY = Deno.env.get('GITHUB_REPOSITORY');

const readme = (await Deno.readTextFile('README.md')).split(/[\r\n]+/);
const [description] = readme.filter((s) => /^\w/.test(s));
const keywords = readme.map((s) => s.match(/^\!\[(.*)\]\((.*)\)$/))
	.filter((m) => m && m[2].startsWith('https://img.shields.io/badge/'))
	.map((m) => m![1]);

const entryPoints = [];
let types: string | undefined;
let typed: { [s: string]: string[] } | null = null;
for (const [name, path] of Object.entries(denoJson.exports)) {
	const d = path.replace(/^(\.\/)?(.*)(\.[^.]+)$/i, './esm/$2.d$3');
	if (name === '.') {
		entryPoints.unshift(path);
		types = d;
	} else {
		entryPoints.push({ name, path });
		(typed ??= {})[name.replace(/^\.\//, '')] = [d];
	}
}

// Monkey patch for broken JSR mappings, also add version and subpath info.
const replace = new Map<string, string>();
const jsrs = Object.keys(mappings).filter((s) => s.startsWith('jsr:'));
const jsrm = /^(jsr:(@.*))@([^@]*)$/;
for (const [ik, iv] of Object.entries(denoJson.imports)) {
	const m = iv.match(jsrm);
	if (m) {
		const [, j, name, version] = m;
		for (const k of jsrs.filter((s) => s === j || s.startsWith(`${j}/`))) {
			const sub = k.substring(j.length);
			const url = `https://jsr.io/${name}${sub}`;
			const o = mappings[k];
			delete mappings[k];
			mappings[url] = {
				version,
				...(sub ? { subPath: sub.substring(1) } : {}),
				...(typeof o === 'string' ? { name: o } : o),
			};
			replace.set(`${ik}${sub}`, url);
		}
	}
}
if (replace.size) {
	const reg = /\.m?[tj]sx?$/i;
	const dec = new TextDecoder();
	const enc = new TextEncoder();
	const desc = Object.getOwnPropertyDescriptor(Deno, 'readFile')!;
	const value = desc.value!;
	desc.value = async function readFile(
		path: string | URL,
		_options?: Deno.ReadFileOptions,
	): Promise<Uint8Array> {
		let r = await value.apply(this, arguments);
		if (reg.test(typeof path === 'string' ? path : path.pathname)) {
			r = enc.encode(
				dec.decode(r).replace(
					/(['"])([^'"]+)(['"])/g,
					(_0, q1, s, q2) => `${q1}${replace.get(s) ?? s}${q2}`,
				),
			);
		}
		return r;
	};
	Object.defineProperty(Deno, 'readFile', desc);
}

const outDir = './npm';

await emptyDir(outDir);

await build({
	test: env === 'dev',
	importMap: 'deno.json',
	entryPoints,
	outDir,
	shims: {
		deno: env === 'dev' ? 'dev' : false,
	},
	mappings,
	package: {
		name: denoJson.name,
		version: denoJson.version,
		description,
		keywords,
		license: denoJson.license,
		sideEffects: false,
		types,
		...(typed ? { typesVersions: { '*': typed } } : {}),
		...(env !== 'prod' ? { private: true } : {}),
		...(GITHUB_REPOSITORY
			? {
				repository: {
					type: 'git',
					url: `git+https://github.com/${GITHUB_REPOSITORY}.git`,
				},
				bugs: {
					url: `https://github.com/${GITHUB_REPOSITORY}/issues`,
				},
			}
			: {}),
	},
	typeCheck: 'both',
	compilerOptions: {
		target: 'Latest',
		lib: ['ESNext'],
		sourceMap: true,
	},
	async postBuild(): Promise<void> {
		await Promise.all([
			Deno.copyFile('LICENSE.txt', 'npm/LICENSE.txt'),
			Deno.copyFile('README.md', 'npm/README.md'),
			Deno.writeTextFile(
				'npm/.npmignore',
				[
					'.*',
					'ehthumbs.db',
					'Thumbs.db',
					'node_modules',
					'package-lock.json',
					'',
				].join('\n'),
			),
		]);
	},
});
