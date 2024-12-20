import { assertEquals } from '@std/assert';
import { VersionMinCommand } from './versionmincommand.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(VersionMinCommand.BYTE_LENGTH, 16);
});
