export function testOOM<T>(sizes: Iterable<number>, f: () => T): T {
	const s = new Set<unknown>(sizes);
	const desc = Object.getOwnPropertyDescriptor(globalThis, 'ArrayBuffer')!;
	Object.defineProperty(globalThis, 'ArrayBuffer', {
		...desc,
		value: new Proxy(desc.value, {
			construct(target: () => unknown, args: unknown[]): object {
				if (s.has(args[0])) {
					throw new RangeError('TEST-OOM');
				}
				return Reflect.construct(target, args);
			},
		}),
	});
	let r;
	try {
		r = f();
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
