import { assert } from '@std/assert';
import * as mod from './mod.ts';

Deno.test('typeMagic', () => {
	const all = mod as {
		[name: string]: typeof Blob | unknown;
	};
	for (const name of Object.keys(mod)) {
		const Bl = all[name] as typeof Blob | undefined;
		if (Bl && Bl.prototype && Bl.prototype instanceof Blob) {
			assert(Object.hasOwn(Bl, 'typeMagic'), name);
		}
	}
});
