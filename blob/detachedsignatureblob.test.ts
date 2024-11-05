import { assertEquals } from '@std/assert';

import { DetachedSignatureBlob } from './detachedsignatureblob.ts';

Deno.test('BYTE_LENGTH', () => {
	assertEquals(DetachedSignatureBlob.BYTE_LENGTH, 12);
});
