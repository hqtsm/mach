import { assert } from '@std/assert';
import { Blob } from './blob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';
import * as mod from './mod.ts';

// deno-lint-ignore ban-types
function isSubclass<T extends Function>(Type: T, value: unknown): value is T {
	return value instanceof Function && value.prototype instanceof Type;
}

Deno.test('Blob typeMagic', () => {
	for (const [name, value] of Object.entries(mod)) {
		if (
			isSubclass(Blob, value) &&
			name !== 'SuperBlob' &&
			name !== 'SuperBlobCore'
		) {
			assert(Object.hasOwn(value, 'typeMagic'), name);
		}
	}
});

Deno.test('SuperBlobMaker SuperBlob', () => {
	for (const [name, value] of Object.entries(mod)) {
		if (isSubclass(SuperBlobMaker, value)) {
			assert(Object.hasOwn(value, 'SuperBlob'), name);
		}
	}
});
