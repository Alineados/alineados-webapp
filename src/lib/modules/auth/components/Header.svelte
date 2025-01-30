<script lang="ts">
	import { getEndpointByVenv } from '$lib/services/endpoints';

	let {
		title,
		description,
		isBackButton = false
	}: { title: string; description: string; isBackButton?: boolean } = $props();
</script>

<div class="flex flex-col gap-3">
	{#if isBackButton}
		<a
			href={getEndpointByVenv().web}
			class="group mb-4 mt-12 flex cursor-pointer items-center gap-2 text-[15px] font-normal text-gray-800 transition-colors hover:text-gray-600"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform duration-200 group-hover:-translate-x-1"
			>
				<path d="M15 18l-6-6 6-6" />
			</svg>
			Volver al inicio
		</a>
	{/if}

	<h1 class="text-3xl font-medium text-alineados-gray-900">
		{title}
	</h1>
	<p class="font-regular text-sm text-alineados-gray-600">
		{description}
	</p>
</div>
