<script lang="ts">
	interface Props {
		name: string;
		value: string;
		description: string;
	}
	import LockClose from '$lib/icons/LockClose.svelte';
	import LockOpen from '$lib/icons/LockOpen.svelte';

	let { name, value = $bindable() }: Props = $props();

	let open = $state(false);
</script>

<div class="flex w-full flex-row items-center justify-between gap-5 text-stone-500">
	<div class="flex flex-col gap-1">
		<!-- label -->
		<div class="flex w-full items-start gap-1 text-stone-700">
			<label class="text-base font-medium" for="name">{name}</label>
		</div>
		<!-- description -->
		<p>Change your pin code</p>
	</div>
	<!-- description -->
	<div class="flex items-center gap-2">
		{#if open}
			<button onclick={() => (open = !open)}>
				<LockClose style="size-5" />
			</button>
		{:else}
			<button onclick={() => (open = !open)}>
				<LockOpen style="size-5" />
			</button>
		{/if}

		<input
			disabled={open}
			placeholder="PIN"
			{name}
			minlength="3"
			maxlength="5"
			bind:value
			type="password"
			class="flex w-24 items-center justify-center rounded-md border border-stone-200 p-1 text-center text-2xl font-normal text-stone-600 outline-none placeholder:text-base"
		/>
	</div>
</div>
