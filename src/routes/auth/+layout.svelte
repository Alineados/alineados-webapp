<script lang="ts">
	import Check from '$lib/icons/AlineadosCheck.svelte';
	import { Button } from '$lib/shared/ui/button/index';
	import Aside from '$lib/modules/auth/components/Aside.svelte';
	import AsideContent from '$lib/modules/auth/components/AsideContent.svelte';
	import type { Snippet } from 'svelte';
	import AlineadosCheck2 from '$lib/icons/AlineadosCheck2.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-5 lg:px-0"
>
	<Button
		href="alineados.com"
		variant="ghost"
		class="absolute left-4 top-4 flex flex-row gap-2 md:left-12 md:top-10  "
	>
		<div
			class="flex aspect-square size-8 items-center justify-center rounded-lg [transform:scale(1.5)]"
		>
			<AlineadosCheck2 />
		</div>
		<div class="flex flex-col justify-center space-y-1">
			<span class="text-sm font-medium leading-none text-black">Alineados</span>
			<span class="text-[10px] font-medium leading-none text-alineados-green-500"
				>No solo sueñes, toma acción</span
			>
		</div>
	</Button>

	<div class="h-full lg:col-span-2 lg:px-16 lg:pb-20 lg:pt-32">
		<div class="flex flex-col justify-center space-y-6 sm:w-[350px] lg:w-full">
			{@render children?.()}
		</div>
	</div>

	<Aside>
		<AsideContent />
	</Aside>
</div>
