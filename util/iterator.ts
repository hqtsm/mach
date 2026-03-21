/**
 * Size iterator yield.
 *
 * @template T Value type.
 */
export interface SizeIteratorYield<T> {
	/**
	 * Not done.
	 */
	done?: false;

	/**
	 * Value.
	 */
	value: T;
}

/**
 * Size iterator return.
 */
export interface SizeIteratorReturn {
	/**
	 * Done.
	 */
	done: true;

	/**
	 * Value.
	 */
	value?: undefined;
}

/**
 * Size iterator next.
 *
 * @template T Value type.
 */
export type SizeIteratorNext<T> = SizeIteratorYield<T> | SizeIteratorReturn;

/**
 * Size iterator.
 *
 * @template T Value type.
 * @template S Size type.
 * @template R Return type.
 */
// deno-lint-ignore no-explicit-any
export interface SizeIterator<T, S = number, R = any> {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: S): SizeIteratorNext<T>;

	/**
	 * Close iterator.
	 *
	 * @param _ Unused.
	 */
	// deno-lint-ignore no-explicit-any
	return?(_?: any): R;
}

/**
 * Size async iterator.
 *
 * @template T Value type.
 * @template S Size type.
 * @template R Return type.
 */
// deno-lint-ignore no-explicit-any
export interface SizeAsyncIterator<T, S = number, R = any> {
	/**
	 * Get the next value.
	 *
	 * @param size Requested size.
	 * @returns Next value.
	 */
	next(size?: S): Promise<SizeIteratorNext<T>>;

	/**
	 * Close iterator.
	 *
	 * @param _ Unused.
	 */
	// deno-lint-ignore no-explicit-any
	return?(_?: any): Promise<R>;
}

/**
 * Split iterator into multiple.
 *
 * @param iter Iterator.
 * @param size Size reducer function.
 * @param count Number of iterators.
 * @returns Iterators.
 */
export function sizeAsyncIterators<T>(
	iter: SizeAsyncIterator<T>,
	size: (sizes: number[]) => number | undefined,
	count: number,
): SizeAsyncIterator<T, number, void>[] {
	interface Task {
		resolve: (value: SizeIteratorNext<T>) => void;
		reject: (err: unknown) => void;
		size: number | undefined;
	}

	let step = 0;
	let running: Promise<void> | null = null;
	let process = Promise.resolve();
	const tasked = new Map<number, Map<number, Task>>();
	const processer = async () => {
		LOOP: for (const sizes: number[] = []; tasked.size; step++) {
			let i = sizes.length = 0;

			// Wait for all tasks to be ready.
			for (const tasks of tasked.values()) {
				const task = tasks.get(step);
				if (!task) {
					break LOOP;
				}
				sizes[i++] = task.size || 0;
			}

			try {
				// deno-lint-ignore no-await-in-loop
				const value = await iter.next(size(sizes));
				for (const tasks of tasked.values()) {
					const task = tasks.get(step);
					if (task) {
						task.resolve(value);
						tasks.delete(step);
					}
				}
			} catch (err) {
				for (const tasks of tasked.values()) {
					const task = tasks.get(step);
					if (task) {
						task.reject(err);
						tasks.delete(step);
					}
				}
			}
		}
		running = null;
	};
	const flush = () => {
		running ||= process = process.then(processer);
	};

	const tee: SizeAsyncIterator<T, number, void>[] = [];
	for (let i = 0; i < count; i++) {
		let returned: Promise<void> | undefined;
		let step = 0;
		const tasks = new Map<number, Task>();
		tasked.set(i, tasks);
		tee.push({
			next(size?: number): Promise<SizeIteratorNext<T>> {
				return tasked.has(i)
					? new Promise((resolve, reject) => {
						tasks.set(step++, {
							resolve,
							reject,
							size,
						});
						flush();
					})
					: Promise.resolve({ done: true });
			},
			return(): Promise<void> {
				if (returned) {
					return returned;
				}

				// Finish pending tasks and remove from the list.
				for (const [i, task] of tasks) {
					task.resolve({ done: true });
					tasks.delete(i);
				}
				tasked.delete(i);

				// Continue if there are more tasks.
				if (tasked.size) {
					flush();
					return returned = Promise.resolve();
				}

				// Forward return on the last iterator.
				const p = iter.return?.();
				return returned = p ? p.then(() => process) : process;
			},
		});
	}
	return tee;
}
