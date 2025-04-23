<script lang="ts">
	import { storyState } from '$lib/stores';
	import Editor from '@tinymce/tinymce-svelte';

	let {
		value = $bindable(''),
		type = '', // story | thoughts
		animate = false
	}: {
		value?: string;
		type?: string;
		animate?: boolean;
	} = $props();

	let apiKey = 'zvfap2kkclg3r9gzfbfmj45yq4wp820yxpn9r4e4vlbtbieo';
	let conf = {
		height: 500,
		// Add custom styles to the editor
		content_style: 'body { border: 2px solid transparent; } body.animate { animation: border-blink 1s infinite; }',
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

	const hasContent = $derived(value && value.trim() !== '');
	const editorClass = $derived(animate && !hasContent ? 'animate' : '');
</script>

<div class="editor-wrapper {animate && !hasContent ? 'animate-border-cursor-blink border-transparent' : '!border-alineados-gray-100'}">
    <Editor {apiKey} {conf} bind:value cssClass={editorClass} />
</div>

<style>
    .editor-wrapper {
        border: 2px solid;
        border-radius: 0.5rem;
    }
    
    .editor-wrapper :global(.tox-tinymce) {
        border: none !important;
        border-radius: 0.5rem !important;
    }
</style>
