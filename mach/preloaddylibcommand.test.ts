import { assertEquals } from '@std/assert';

import { PreloadDylibCommand } from './preloaddylibcommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(PreloadDylibCommand.BYTE_LENGTH, 20);
});
