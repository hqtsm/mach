import {describe, it} from 'node:test';
import {ok} from 'node:assert';

import {Blob} from './blob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

import * as index from './index.ts';

void describe('Blob structs', () => {
	void it('typeMagic', () => {
		for (const name of Object.keys(index)) {
			if (name === 'SuperBlob') {
				continue;
			}
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

void describe('SuperBlobMaker', () => {
	void it('SuperBlob', () => {
		for (const name of Object.keys(index)) {
			const all = index as {
				[name: string]: typeof SuperBlobMaker | unknown;
			};
			const Maker = all[name] as typeof SuperBlobMaker | undefined;
			if (
				Maker &&
				Maker.prototype &&
				Maker.prototype instanceof SuperBlobMaker
			) {
				ok(Object.hasOwn(Maker, 'SuperBlob'), name);
			}
		}
	});
});
