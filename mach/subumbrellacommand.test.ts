import { assertEquals } from '@std/assert';

import { SubUmbrellaCommand } from './subumbrellacommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(SubUmbrellaCommand.BYTE_LENGTH, 12);
});
