<script lang="ts">
	import AccountabilityButton from '$lib/components/AccountabilityButton.svelte';
	import ViewButton from '$lib/components/ViewButton.svelte';
	import MoreButton from '$lib/components/MoreButton.svelte';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import Padlock from '$lib/icons/Padlock.svelte';

	let { title = 'Nombre identificativo' } = $props();
</script>

<div class="flex flex-col gap-5 pb-6">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<a href="/dashboard/problems" class="text-alineados-gray-600 hover:underline">Mis Problemas</a>
		<span class="mx-1">/</span>
		<span class="text-alineados-orange-900">{title}</span>
	</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="gap- flex items-center">
			<input
				type="text"
				bind:value={title}
				class="border-none bg-transparent text-5xl font-bold text-alineados-gray-900 focus:outline-none"
			/>
			<div class="ml-5 flex items-center gap-3">
				<Padlock class="size-5" />
				<StatusPill status="active" />
			</div>
		</div>

		<div class="flex flex-row gap-4 self-start">
			<ViewButton />
			<AccountabilityButton />
			<MoreButton />
		</div>
	</div>
</div>
