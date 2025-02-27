import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			'@tinymce/tinymce-svelte',
			'embla-carousel-svelte',
			'embla-carousel-autoplay',
			'phoenix',
			'comlink',
			'svelte-confetti'
		]
	}
});
