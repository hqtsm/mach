import { assert, assertEquals } from '@std/assert';

import { HOST_LE } from '../const.ts';
import { Struct } from '../struct.ts';

import * as mod from './mod.ts';

Deno.test('endians', () => {
	for (const name of Object.keys(mod)) {
		if (name.endsWith('LE') || name.endsWith('BE')) {
			continue;
		}

		const all = mod as {
			[name: string]: typeof Struct | unknown;
		};
		const St = all[name] as typeof Struct | undefined;
		if (St && St.prototype && St.prototype instanceof Struct) {
			const nameBE = `${name}BE`;
			const nameLE = `${name}LE`;
			const StBE = all[nameBE] as typeof St;
			const StLE = all[nameLE] as typeof St;
			assert(StBE, nameBE);
			assert(StLE, nameLE);
			assert(StBE.prototype, nameBE);
			assert(StLE.prototype, nameLE);
			assert(StBE.prototype instanceof St, nameBE);
			assert(StLE.prototype instanceof St, nameLE);
			assertEquals(StBE.BYTE_LENGTH, St.BYTE_LENGTH, nameBE);
			assertEquals(StLE.BYTE_LENGTH, St.BYTE_LENGTH, nameLE);
			assertEquals(StBE.LITTLE_ENDIAN, false, nameBE);
			assertEquals(StLE.LITTLE_ENDIAN, true, nameLE);
			assertEquals(St.LITTLE_ENDIAN, HOST_LE);
		}
	}
});
