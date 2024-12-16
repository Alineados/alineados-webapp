<script lang="ts">
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index';
	import ThreeDots from '$lib/icons/ElipsisVertical.svelte';
	import Blocked from '$lib/icons/Blocked.svelte';
	import Lock from '$lib/icons/Lock.svelte';
	import { updateSecurityAndActive, problemCard } from '$lib/stores';

	// Function to update
	// 1. active / inactive .....  2. security / non-security
	function handleClick(kind: number) {
		setTimeout(() => {
			updateSecurityAndActive(kind);
		}, 500);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="-ml-1" aria-label="More">
		<ThreeDots styleTw="size-6" />
	</DropdownMenu.Trigger>
	<!-- Content -->
	<DropdownMenu.Content class="z-50 bg-alineados-gray-100">
		<DropdownMenu.Item
			onclick={() => handleClick(1)}
			class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
		>
			<Blocked class="mt-0.5" />
			<span class="font-normal">
				{#if $problemCard.active}
					Desactivar
				{:else}
					Activar
				{/if}
			</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => handleClick(2)}
			class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
		>
			<Lock class="mt-0.5" />
			<span class="font-normal">
				{#if $problemCard.security}
					Desbloquear
				{:else}
					Bloquear
				{/if}
			</span>
		</DropdownMenu.Item>
		<!--Content group -->
		<!-- <DropdownMenu.Group>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100 	">
					<File class="mt-0.5" />
					<span class="font-normal">Descargar</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent class="bg-alineados-gray-100">
					<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
						<File class="mt-0.5" />
						<span class="font-normal">Descargar xlsx</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
						<File class="mt-0.5" />
						<span class="font-normal">Descargar pdf</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Group> -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
