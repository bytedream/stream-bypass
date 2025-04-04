import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'no-undef': 'off'
		}
	},
	{
		ignores: [
			'.DS_Store',
			'node_modules',
			'dist',
			'release',
			'.idea',
			'.env',
			'.env.*',
			'!.env.example',
			'package-lock.json'
		]
	}
);
