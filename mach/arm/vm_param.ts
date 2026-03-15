// deno-lint-ignore-file camelcase
import {
	vm_page_mask_arm,
	vm_page_mask_arm64,
	vm_page_shift_arm,
	vm_page_shift_arm64,
	vm_page_size_arm,
	vm_page_size_arm64,
} from '../vm_page_size.ts';

/**
 * Byte size in bits: ARM.
 */
export const BYTE_SIZE_ARM = 8;

/**
 * Page shift: ARM.
 */
export const PAGE_SHIFT_ARM = vm_page_shift_arm;

/**
 * Page shift: ARM64.
 */
export const PAGE_SHIFT_ARM64 = vm_page_shift_arm64;

/**
 * Page size: ARM.
 */
export const PAGE_SIZE_ARM = vm_page_size_arm;

/**
 * Page size: ARM64.
 */
export const PAGE_SIZE_ARM64 = vm_page_size_arm64;

/**
 * Page mask: ARM.
 */
export const PAGE_MASK_ARM = vm_page_mask_arm;

/**
 * Page mask: ARM64.
 */
export const PAGE_MASK_ARM64 = vm_page_mask_arm64;

/**
 * VM page size: ARM.
 */
export const VM_PAGE_SIZE_ARM = vm_page_size_arm;

/**
 * VM page size: ARM64.
 */
export const VM_PAGE_SIZE_ARM64 = vm_page_size_arm64;

/**
 * Machine pages to bytes: ARM.
 *
 * @param x Pages.
 * @returns Bytes.
 */
export const machine_ptob_arm = (x: number): number =>
	(x << PAGE_SHIFT_ARM) >>> 0;

/**
 * Machine pages to bytes: ARM64.
 *
 * @param x Pages.
 * @returns Bytes.
 */
export const machine_ptob_arm64 = (x: number): number =>
	(x << PAGE_SHIFT_ARM64) >>> 0;

/**
 * Page max shift: ARM.
 */
export const PAGE_MAX_SHIFT_ARM = 14;

/**
 * Page max size: ARM.
 */
export const PAGE_MAX_SIZE_ARM = 0x4000; // 1 << PAGE_MAX_SHIFT

/**
 * Page max mask: ARM.
 */
export const PAGE_MAX_MASK_ARM = 0x3fff; // PAGE_MAX_SIZE - 1

/**
 * Page min shift: ARM.
 */
export const PAGE_MIN_SHIFT_ARM = 12;

/**
 * Page min size: ARM.
 */
export const PAGE_MIN_SIZE_ARM = 0x1000; // 1 << PAGE_MIN_SHIFT

/**
 * Page min mask: ARM.
 */
export const PAGE_MIN_MASK_ARM = 0xfff; // PAGE_MIN_SIZE - 1

/**
 * VM min address: ARM.
 */
export const VM_MIN_ADDRESS_ARM = 0x00000000;

/**
 * VM max address: ARM.
 */
export const VM_MAX_ADDRESS_ARM = 0x80000000;

/**
 * Mach VM min address: ARM.
 */
export const MACH_VM_MIN_ADDRESS_ARM = 0;

/**
 * Mach VM max address: ARM.
 */
export const MACH_VM_MAX_ADDRESS_ARM = VM_MAX_ADDRESS_ARM;

/**
 * VM max page address: ARM.
 */
export const VM_MAX_PAGE_ADDRESS_ARM = MACH_VM_MAX_ADDRESS_ARM;

/**
 * VM min address: ARM64.
 */
export const VM_MIN_ADDRESS_ARM64 = 0x0000000000000000n;

/**
 * VM max address: ARM64.
 */
export const VM_MAX_ADDRESS_ARM64 = 0x00000000F0000000n;

/**
 * Mach VM min address raw: ARM64.
 */
export const MACH_VM_MIN_ADDRESS_RAW_ARM64 = 0x0n;

/**
 * Mach VM max address raw: ARM64.
 */
export const MACH_VM_MAX_ADDRESS_RAW_ARM64 = 0x00007FFFFE000000n;

/**
 * Mach VM min address: ARM64.
 */
export const MACH_VM_MIN_ADDRESS_ARM64 = MACH_VM_MIN_ADDRESS_RAW_ARM64;

/**
 * Mach VM max address: ARM64.
 */
export const MACH_VM_MAX_ADDRESS_ARM64 = MACH_VM_MAX_ADDRESS_RAW_ARM64;

/**
 * VM max page address: ARM64.
 */
export const VM_MAX_PAGE_ADDRESS_ARM64 = MACH_VM_MAX_ADDRESS_ARM64;

/**
 * Mach VM min GPU carveout address raw: ARM64.
 */
export const MACH_VM_MIN_GPU_CARVEOUT_ADDRESS_RAW_ARM64 = 0x0000001000000000n;

/**
 * Mach VM max GPU carveout address raw: ARM64.
 */
export const MACH_VM_MAX_GPU_CARVEOUT_ADDRESS_RAW_ARM64 = 0x0000007000000000n;

/**
 * Mach VM min GPU carveout address: ARM64.
 */
export const MACH_VM_MIN_GPU_CARVEOUT_ADDRESS_ARM64 =
	MACH_VM_MIN_GPU_CARVEOUT_ADDRESS_RAW_ARM64;

/**
 * Mach VM max GPU carveout address: ARM64.
 */
export const MACH_VM_MAX_GPU_CARVEOUT_ADDRESS_ARM64 =
	MACH_VM_MAX_GPU_CARVEOUT_ADDRESS_RAW_ARM64;

/**
 * VM map min address: ARM.
 */
export const VM_MAP_MIN_ADDRESS_ARM = VM_MIN_ADDRESS_ARM;

/**
 * VM map min address: ARM64.
 */
export const VM_MAP_MIN_ADDRESS_ARM64 = VM_MIN_ADDRESS_ARM64;

/**
 * VM map max address: ARM.
 */
export const VM_MAP_MAX_ADDRESS_ARM = VM_MAX_ADDRESS_ARM;

/**
 * VM map max address: ARM64.
 */
export const VM_MAP_MAX_ADDRESS_ARM64 = VM_MAX_ADDRESS_ARM64;

/**
 * ARM SWI syscall: ARM.
 */
export const SWI_SYSCALL_ARM = 0x80;
