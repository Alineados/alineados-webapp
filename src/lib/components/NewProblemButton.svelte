<script lang="ts">
	import Plus from '$lib/icons/Plus.svelte';
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index';
	import { enhance } from '$app/forms';
	import { Pillars } from '$lib/interfaces/data';
	import type { ProblemCard } from '$lib/interfaces';
	import { addProblem } from '$lib/stores';

	let formHtml: HTMLFormElement;

	let dataToSend = $state({
		pfid: '',
		cid: '',
		pillar_name: '',
		category_name: ''
	});
	function submitForm(id1: string, id2: string, name1: string, name2: string) {
		dataToSend.pfid = id1;
		dataToSend.cid = id2;
		dataToSend.pillar_name = name1;
		dataToSend.category_name = name2;

		formHtml.requestSubmit();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="group flex items-center gap-2 rounded-lg bg-[#0F172A] px-5 py-2 text-white transition duration-300 ease-in-out hover:bg-[#1A2642] hover:shadow-lg hover:shadow-[#0F172A]/30"
		aria-label="Nuevo Problema"
	>
		<Plus styleTw="size-4" />
		<p class="text-xs font-medium">Nuevo</p>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="bg-alineados-gray-100">
		<form
			method="POST"
			action="?/new"
			bind:this={formHtml}
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				// set data
				formData.set('pfid', dataToSend.pfid);
				formData.set('cid', dataToSend.cid);
				formData.set('pillar_name', dataToSend.pillar_name);
				formData.set('category_name', dataToSend.category_name);

				return async ({ result, update }) => {
					// `result` is an `ActionResult` object
					console.log(result);
					if (result.status === 200) {
						const { data }: { data: ProblemCard } = result.data;
						// update stores
						addProblem(data, Pillars);
					}
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
		>
			<DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{Pillars.health.name}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each Pillars.health.categories as category}
							<DropdownMenu.Item
								onclick={() =>
									submitForm(Pillars.health.id, category.id, Pillars.health.name, category.name)}
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
								onclick={() =>
									submitForm(
										Pillars.relational.id,
										category.id,
										Pillars.relational.name,
										category.name
									)}
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
								onclick={() =>
									submitForm(
										Pillars.vocational.id,
										category.id,
										Pillars.vocational.name,
										category.name
									)}
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
								onclick={() =>
									submitForm(
										Pillars.spiritual.id,
										category.id,
										Pillars.spiritual.name,
										category.name
									)}
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
