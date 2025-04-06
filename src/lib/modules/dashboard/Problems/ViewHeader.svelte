<script>

	import BackArrow from "$lib/icons/BackArrow.svelte";

</script>
<div class="flex flex-col gap-2 pb-4">
	<p class="flex flex-row p-2 text-sm font-medium text-alineados-gray-600">
		<a href="/personal/problems" class="text-alineados-gray-600 hover:underline"
			>Situaciones por Mejorar</a
		>
		<span class="mx-1">/</span>
		<span class="text-alineados-orange-900">Ver</span>
	</p>
	<div
		class="flex flex-col gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between"
	>
		<div class="gap- flex items-center w-full justify-between">
			<p class="text-4xl font-bold text-alineados-gray-900">Situaciones por Mejorar</p>
			<a
				href="/personal/problems"
				class="focus group flex items-center gap-1 rounded-lg bg-alineados-gray-100 px-5 py-3 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg"
			>
				<BackArrow class="size-4 font-bold text-alineados-blue-900" />
				<p class="text-xs font-medium">Regresar</p>
			</a>
			<!-- <div class="ml-5 flex items-center gap-3"></div> -->
		</div>
		

		<div class="flex flex-row gap-4 self-start">
			
		</div>
	</div>
</div>
