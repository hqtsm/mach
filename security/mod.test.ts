import { assert } from '@std/assert';
import { Blob } from './blob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';
import * as mod from './mod.ts';

Deno.test('Blob typeMagic', () => {
	for (const [name, value] of Object.entries(mod)) {
		if (
			!(value instanceof Function) ||
			!(value.prototype instanceof Blob) ||
			name === 'SuperBlob' ||
			name === 'SuperBlobCore'
		) {
			continue;
		}
		assert(Object.hasOwn(value, 'typeMagic'), name);
	}
});

Deno.test('SuperBlobMaker SuperBlob', () => {
	for (const [name, value] of Object.entries(mod)) {
		if (
			!(value instanceof Function) ||
			!(value.prototype instanceof SuperBlobMaker)
		) {
			continue;
		}
		assert(Object.hasOwn(value, 'SuperBlob'), name);
	}
});
