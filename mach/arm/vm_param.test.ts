import { assertEquals } from '@std/assert';
import {
	machine_ptob_arm,
	machine_ptob_arm64,
	PAGE_MAX_MASK_ARM,
	PAGE_MAX_SHIFT_ARM,
	PAGE_MAX_SIZE_ARM,
	PAGE_MIN_MASK_ARM,
	PAGE_MIN_SHIFT_ARM,
	PAGE_MIN_SIZE_ARM,
	PAGE_SIZE_ARM,
	PAGE_SIZE_ARM64,
} from './vm_param.ts';

Deno.test('constant expressions', () => {
	assertEquals(PAGE_MAX_SIZE_ARM, 1 << PAGE_MAX_SHIFT_ARM);
	assertEquals(PAGE_MAX_MASK_ARM, PAGE_MAX_SIZE_ARM - 1);
	assertEquals(PAGE_MIN_SIZE_ARM, 1 << PAGE_MIN_SHIFT_ARM);
	assertEquals(PAGE_MIN_MASK_ARM, PAGE_MIN_SIZE_ARM - 1);
});

Deno.test('machine_ptob_arm', () => {
	assertEquals(machine_ptob_arm(0), 0);
	assertEquals(machine_ptob_arm(1), PAGE_SIZE_ARM);
	assertEquals(machine_ptob_arm(2), PAGE_SIZE_ARM * 2);
});

Deno.test('machine_ptob_arm64', () => {
	assertEquals(machine_ptob_arm64(0), 0);
	assertEquals(machine_ptob_arm64(1), PAGE_SIZE_ARM64);
	assertEquals(machine_ptob_arm64(2), PAGE_SIZE_ARM64 * 2);
});
