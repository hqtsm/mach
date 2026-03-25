import {
	vm_page_mask_i386,
	vm_page_shift_i386,
	vm_page_size_i386,
} from '../vm_page_size.ts';

/**
 * Byte size in bits: i386.
 */
export const BYTE_SIZE_I386 = 8;

/**
 * Legacy i386 page bytes.
 */
export const I386_PGBYTES = 4096;

/**
 * Legacy i386 page shift.
 */
export const I386_PGSHIFT = 12;

/**
 * Page shift: i386.
 */
export const PAGE_SHIFT_I386 = vm_page_shift_i386;

/**
 * Page size: i386.
 */
export const PAGE_SIZE_I386 = vm_page_size_i386;

/**
 * Page mask: i386.
 */
export const PAGE_MASK_I386 = vm_page_mask_i386;

/**
 * Page max shift: i386.
 */
export const PAGE_MAX_SHIFT_I386 = 14;

/**
 * Page max size: i386.
 *
 * `1 << PAGE_MAX_SHIFT`
 */
export const PAGE_MAX_SIZE_I386 = 0x4000;

/**
 * Page max mask: i386.
 *
 * `PAGE_MAX_SIZE - 1`
 */
export const PAGE_MAX_MASK_I386 = 0x3fff;

/**
 * Page min shift: i386.
 */
export const PAGE_MIN_SHIFT_I386 = 12;

/**
 * Page min size: i386.
 *
 * `1 << PAGE_MIN_SHIFT`
 */
export const PAGE_MIN_SIZE_I386 = 0x1000;

/**
 * Page min mask: i386.
 *
 * `PAGE_MIN_SIZE - 1`
 */
export const PAGE_MIN_MASK_I386 = 0xfff;

/**
 * VM min address 64-bit: i386.
 */
export const VM_MIN_ADDRESS64_I386 = 0x0000000000000000n;

/**
 * VM user stack 64-bit: i386.
 */
export const VM_USRSTACK64_I386 = 0x7FF7BFF00000n;

/**
 * VM dyld 64-bit: i386.
 */
export const VM_DYLD64_I386 = 0x00007FFF5FC00000n;

/**
 * VM dyld shared 64-bit: i386.
 */
export const VM_LIB64_SHR_DATA_I386 = 0x00007FFF60000000n;

/**
 * VM dyld shared text 64-bit: i386.
 */
export const VM_LIB64_SHR_TEXT_I386 = 0x00007FFF80000000n;

/**
 * End of usable address space: i386.
 */
export const VM_MAX_PAGE_ADDRESS_I386 = 0x00007FFFFFE00000n;

/**
 * End of user address space: i386.
 */
export const VM_MAX_USER_PAGE_ADDRESS_I386 = 0x00007FFFFFFFF000n;

/**
 * Mach VM min address: i386.
 */
export const MACH_VM_MIN_ADDRESS_I386 = 0n;

/**
 * Mach VM max address: i386.
 */
export const MACH_VM_MAX_ADDRESS_I386 = VM_MAX_PAGE_ADDRESS_I386;

/**
 * VM min address: i386.
 */
export const VM_MIN_ADDRESS_I386 = 0;

/**
 * VM user stack 32-bit: i386.
 */
export const VM_USRSTACK32_I386 = 0xC0000000;

/**
 * VM max address: i386.
 */
export const VM_MAX_ADDRESS_I386 = 0xFFE00000;
