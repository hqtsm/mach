import { assert } from '@std/assert';
import { Blob } from './blob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';
import * as mod from './mod.ts';

Deno.test('typeMagic', () => {
	for (const name of Object.keys(mod)) {
		if (name === 'SuperBlob') {
			continue;
		}
		const all = mod as {
			[name: string]: typeof Blob | unknown;
		};
		const Bl = all[name] as typeof Blob | undefined;
		if (Bl && Bl.prototype && Bl.prototype instanceof Blob) {
			assert(Object.hasOwn(Bl, 'typeMagic'), name);
		}
	}
});

Deno.test('SuperBlob', () => {
	for (const name of Object.keys(mod)) {
		const all = mod as {
			[name: string]: typeof SuperBlobMaker | unknown;
		};
		const Maker = all[name] as typeof SuperBlobMaker | undefined;
		if (
			Maker &&
			Maker.prototype &&
			Maker.prototype instanceof SuperBlobMaker
		) {
			assert(Object.hasOwn(Maker, 'SuperBlob'), name);
		}
	}
});
