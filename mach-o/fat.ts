// deno-lint-ignore-file camelcase
import { constant, toStringTag } from '@hqtsm/class';
import { int32, Struct, uint32, uint64 } from '@hqtsm/struct';
import type { int32_t, uint32_t, uint64_t } from '../libc/stdint.ts';

// Constants for fat_header magic:

/**
 * Fat magic number, 32-bit.
 */
export const FAT_MAGIC = 0xcafebabe;

/**
 * Fat magic number, 32-bit, byte swapped.
 */
export const FAT_CIGAM = 0xbebafeca;

/**
 * Fat header.
 *
 * @template TArrayBuffer Buffer type.
 */
export class fat_header<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer> {
	/**
	 * Fat magic.
	 */
	declare public magic: uint32_t;

	/**
	 * Number of fat architectures that follow.
	 */
	declare public nfat_arch: uint32_t;

	static {
		toStringTag(this, 'fat_header');
		uint32(this, 'magic');
		uint32(this, 'nfat_arch');
		constant(this, 'BYTE_LENGTH');
	}
}

/**
 * Fat architecture, 32-bit.
 *
 * @template TArrayBuffer Buffer type.
 */
export class fat_arch<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer> {
	/**
	 * CPU type.
	 */
	declare public cputype: int32_t;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: int32_t;

	/**
	 * File offset.
	 */
	declare public offset: uint32_t;

	/**
	 * Byte length.
	 */
	declare public size: uint32_t;

	/**
	 * Alignment as a power of 2.
	 */
	declare public align: uint32_t;

	static {
		toStringTag(this, 'fat_arch');
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint32(this, 'offset');
		uint32(this, 'size');
		uint32(this, 'align');
		constant(this, 'BYTE_LENGTH');
	}
}

// Constants for fat_header_64 magic:

/**
 * Fat magic number, 64-bit.
 */
export const FAT_MAGIC_64 = 0xcafebabf;

/**
 * Fat magic number, 64-bit, byte swapped.
 */
export const FAT_CIGAM_64 = 0xbfbafeca;

/**
 * Fat architecture, 64-bit.
 *
 * @template TArrayBuffer Buffer type.
 */
export class fat_arch_64<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Struct<TArrayBuffer> {
	/**
	 * CPU type.
	 */
	declare public cputype: int32_t;

	/**
	 * Machine type.
	 */
	declare public cpusubtype: int32_t;

	/**
	 * File offset.
	 */
	declare public offset: uint64_t;

	/**
	 * Byte length.
	 */
	declare public size: uint64_t;

	/**
	 * Alignment as a power of 2.
	 */
	declare public align: uint32_t;

	/**
	 * Reserved.
	 */
	declare public reserved: uint32_t;

	static {
		toStringTag(this, 'fat_arch_64');
		int32(this, 'cputype');
		int32(this, 'cpusubtype');
		uint64(this, 'offset');
		uint64(this, 'size');
		uint32(this, 'align');
		uint32(this, 'reserved');
		constant(this, 'BYTE_LENGTH');
	}
}
