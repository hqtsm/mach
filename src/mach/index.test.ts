import {describe, it} from 'node:test';
import {ok, strictEqual} from 'node:assert';

import {HOST_LE} from '../const.ts';
import {Struct} from '../struct.ts';

import * as index from './index.ts';

void describe('Mach structs', () => {
	void it('endians', () => {
		for (const name of Object.keys(index)) {
			if (name.endsWith('LE') || name.endsWith('BE')) {
				continue;
			}

			const all = index as {
				[name: string]: typeof Struct | unknown;
			};
			const St = all[name] as typeof Struct | undefined;
			if (St && St.prototype && St.prototype instanceof Struct) {
				const nameBE = `${name}BE`;
				const nameLE = `${name}LE`;
				const StBE = all[nameBE] as typeof St;
				const StLE = all[nameLE] as typeof St;
				ok(StBE, nameBE);
				ok(StLE, nameLE);
				ok(StBE.prototype, nameBE);
				ok(StLE.prototype, nameLE);
				ok(StBE.prototype instanceof St, nameBE);
				ok(StLE.prototype instanceof St, nameLE);
				strictEqual(StBE.BYTE_LENGTH, St.BYTE_LENGTH, nameBE);
				strictEqual(StLE.BYTE_LENGTH, St.BYTE_LENGTH, nameLE);
				strictEqual(StBE.LITTLE_ENDIAN, false, nameBE);
				strictEqual(StLE.LITTLE_ENDIAN, true, nameLE);
				strictEqual(St.LITTLE_ENDIAN, HOST_LE);
			}
		}
	});
});
