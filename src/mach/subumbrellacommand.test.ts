import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {SubUmbrellaCommand} from './subumbrellacommand.ts';

void describe('SubUmbrellaCommand', () => {
	void it('BYTE_LENGTH', () => {
		strictEqual(SubUmbrellaCommand.BYTE_LENGTH, 12);
	});
});
