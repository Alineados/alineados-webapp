<script>
	import Star from '$lib/icons/Star.svelte';
</script>

<div class="grid grid-cols-[200px,100px,100px,100px] gap-4 p-4">
	<!-- Header Row -->
	<div></div>
	<div class="text-center text-lg font-medium text-alineados-gray-900">Plan Smart</div>
	<div class="text-center text-lg font-medium text-alineados-gray-900">Plan Black</div>
	<div class="text-center text-lg font-medium text-alineados-gray-900">Day Pass</div>

	<!-- Subheader Row -->
	<div class="-mb-3"></div>
	<div class="-mb-3">
		<span class="text-xs font-medium text-alineados-gray-300">Alternativas &rarr;</span>
	</div>
	<div class="-mb-3"></div>
	<div class="-mb-3"></div>

	<!-- Row 1 -->
	<div class="flex items-center justify-start">
		<div class="flex w-1/2 flex-col justify-start gap-2">
			<span class="text-base">Conveniencia de contrato</span>
			<span
				class=" w-1/3 rounded-md border border-alineados-gray-200 bg-[#F7F7F7] text-center text-sm font-medium text-[#7C8089]"
			>
				33%
			</span>
		</div>
		<div class="flex w-1/2 flex-col items-center gap-1">
			<span class="text-2xl text-gray-400">#</span>
			<span class="text-xs font-medium text-gray-400">unidades</span>
		</div>
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>

	<!-- Row 2 -->
	<div class="flex items-center justify-start">
		<div class="flex w-1/2 flex-col justify-start gap-2">
			<span class="text-base">Conveniencia de contrato</span>
			<span
				class=" w-1/3 rounded-md border border-alineados-gray-200 bg-[#F7F7F7] text-center text-sm font-medium text-[#7C8089]"
			>
				33%
			</span>
		</div>
		<div class="flex w-1/2 flex-col items-center gap-1">
			<span class="text-2xl text-gray-400">#</span>
			<span class="text-xs font-medium text-gray-400">unidades</span>
		</div>
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>

	<!-- Row 3 -->
	<div class="flex items-center justify-start">
		<div class="flex w-1/2 flex-col justify-start gap-2">
			<span class="text-base">Conveniencia de contrato</span>
			<span
				class=" w-1/3 rounded-md border border-alineados-gray-200 bg-[#F7F7F7] text-center text-sm font-medium text-[#7C8089]"
			>
				33%
			</span>
		</div>
		<div class="flex w-1/2 flex-col items-center gap-1">
			<span class="text-2xl text-gray-400">#</span>
			<span class="text-xs font-medium text-gray-400">unidades</span>
		</div>
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>
	<div
		class="flex size-[100px] items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		2
	</div>
	<!-- Footer Row -->
	<div class="col-span-1 mt-1 text-end text-xs font-medium text-alineados-gray-300">Resultado</div>
	<div class="mt-1 flex items-center justify-center gap-[2px]">
		<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
			7
		</div>
		{#if true}
			<Star />
		{/if}
	</div>
	<div class="mt-1 flex items-center justify-center gap-[2px]">
		<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
			7
		</div>
		{#if false}
			<Star />
		{/if}
	</div>
	<div class="mt-1 flex items-center justify-center gap-[2px]">
		<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
			7
		</div>
		{#if false}
			<Star />
		{/if}
	</div>
</div>
