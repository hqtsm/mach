import { assertEquals, assertStrictEquals } from '@std/assert';
import { MH_MAGIC } from '../const.ts';
import { LoadCommand } from '../mach/loadcommand.ts';
import { MachHeader } from '../mach/machheader.ts';
import { MachOImage } from './machoimage.ts';

Deno.test('constructor', () => {
	const buffer = new ArrayBuffer(
		MachHeader.BYTE_LENGTH + LoadCommand.BYTE_LENGTH,
	);
	const header = new MachHeader(buffer);
	header.magic = MH_MAGIC;
	header.ncmds = 1;
	header.sizeofcmds = LoadCommand.BYTE_LENGTH;

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
