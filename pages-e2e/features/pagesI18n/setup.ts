import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import * as recast from 'recast';

import { copyWorkspaceAssets } from '../_utils/copyWorkspaceAssets';

await copyWorkspaceAssets();

const { WORKSPACE_DIR } = process.env;

const nextConfigJsPath = join(WORKSPACE_DIR, 'next.config.js');

const nextConfigJsSource = await readFile(nextConfigJsPath, 'utf-8');

const ast = recast.parse(nextConfigJsSource);

recast.visit(ast, {
	visitVariableDeclaration: function (path) {
		if (
			path?.value?.declarations.length === 1 &&
			path.value.declarations[0].id?.name === 'nextConfig'
		) {
			const nextConfigAst = path.value.declarations[0].init;

			const { property, identifier } = recast.types.builders;

			const i18nPropValueObj = {
				locales: ['en', 'fr', 'nl', 'es'],
				defaultLocale: 'en',
				domains: [
				  {
					domain: 'example.es',
					defaultLocale: 'es',
				  },
				],
			};

			const parsedObj = recast.parse(`{
				const myObj = ${JSON.stringify(i18nPropValueObj)}
			}`).program.body[0].body[0].declarations[0].init;
		
			var i18nProp = property.from({
				kind: 'init',
				key: identifier('i18n'),
				value: parsedObj,
				shorthand: true,
			});
		
			// nextConfigAst.properties.push(i18nProp);
		}
		this.traverse(path);
	},
});

await writeFile(nextConfigJsPath, recast.prettyPrint(ast).code);
