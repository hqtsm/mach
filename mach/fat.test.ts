import { assertEquals } from '@std/assert';
import * as fat from './fat.ts';

const BYTE_LENGTH = {
	fat_arch: 20,
	fat_arch_64: 32,
	fat_header: 8,
} as const;

Deno.test('BYTE_LENGTH', () => {
	for (
		const [key, value] of Object.entries(BYTE_LENGTH) as [
			keyof typeof BYTE_LENGTH,
			number,
		][]
	) {
		assertEquals(fat[key].BYTE_LENGTH, value);
	}
});
