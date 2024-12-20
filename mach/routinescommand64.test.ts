import { assertEquals } from '@std/assert';
import { RoutinesCommand64 } from './routinescommand64.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(RoutinesCommand64.BYTE_LENGTH, 72);
});
