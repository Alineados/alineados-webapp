<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from '../$types';
	import { initProblems } from '$lib/stores';

	let { data, children }: { data: LayoutData & { problems: any }; children: Snippet } = $props();


	// console.log(data);

	initProblems({ ...data.problems });
</script>

<!-- +page.svelte is `@render`ed here -->
{@render children()}
