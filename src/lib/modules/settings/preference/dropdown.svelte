<script lang="ts">
	interface Props {
		options: string[];
		selected: string;
	}

	let { options, selected = $bindable(options[0]) }: Props = $props();

	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index.js';
</script>

<DropdownMenu.Root>
	<div class=" rounded-md border border-stone-200 px-4 py-1">
		<DropdownMenu.Trigger>
			{selected ?? 'opciones'}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<div class="z-10 bg-white">
					{#each options as option}
						<div class="z-10 bg-white text-center hover:bg-stone-100">
							<DropdownMenu.Item
								onSelect={() => {
									selected = option;
								}}
							>
								{option}
							</DropdownMenu.Item>
						</div>
					{/each}
				</div>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</div>
</DropdownMenu.Root>
