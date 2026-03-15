import { assertEquals } from '@std/assert';
import {
	PAGE_MAX_MASK_I386,
	PAGE_MAX_SHIFT_I386,
	PAGE_MAX_SIZE_I386,
	PAGE_MIN_MASK_I386,
	PAGE_MIN_SHIFT_I386,
	PAGE_MIN_SIZE_I386,
} from './vm_param.ts';

Deno.test('constant expressions', () => {
	assertEquals(PAGE_MAX_SIZE_I386, 1 << PAGE_MAX_SHIFT_I386);
	assertEquals(PAGE_MAX_MASK_I386, PAGE_MAX_SIZE_I386 - 1);
	assertEquals(PAGE_MIN_SIZE_I386, 1 << PAGE_MIN_SHIFT_I386);
	assertEquals(PAGE_MIN_MASK_I386, PAGE_MIN_SIZE_I386 - 1);
});
