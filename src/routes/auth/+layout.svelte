<script lang="ts">
	import Check from '$lib/icons/Check.svelte';
	import { Button } from '$lib/shared/ui/button/index';
</script>

<div
	class="container min-h-screen relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-5 lg:px-0"
>
	<Button
		href="alineados.com"
		variant="ghost"
		class="absolute left-4 top-4 flex flex-row gap-2 md:left-12 md:top-10  "
	>
		<Check styleTw="size-12" />
		<p class="text-2xl font-bold text-black">Alineados</p>
	</Button>

	<slot />
</div>
