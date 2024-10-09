import {describe, it} from 'node:test';
import {ok} from 'node:assert';

import {Blob} from './blob.ts';

import * as index from './index.ts';

void describe('Blob structs', () => {
	void it('typeMagic', () => {
		for (const name of Object.keys(index)) {
			const all = index as {
				[name: string]: typeof Blob | unknown;
			};
			const Bl = all[name] as typeof Blob | undefined;
			if (Bl && Bl.prototype && Bl.prototype instanceof Blob) {
				ok(Object.hasOwn(Bl, 'typeMagic'), name);
			}
		}
	});
});
