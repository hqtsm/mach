import { assertEquals } from '@std/assert';
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

Deno.test('constant: CPU_SUBTYPE_INTEL', () => {
	const subtype = constants.CPU_SUBTYPE_INTEL(0x8, 0xfedcba9);
	assertEquals(subtype, 0xfedcba98);

	const family = constants.CPU_SUBTYPE_INTEL_FAMILY(subtype);
	assertEquals(family, 0x8);

	const model = constants.CPU_SUBTYPE_INTEL_MODEL(subtype);
	assertEquals(model, 0xfedcba9);
});

Deno.test('constant: CPU_SUBTYPE_ARM64', () => {
	assertEquals(constants.CPU_SUBTYPE_ARM64_PTR_AUTH_VERSION(0x00000000), 0);
	assertEquals(constants.CPU_SUBTYPE_ARM64_PTR_AUTH_VERSION(0x01000000), 1);
	assertEquals(constants.CPU_SUBTYPE_ARM64_PTR_AUTH_VERSION(0x0f000000), 15);
});
