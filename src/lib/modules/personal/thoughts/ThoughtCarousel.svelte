<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { thoughtsState } from '$lib/stores';

	let { items = Array<{ id: string; icon?: ComponentType | string; label: string }>, type = '' } =
		$props();

	let selectedId = $state<string | undefined>(undefined);
	let containerRef = $state<HTMLDivElement>();

	function selectItem(id: string) {
		// Toggle selection: if clicking the same item, deselect it
		selectedId = selectedId === id ? undefined : id;
	}

	$effect(() => {
		if (containerRef) {
			const selectedElement = containerRef.querySelector(
				`[data-id="${selectedId}"]`
			) as HTMLElement;
			if (selectedElement) {
				const scrollLeft =
					selectedElement.offsetLeft -
					containerRef.offsetWidth / 2 +
					selectedElement.offsetWidth / 2;

				containerRef.scrollTo({
					left: scrollLeft,
					behavior: 'smooth'
				});
			}
		}
	});

	$effect(() => {
		thoughtsState.filter(type, selectedId);
	});

	let hoveredId = $state<string | undefined>(undefined);

	function handleMouseEnter(id: string) {
		hoveredId = id;
	}

	function handleMouseLeave() {
		hoveredId = undefined;
	}
</script>

<div class="mx-auto flex w-full justify-center px-4 py-4">
	<div
		bind:this={containerRef}
		class="no-scrollbar flex h-40 snap-x snap-mandatory items-center gap-8 overflow-x-auto px-8 py-4"
		role="tablist"
	>
		{#each items as item (item.id)}
			<div class="relative flex h-32 items-center justify-center">
				<button
					data-id={item.id}
					class="group flex flex-col items-center outline-none transition-all duration-300 ease-in-out focus:outline-none active:outline-none {selectedId ===
					item.id
						? 'selected'
						: 'opacity-70 hover:opacity-100'}"
					style="transform-origin: center center;"
					role="tab"
					aria-selected={selectedId === item.id}
					aria-controls="tab-panel-{item.id}"
					onclick={() => selectItem(item.id)}
				>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="flex transform-gpu items-center justify-center rounded-full text-2xl transition-all duration-300 ease-in-out {selectedId ===
						item.id
							? 'h-20 w-20 scale-110 bg-green-100 text-3xl'
							: 'h-16 w-16 bg-alineados-gray-50 group-hover:h-20 group-hover:w-20 group-hover:scale-110 group-hover:bg-green-100 group-hover:text-3xl'}"
						onmouseenter={() => handleMouseEnter(item.id)}
						onmouseleave={handleMouseLeave}
					>
						<item.icon
							width={24}
							height={24}
							stroke={selectedId === item.id || hoveredId === item.id ? '#166534' : '#515151'}
							class="transition-colors duration-300"
						/>
					</div>
					<span
						class="absolute text-sm font-medium transition-all duration-300 ease-in-out {selectedId ===
						item.id
							? '-bottom-6 text-alineados-green-900 opacity-100'
							: '-bottom-1 opacity-0 group-hover:text-alineados-green-900 group-hover:opacity-100'}"
					>
						{item.label}
					</span>
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.selected {
		transform: scale(1.3);
		transition: transform 0.3s ease-in-out;
	}
</style>
