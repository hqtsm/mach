export function testOOM<T>(
	sizes: Iterable<number>,
	callback: () => T,
	Err: new (message: string) => Error = RangeError,
	message = 'TEST-OOM',
): T {
	const s = new Set<unknown>(sizes);
	const desc = Object.getOwnPropertyDescriptor(globalThis, 'ArrayBuffer')!;
	Object.defineProperty(globalThis, 'ArrayBuffer', {
		...desc,
		value: new Proxy(desc.value, {
			construct(target: () => unknown, args: unknown[]): object {
				if (s.has(args[0])) {
					throw new Err(message);
				}
				return Reflect.construct(target, args);
			},
		}),
	});
	let r;
	try {
		r = callback();
	} finally {
		if (
			r &&
			typeof r === 'object' &&
			'then' in r &&
			'catch' in r &&
			'finally' in r
		) {
			r = (r as unknown as Promise<unknown>).finally(() => {
				Object.defineProperty(globalThis, 'ArrayBuffer', desc);
			}) as T;
		} else {
			Object.defineProperty(globalThis, 'ArrayBuffer', desc);
		}
	}
	return r;
}
