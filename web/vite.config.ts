import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

const env = process.env;

export default defineConfig({
	plugins: [
		devtoolsJson({ uuid: '612d0dc7-ecc1-4ebd-8daf-7201d2a8a133' }),

		// following is not recommended, see:
		// - https://v4.vitejs.dev/config/server-options.html#server-https
		// - https://github.com/vitejs/vite-plugin-basic-ssl
		basicSsl({
			/** name of certification */
			name: 'test',
			/** custom trust domains */
			domains: ['*.custom.com'],
			/** custom certification directory */
			certDir: `${env.HOME}/.devServer/cert`
		}),
		tailwindcss(),
		sveltekit()
	],
	build: {
		emptyOutDir: true,
		minify: false,
		sourcemap: true
	}
});
