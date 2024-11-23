<script lang="ts">
	import Plus from '$lib/icons/Plus.svelte';
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index.js';
	import { enhance } from '$app/forms';
	import { Pillars } from '$lib/interfaces/data';

	// let {
	// 	handleSelectedPillar
	// }: {
	// 	handleSelectedPillar: (item: PillarItems) => void;
	// } = $props();

	let formHtml: HTMLFormElement;

	let pillar_id = $state('');
	let category_id = $state('');

	function submitForm(id_pillar: string, id_category: string) {
		pillar_id = id_pillar;
		category_id = id_category;
		formHtml.requestSubmit();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="group flex  items-center gap-[6px] rounded-lg bg-alineados-blue-900 px-4 py-[10px] text-white transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:bg-[#1A2642] hover:shadow-lg hover:shadow-[#0F172A]/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
		aria-label="Nuevo"
	>
		<Plus width={13} height={13} />
		<p class="text-xs font-medium">Nuevo</p>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="bg-alineados-gray-100">
		<form
			method="POST"
			action="?/new"
			bind:this={formHtml}
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
	
				return async ({ result, update }) => {
					// `result` is an `ActionResult` object
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
		>
			<input type="text" class="hidden" name="pillar_id" bind:value={pillar_id} />
			<input type="text" class="hidden" name="category_id" bind:value={category_id} />
			<DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{Pillars.health.name}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each Pillars.health.categories as category}
							<DropdownMenu.Item
								onclick={() => submitForm(Pillars.health.id, category.id)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.name}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{Pillars.relational.name}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each Pillars.relational.categories as category}
							<DropdownMenu.Item
								onclick={() => submitForm(Pillars.relational.id, category.id)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.name}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{Pillars.vocational.name}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each Pillars.vocational.categories as category}
							<DropdownMenu.Item
								onclick={() => submitForm(Pillars.vocational.id, category.id)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.name}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{Pillars.spiritual.name}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each Pillars.spiritual.categories as category}
							<DropdownMenu.Item
								onclick={() => submitForm(Pillars.spiritual.id, category.id)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.name}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
