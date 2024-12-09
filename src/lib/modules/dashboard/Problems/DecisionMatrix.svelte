<script>
	import StarSolid from '$lib/icons/StarSolid.svelte';
</script>

<div class="grid grid-cols-[200px,25px,100px,100px,100px] gap-4 p-4">
	<!-- Header Row -->
	<div></div>
	<div></div>
	<div class="text-center text-lg font-medium text-alineados-gray-900">Plan Smart</div>
	<div class="text-center text-lg font-medium text-alineados-gray-900">Plan Black</div>
	<div class="text-center text-lg font-medium text-alineados-gray-900">Day Pass</div>

	<!-- Subheader Row -->
	<div class="-mb-3"></div>
	<div class="-mb-3"></div>
	<div class="-mb-3">
		<span class="text-xs font-medium text-alineados-gray-300">Alternativas &rarr;</span>
	</div>
	<div class="-mb-3"></div>
	<div class="-mb-3"></div>

	<!-- Row 1 -->
	<div class="flex items-center justify-start">
		<div class="flex w-2/3 flex-col justify-start gap-2">
			<span class="text-base">Conveniencia de contrato</span>
			<span
				class=" w-1/3 rounded-md border border-alineados-gray-200 bg-[#F7F7F7] text-center text-sm font-medium text-[#7C8089]"
			>
				33%
			</span>
		</div>
		<div class="flex w-1/3 flex-col items-center gap-1">
			<input class="w-full text-center text-3xl text-alineados-green-900 outline-none" value="#" />
			<span class="text-xs font-medium text-alineados-green-900">unidades</span>
		</div>
	</div>
	<div class="relative -mr-3 flex justify-end overflow-hidden">
		<span
			class="absolute origin-top-left translate-y-full -rotate-90 transform whitespace-nowrap text-xs font-medium tracking-wider text-alineados-gray-300"
			style="left: 50%; bottom: 0.5rem;"
		>
			&larr; Objettivos
		</span>
	</div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-green-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-green-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-green-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>

	<!-- Row 2 -->
	<div class="flex items-center justify-start">
		<div class="flex w-2/3 flex-col justify-start gap-2">
			<span class="text-base">Conveniencia de contrato</span>
			<span
				class=" w-1/3 rounded-md border border-alineados-gray-200 bg-[#F7F7F7] text-center text-sm font-medium text-[#7C8089]"
			>
				33%
			</span>
		</div>
		<div class="flex w-1/3 flex-col items-center gap-1">
			<input class="w-full text-center text-3xl text-alineados-orange-900 outline-none" value="#" />
			<span class="text-xs font-medium text-alineados-orange-900">unidades</span>
		</div>
	</div>
	<div></div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-orange-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-orange-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-orange-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>

	<!-- Row 3 -->
	<div class="flex items-center justify-start">
		<div class="flex w-2/3 flex-col justify-start gap-2">
			<span class="text-base">Conveniencia de contrato</span>
			<span
				class=" w-1/3 rounded-md border border-alineados-gray-200 bg-[#F7F7F7] text-center text-sm font-medium text-[#7C8089]"
			>
				33%
			</span>
		</div>
		<div class="flex w-1/3 flex-col items-center gap-1">
			<input class="w-full text-center text-3xl text-alineados-blue-800 outline-none" value="#" />
			<span class="text-xs font-medium text-alineados-blue-800">unidades</span>
		</div>
	</div>

	<div></div>

	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-blue-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-blue-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>
	<div
		class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
	>
		<input
			class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal text-alineados-blue-900 outline-none"
			value="165"
		/>
		<div class="flex h-full w-full items-center justify-center">
			<input
				class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
				value="2"
			/>
		</div>
	</div>

	<!-- Footer Row -->
	<div class="col-span-1 mt-1 text-end text-xs font-medium text-alineados-gray-300">Resultado</div>
	<div></div>
	<div class="mt-1 flex items-center justify-center gap-[2px]">
		<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
			7
		</div>
		{#if true}
			<StarSolid styleTw="size-4 text-[#0FC917]" />
		{/if}
	</div>
	<div class="mt-1 flex items-center justify-center gap-[2px]">
		<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
			7
		</div>
		{#if false}
			<StarSolid />
		{/if}
	</div>
	<div class="mt-1 flex items-center justify-center gap-[2px]">
		<div class="flex items-center justify-center text-xl font-medium text-alineados-gray-700">
			7
		</div>
		{#if false}
			<StarSolid />
		{/if}
	</div>
</div>
