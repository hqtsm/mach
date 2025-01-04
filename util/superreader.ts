import type { Reader } from './reader.ts';

/**
 * Multiple readers wrapped in a single super reader.
 */
export class SuperReader implements Reader {
	/**
	 * Readers.
	 */
	#readers: Reader[];

	/**
	 * Total size.
	 */
	#size: number;

	/**
	 * Type of data.
	 */
	#type: string;

	/**
	 * Create a SuperReader for a list of readers.
	 *
	 * @param readers Readers.
	 * @param options Options.
	 */
	constructor(readers?: Iterable<Reader>, options?: { type?: string }) {
		let total = 0;
		const list: Reader[] = this.#readers = [];
		for (const r of readers || list) {
			total += r.size;
			list.push(r);
		}
		this.#size = total;
		this.#type = `${options?.type ?? ''}`;
	}

	public get size(): number {
		return this.#size;
	}

	public get type(): string {
		return this.#type;
	}

	public async arrayBuffer(): Promise<ArrayBuffer> {
		const size = this.#size;
		const buffer = new ArrayBuffer(size);
		if (size) {
			const view = new Uint8Array(buffer);
			let offset = 0;
			for (const r of this.#readers) {
				// deno-lint-ignore no-await-in-loop
				const data = await r.arrayBuffer();
				view.set(new Uint8Array(data), offset);
				offset += data.byteLength;
			}
		}
		return buffer;
	}

	public slice(
		start?: number,
		end?: number,
		contentType?: string,
	): SuperReader {
		let s = this.#size;
		start ??= 0;
		end ??= s;
		start = (+start || 0) - (+start % 1 || 0);
		end = (+end || 0) - (+end % 1 || 0);
		contentType = `${contentType ?? ''}`;
		start = start > s ? s : (start < 0 && (start += s) < 0 ? 0 : start);
		end = end > s ? s : (end < 0 && (end += s) < 0 ? 0 : end);
		let readers: Reader[];
		let r: Reader;
		if (start >= end) {
			readers = [];
		} else {
			s -= end;
			readers = [...this.#readers];
			for (let i = readers.length; s > 0;) {
				r = readers[--i];
				if ((s -= r.size) < 0) {
					readers[i] = r.slice(0, -s);
				} else {
					readers.length = i;
				}
			}
			for (; start > 0;) {
				r = readers[0];
				if ((start -= r.size) < 0) {
					readers[0] = r.slice(start);
				} else {
					readers.shift();
				}
			}
		}
		return new SuperReader(readers, { type: contentType });
	}
}
