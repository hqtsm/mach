import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {RoutinesCommand64} from './routinescommand64.ts';

void describe('RoutinesCommand64', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(RoutinesCommand64.BYTE_LENGTH, 72);
	});
});
