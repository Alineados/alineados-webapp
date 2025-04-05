<script lang="ts">
	import LoginForm from '$lib/modules/auth/LoginForm.svelte';
	import type { LoginData } from '$lib/interfaces/Auth.interface';
	import { onMount } from 'svelte';
	import Header from '$lib/modules/auth/components/Header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Initial state
	let loginData = $state<LoginData>();

	onMount(() => {
		loginData = {
			identifier: '',
			password: ''
		};
	});

	// JSON representation of the onboarding data
	let dataJSON = $state('');

	$effect(() => {
		dataJSON = JSON.stringify(loginData);
	});
</script>

<Header
	title="Bienvenido al espacio donde organizas tu vida y tomas decisiones."
	description="Inicia sesión "
/>
{#if loginData && data.post.uid}
	<LoginForm bind:data={loginData} bind:dataJSON bind:uid={data.post.uid} />
{/if}
