import * as constants from './const.ts';

const signed = new Set([
	'BIND_SPECIAL_DYLIB_FLAT_LOOKUP',
	'BIND_SPECIAL_DYLIB_MAIN_EXECUTABLE',
	'BIND_SPECIAL_DYLIB_WEAK_LOOKUP',
	'CPU_TYPE_ANY',
	'CPU_SUBTYPE_ANY',
	'CPU_SUBTYPE_MULTIPLE',
]);

Deno.test('constants sign', () => {
	for (const k of Object.keys(constants)) {
		const v = (constants as { [k: string]: unknown })[k];
		if (typeof v === 'number' && v < 0 && !signed.has(k)) {
			throw new Error(`Invalid constant: ${k}`);
		}
	}
});
