<script lang="ts">
	import Plus from '$lib/icons/Plus.svelte';
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index';
	import { enhance } from '$app/forms';

	import type { ProblemCard } from '$lib/interfaces';
	import { goto } from '$app/navigation';
	import { addProblem, pillarState } from '$lib/stores';
	import type { Response } from '$lib/services/http';

	let formHtml: HTMLFormElement;

	let dataToSend = $state({
		pfid: '', // pillar id
		cid: '', // category id
		pillar_name: '', // pillar name
		pillar_label: '', // pillar label
		category_name: '', // category name
		category_label: '' // category label
	});

	function submitForm(
		pfid: string,
		cid: string,
		pillar_name: string,
		pillar_label: string,
		category_name: string,
		category_label: string
	) {
		dataToSend.pfid = pfid;
		dataToSend.cid = cid;
		dataToSend.pillar_name = pillar_name;
		dataToSend.pillar_label = pillar_label;
		dataToSend.category_name = category_name;
		dataToSend.category_label = category_label;
		formHtml.requestSubmit();
	}

	function navigateToProblem(pid: string, pillar_label: string) {
		// navigate to problem details
		goto(`./problems/edit?pid=${pid}&pillar_name=${pillar_label}`);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="group flex items-center gap-2 rounded-lg bg-[#0F172A] px-5 py-1 text-white transition duration-300 ease-in-out hover:bg-[#1A2642] hover:shadow-lg hover:shadow-[#0F172A]/30"
		aria-label="Nuevo Problema"
	>
		<Plus styleTw="size-4" />
		<p class="text-xs font-medium">Nueva</p>
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
				formData.set('pillar_label', dataToSend.pillar_label);
				formData.set('category_name', dataToSend.category_name);
				formData.set('category_label', dataToSend.category_label);

				return async ({ result, update }) => {
					if (result.status === 200 && result.type === 'success') {
						const {
							data
						}: {
							data: ProblemCard;
						} = result.data as unknown as Response;
						// navigate to new problem
						navigateToProblem(data.id, dataToSend.pillar_name);
						// update stores
						setTimeout(() => {
							addProblem(data, dataToSend.pillar_name);
						}, 600);
					}
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
		>
			<DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{pillarState.health.label}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each pillarState.health.categories as category}
							<DropdownMenu.Item
								onclick={() =>
									submitForm(
										pillarState.health.id,
										category.id,
										pillarState.health.name,
										pillarState.health.label,
										category.name,
										category.label
									)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.label}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{pillarState.relational.label}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each pillarState.relational.categories as category}
							<DropdownMenu.Item
								onclick={() =>
									submitForm(
										pillarState.relational.id,
										category.id,
										pillarState.relational.name,
										pillarState.relational.label,
										category.name,
										category.label
									)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.label}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{pillarState.vocational.label}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each pillarState.vocational.categories as category}
							<DropdownMenu.Item
								onclick={() =>
									submitForm(
										pillarState.vocational.id,
										category.id,
										pillarState.vocational.name,
										pillarState.vocational.label,
										category.name,
										category.label
									)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.label}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
						<span class="font-normal">{pillarState.spiritual.label}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent class="bg-alineados-gray-100">
						{#each pillarState.spiritual.categories as category}
							<DropdownMenu.Item
								onclick={() =>
									submitForm(
										pillarState.spiritual.id,
										category.id,
										pillarState.spiritual.name,
										pillarState.spiritual.label,
										category.name,
										category.label
									)}
								class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
							>
								<span class="font-normal">{category.label}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
