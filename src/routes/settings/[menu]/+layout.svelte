<script lang="ts">
	import type { NavegationMenu } from '$lib/interfaces';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let navigationOptions: NavegationMenu[] = [
		{
			type: 'info',
			name: 'Mi cuenta'
		},
		{
			type: 'preferences',
			name: 'Preferencias'
		},
		{
			type: 'security',
			name: 'Seguridad'
		},
		{
			type: 'norms',
			name: 'Normas y politicas'
		}
	];

	let selectedMenu = $state(data.menu);

	$effect(() => {
		selectedMenu = data.menu;
	});
</script>

<div class="flex flex-col gap-8 px-16 py-7">
	<!-- header -->
	<div class="flex flex-col gap-3">
		<!-- configuraciones  label-->
		<p class="text-alineados-orange-900">Configuracion</p>

		<!-- configuraciones titulos -->
		<h1 class="text-3xl font-bold">Configuraciones</h1>

		<div class="border border-b border-stone-100"></div>
	</div>

	<!-- navegations menu -->
	{#snippet navegation(type: string, name: string)}
		<a
			href={`/settings/${type}/`}
			class:bg-stone-800={type == selectedMenu}
			class:text-stone-100={type == selectedMenu}
			class:text-stone-600={type !== selectedMenu}
			class="rounded-lg bg-stone-100 px-5 py-2 text-base">{name}</a
		>
	{/snippet}

	<div class="flex gap-4">
		{#each navigationOptions as menu}
			{@render navegation(menu.type, menu.name)}
		{/each}
	</div>

	<div class="flex flex-col">
		{@render children()}
	</div>
	<!-- information del usuarios -->

	<!-- fields -->
</div>
