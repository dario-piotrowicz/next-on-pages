/**
 * Generates the javascript content (as a plain string) that deals with the global scope that needs to be
 * added to the built worker.
 *
 * @returns the plain javascript string that should be added at the top of the the _worker.js file
 */
export function generateGlobalJs(): string {
	return `
		import('node:buffer').then(({ Buffer }) => {
			globalThis.Buffer = Buffer;
		})
		.catch(() => null);

		const __ALSes_PROMISE__ = import('node:async_hooks').then(({ AsyncLocalStorage }) => {
			globalThis.AsyncLocalStorage = AsyncLocalStorage;

			const envAsyncLocalStorage = new AsyncLocalStorage();
			const cloudflareAsyncLocalStorage = new AsyncLocalStorage();

			globalThis.process = {
				env: new Proxy(
					{},
					{
						ownKeys: () => Reflect.ownKeys(envAsyncLocalStorage.getStore()),
						getOwnPropertyDescriptor: (_, ...args) =>
							Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args),
						get: (_, property) => Reflect.get(envAsyncLocalStorage.getStore(), property),
						set: (_, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value),
				}),
			};

			globalThis.cloudflare = new Proxy(
				{},
				{
					ownKeys: () => Reflect.ownKeys(cloudflareAsyncLocalStorage.getStore()),
					getOwnPropertyDescriptor: (_, ...args) =>
						Reflect.getOwnPropertyDescriptor(cloudflareAsyncLocalStorage.getStore(), ...args),
					get: (_, property) => Reflect.get(cloudflareAsyncLocalStorage.getStore(), property),
					set: (_, property, value) => Reflect.set(cloudflareAsyncLocalStorage.getStore(), property, value),
				}
			);

			return { envAsyncLocalStorage, cloudflareAsyncLocalStorage };
		})
		.catch(() => null);
	`;
}
