import { assertEquals } from '@std/assert';
import { DylibModule } from './dylibmodule.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DylibModule.BYTE_LENGTH, 52);
});
