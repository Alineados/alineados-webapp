<script lang="ts">
	interface Props {
		options: string[];
		name: string;
		selected: string;
	}

	import Dropdown from './dropdown.svelte';

	let { name, options, selected = $bindable() }: Props = $props();
</script>

<div class="flex w-full flex-row items-center justify-between gap-5 text-stone-500">
	<div class="flex flex-col gap-1">
		<!-- label -->
		<div class="flex items-center gap-1 text-stone-800">
			<label class="text-base font-medium" for="name">{name}</label>
		</div>
		<!-- description -->
		<p>Receive notifications for new messages</p>
	</div>
	<Dropdown {options} bind:selected />
</div>
