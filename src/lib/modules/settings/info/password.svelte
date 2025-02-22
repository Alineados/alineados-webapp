<script lang="ts">
	interface Props {
		name: string;
		label: string;
		value: string;
	}

	let { name, label, value = $bindable() }: Props = $props();
</script>

<div class="flex flex-col">
	<!-- label -->
	<label class="font-medium text-stone-800" for={name}>{label}</label>
	<!-- value -->
	<input
		type="password"
		placeholder="ingreso un valor"
		{name}
		bind:value
		class="font-normal text-stone-600 outline-none"
	/>
</div>
