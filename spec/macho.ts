import { assert, assertEquals } from '@std/assert';
import {
	FAT_CIGAM,
	FAT_CIGAM_64,
	FAT_MAGIC,
	FAT_MAGIC_64,
	MH_CIGAM,
	MH_CIGAM_64,
	MH_MAGIC,
	MH_MAGIC_64,
} from '../const.ts';

export function thin(
	data: Readonly<ArrayBufferView>,
	type: number,
	subtype: number | null = null,
): Uint8Array {
	const v = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const magic = v.getUint32(0);
	let f = false;
	let b = false;
	let e = false;
	switch (magic) {
		case MH_MAGIC: {
			break;
		}
		case MH_MAGIC_64: {
			b = true;
			break;
		}
		case MH_CIGAM: {
			e = true;
			break;
		}
		case MH_CIGAM_64: {
			e = true;
			b = true;
			break;
		}
		case FAT_MAGIC: {
			f = true;
			break;
		}
		case FAT_MAGIC_64: {
			f = true;
			b = true;
			break;
		}
		case FAT_CIGAM: {
			f = true;
			e = true;
			break;
		}
		case FAT_CIGAM_64: {
			f = true;
			e = true;
			b = true;
			break;
		}
		default: {
			throw new Error(`Unknown magic: ${magic}`);
		}
	}
	if (!f) {
		const cputype = v.getInt32(4, e);
		const cpusubtype = v.getInt32(8, e);
		assert(
			!(cputype !== type || (subtype && cpusubtype !== subtype)),
			`Wrong arch: ${cputype} ${cpusubtype}`,
		);
		return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
	}
	const count = v.getUint32(4, e);
	const slices: [number, number][] = [];
	let o = 8;
	for (let i = 0; i < count; i++) {
		const cputype = v.getInt32(o, e);
		o += 4;
		const cpusubtype = v.getInt32(o, e);
		o += 4;
		const offset = b ? Number(v.getBigUint64(o, e)) : v.getUint32(o, e);
		o += b ? 8 : 4;
		const size = b ? Number(v.getBigUint64(o, e)) : v.getUint32(o, e);
		o += b ? 8 : 4;
		// Ignore align:
		o += 4;
		if (cputype === type && (subtype === null || cpusubtype === subtype)) {
			slices.push([offset, size]);
		}
	}
	assertEquals(slices.length, 1, `Matching archs: ${slices.length}`);
	const [[offset, size]] = slices;
	return new Uint8Array(data.buffer, data.byteOffset + offset, size);
}
