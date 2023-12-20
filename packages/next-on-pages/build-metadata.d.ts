/**
 * Metadata generated by the next-on-pages build process
 */
type NextOnPagesBuildMetadata = {
	/** Locales used by the application (collected from the Vercel output) */
	collectedLocales: string[];
	/** (subset of) values obtained from the user's next.config.js (if any was found) */
	config?: {
		experimental?: Pick<
			NonNullable<
				// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- the import needs to be dynamic since the nextConfig file itself uses this type
				import('./src/buildApplication/nextConfig').NextConfig['experimental']
			>,
			'allowedRevalidateHeaderKeys' | 'fetchCacheKeyPrefix'
		>;
	};
};
