// @ts-check

/** @type {import("prettier").Config} */
module.exports = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 120,
	tabWidth: 4,
	plugins: ['prettier-plugin-svelte', '@ianvs/prettier-plugin-sort-imports'],
	/* prettier-plugin-svelte */
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	/* @ianvs/prettier-plugin-sort-imports */
	importOrder: ['^~/(.*)$', '^./(.*)$', ''],
	importOrderParserPlugins: ['typescript'],
	importOrderTypeScriptVersion: '5.0.0',
	importOrderCaseSensitive: false
};
