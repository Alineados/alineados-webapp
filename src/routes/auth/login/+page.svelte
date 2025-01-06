<script lang="ts">
	import Aside from '$lib/modules/auth/components/Aside.svelte';
	import AsideContent from '$lib/modules/auth/components/AsideContent.svelte';
	import ContentSide from '$lib/modules/auth/components/ContentSide.svelte';
	import Header from '$lib/modules/auth/components/Header.svelte';
	import LoginForm from '$lib/modules/auth/LoginForm.svelte';
	import type { LoginData } from '$lib/interfaces/Auth.interface';
	import { onMount } from 'svelte';

	// Initial state
	let loginData = $state<LoginData>();

	onMount(() => {
		loginData = {
			identifier: '',
			password: ''
		};
	});

	// JSON representation of the login data
	let loginDataJSON = $state('');

	$effect(() => {
		loginDataJSON = JSON.stringify(loginData);
	});
</script>

<ContentSide>
	<Header
		title="Bienvenido de nuevo a tu propia herramienta de vida"
		description="Hoy es un nuevo día. Es tu día. 
		Inicia sesión para comenzar a gestionar tu alineación"
	/>
	{#if loginData}
		<LoginForm data={loginData} />
	{/if}
</ContentSide>

<Aside>
	<AsideContent />
</Aside>
