<script lang="ts">
	interface Props {
		options: string[];
	}

	let { options }: Props = $props();

	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index.js';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<!-- <DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading> -->
			<!-- <DropdownMenu.Separator /> -->

			{#each options as option}
				<div class="bg-white">
					<DropdownMenu.Item>{option}</DropdownMenu.Item>
				</div>
			{/each}
			<!-- <DropdownMenu.Item>Profile</DropdownMenu.Item> -->
			<!-- <DropdownMenu.Item>Billing</DropdownMenu.Item> -->
			<!-- <DropdownMenu.Item>Team</DropdownMenu.Item> -->
			<!-- <DropdownMenu.Item>Subscription</DropdownMenu.Item> -->
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
