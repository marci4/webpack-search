/*
 * Copyright (c) 2019 Marcel Prestel
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <admin@marci4.de> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.
 */

import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
		},
		{
			file: pkg.module,
			format: 'es',
		},
	],
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
		'fs', 'path'
	],

	plugins: [
		typescript({
			typescript: require('typescript'),
		}),
	],
}
