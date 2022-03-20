import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import livereload from "rollup-plugin-livereload";
import copy from "rollup-plugin-copy";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [
	{
		input: 'src/popup/popup.ts',
		output: {
			sourcemap: !production,
			format: 'iife',
			name: 'main',
			file: 'public/build/popup.js'
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess({ sourceMap: !production }),
				compilerOptions: {
					dev: !production
				}
			}),
			css({output: 'popup.css'}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),

			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production
			}),

			copy({
				targets:[
					{
						src: "node_modules/svelte-material-ui/bare.css",
						dest: "public/build"
					}
				]
			}),

			!production && serve(),
			!production && livereload('public'),
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	},
	{
		input: 'src/injection/injection.ts',
		output: {
			sourcemap: !production,
			format: 'iife',
			name: 'main',
			file: 'public/build/injection.js'
		},
		plugins: [
			resolve({
				browser: true
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production
			})
		],
		watch: {
			clearScreen: false
		}
	}
];
