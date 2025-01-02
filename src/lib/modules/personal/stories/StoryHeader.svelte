<script lang="ts">
	import NewStoryButton from './NewStoryButton.svelte';
</script>

<div class="flex flex-col gap-2 px-4 md:px-8 lg:px-16">
	<p class="flex flex-row text-sm font-medium text-alineados-gray-600">
		<a href="/personal/stories" class="text-alineados-gray-600 hover:underline">Personal</a>
		<span class="mx-1">/</span>
		<span class="text-alineados-orange-900">Relatos</span>
	</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="gap- flex items-center">
			<p class="text-4xl font-bold text-alineados-gray-900">Relatos</p>
			<div class="ml-5 flex items-center gap-3"></div>
		</div>

		<div class="flex flex-row gap-4 self-start">
			<NewStoryButton />
		</div>
	</div>
</div>
