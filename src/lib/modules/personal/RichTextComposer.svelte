<script lang="ts">
	import { storyState } from '$lib/stores';
	import Editor from '@tinymce/tinymce-svelte';

	let {
		value = $bindable('')
	}: {
		value?: string;
	} = $props();

	let apiKey = 'zvfap2kkclg3r9gzfbfmj45yq4wp820yxpn9r4e4vlbtbieo';
	let conf = {
		height: 500,
		content_langs: [
			{ title: 'English', code: 'en' },
			{ title: 'Spanish', code: 'es' }
		],
		plugins: [
			'advlist',
			// 'advtable',
			'autolink',
			// 'checklist'
			// 'export',
			'lists',
			'link',
			'image',
			'charmap',
			'preview',
			'anchor',
			'searchreplace',
			'visualblocks',
			// 'powerpaste',
			'fullscreen',
			// 'formatpainter',
			'insertdatetime',
			'media',
			'table',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | a11ycheck casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | ' +
			'bullist numlist checklist outdent indent | removeformat | code table help | language'
	};
</script>

<!-- <Editor {apiKey} {conf} bind:value /> -->
