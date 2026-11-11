import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [
		vue(),
	],
	clearScreen: false, // prevent vite from clearing api log
	define: {
		__VERSION__: JSON.stringify(process.env.npm_package_version)
	},
	base: './',
	server: {
		host: '127.0.0.1',
		port: 5173,
		strictPort: true
	},
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, 'src'), // 设置路径别名
		},
	},
	build: {
		emptyOutDir: true,
		outDir: path.resolve(import.meta.dirname, '..', 'dist')
	}
});