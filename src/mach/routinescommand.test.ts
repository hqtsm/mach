import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {RoutinesCommand} from './routinescommand.ts';

void describe('RoutinesCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(RoutinesCommand.BYTE_LENGTH, 40);
	});
});
