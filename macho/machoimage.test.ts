import { assertEquals, assertStrictEquals } from '@std/assert';
import { MH_MAGIC } from '../const.ts';
import { load_command, mach_header } from '../mach/loader.ts';
import { MachOImage } from './machoimage.ts';

Deno.test('constructor', () => {
	const buffer = new ArrayBuffer(
		mach_header.BYTE_LENGTH + load_command.BYTE_LENGTH,
	);
	const header = new mach_header(buffer);
	header.magic = MH_MAGIC;
	header.ncmds = 1;
	header.sizeofcmds = load_command.BYTE_LENGTH;

	{
		const macho = new MachOImage(buffer);
		const address = MachOImage.address(macho);
		assertEquals(address.byteOffset, 0);
		assertStrictEquals(address.buffer, buffer);
	}

	{
		const data = new Uint8Array(buffer.byteLength + 2);
		data.subarray(1).set(new Uint8Array(buffer));
		const macho = new MachOImage(data.subarray(1));
		const address = MachOImage.address(macho);
		assertEquals(address.byteOffset, 1);
		assertStrictEquals(address.buffer, data.buffer);
	}
});
