import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import process from 'process'
// https://vitejs.dev/config/
export default defineConfig((mode) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		plugins: [ svgr(),react() ],
		// define:{
		// 	'process.env':{}
		// },
		server: {
			host: true,
			proxy: {
				'/api': {
					target: env.VITE_BACKEND_URL,
					changeOrigin: true,
					secure: false,
					ws: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},
		github: {
			silent: true
		},
		rewrites: [
			{
				source: '(.*)',
				destination: '/index.html'
			}
		]
	};
});
