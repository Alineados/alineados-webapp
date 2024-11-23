<script lang="ts">
	import AccountabilityButton from '$lib/components/AccountabilityButton.svelte';
	import HistoryButton from '$lib/components/HistoryButton.svelte';
	import MoreButton from '$lib/components/MoreButton.svelte';
	import StatusPill from '$lib/components/StatusPill.svelte';
	import Padlock from '$lib/icons/Padlock.svelte';
</script>

<div class="flex flex-col gap-5 pb-6">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		Mis Problemas / Nombre identificativo /<span class="ml-1 text-alineados-orange-900"
			>Rendir Cuentas</span
		>
	</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="gap- flex items-center">
			<p class="text-5xl font-bold text-alineados-gray-900">Nombre identificativo</p>
			<div class="ml-5 flex items-center gap-3">
				<Padlock class="size-5" />
				<StatusPill status="active" />
			</div>
		</div>

		<div class="flex flex-row gap-4 self-start">
			<HistoryButton />
			<AccountabilityButton />
			<MoreButton />
		</div>
	</div>
</div>
