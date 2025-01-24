<script lang="ts">
	let {
		title,
		description,
		isBackButton = false
	}: { title: string; description: string; isBackButton?: boolean } = $props();
</script>

<div class="flex flex-col gap-3">
	{#if isBackButton}
		<a
			href="/auth/login"
			class="mb-4 flex cursor-pointer items-center text-sm font-normal text-black hover:underline"
		>
			Volver
		</a>
	{/if}

	<h1 class="text-2xl font-semibold text-black">
		{title}
	</h1>
	<p class="font-regular text-sm text-alineados-gray-800">
		{description}
	</p>
</div>
