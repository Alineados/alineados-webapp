<script lang="ts">
	import LoginForm from '$lib/modules/auth/LoginForm.svelte';
	import type { LoginData } from '$lib/interfaces/Auth.interface';
	import { onMount } from 'svelte';
	import Header from '$lib/modules/auth/components/Header.svelte';

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
	title="Bienvenido de nuevo a tu propia herramienta de vida"
	description="Hoy es un nuevo día, es tu día. 
	Inicia sesión para comenzar a gestionar tu alineación"
/>
{#if loginData}
	<LoginForm bind:data={loginData} bind:dataJSON />
{/if}
