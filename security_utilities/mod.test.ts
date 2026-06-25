import { assert } from '@std/assert';
import { Security_Blob } from './blob.ts';
import {
	Security_SuperBlob,
	Security_SuperBlob_Maker,
	Security_SuperBlobCore,
} from './superblob.ts';
import * as mod from './mod.ts';

// deno-lint-ignore ban-types
function isSubclass<T extends Function>(Type: T, value: unknown): value is T {
	return value instanceof Function && value.prototype instanceof Type;
}

Deno.test('Security_Blob typeMagic', () => {
	for (const [name, value] of Object.entries(mod)) {
		if (
			isSubclass(Security_Blob, value) &&
			value !== Security_SuperBlob &&
			value !== Security_SuperBlobCore
		) {
			assert(Object.hasOwn(value, 'typeMagic'), name);
		}
	}
});

Deno.test('Security_SuperBlob_Maker SuperBlob', () => {
	for (const [name, value] of Object.entries(mod)) {
		if (isSubclass(Security_SuperBlob_Maker, value)) {
			assert(Object.hasOwn(value, 'SuperBlob'), name);
		}
	}
});
