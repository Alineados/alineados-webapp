<script lang="ts">
	import type { MatrixRow } from '$lib/interfaces';
	import  { problemInfo } from '$lib/stores';


	let {
		color = 'alineados-blue-900',
    row = $bindable(),
    index = 0
	}: {
		color?: string;
    row?: MatrixRow;
    index?: number;
	} = $props();
</script>

<div class="flex items-center justify-start">
	<div class="flex w-2/3 flex-col justify-start gap-2">
		<span class="text-base"> 
      {$problemInfo.objectives.find((o) => o.id === row?.objective)?.description || `Objetivo ${index+1}`}  
    </span>
		<span
			class=" w-1/3 rounded-md border border-alineados-gray-200 bg-[#F7F7F7] text-center text-sm font-medium text-[#7C8089]"
		>
			33%
		</span>
	</div>

	<div class="flex w-1/3 flex-col items-center gap-1">
		<input class="w-full text-center text-3xl outline-none {color}" value="#" />
		<span class="text-xs font-medium {color}">unidades</span>
	</div>
</div>
