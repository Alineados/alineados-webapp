<script lang="ts">
	let {
		color = 'alineados-blue-900',
	}: {
		color?: string;

	} = $props();
</script>

<div
	class="relative flex size-[100px] flex-col items-center justify-center rounded-xl border border-alineados-gray-100 bg-alineados-gray-50 text-3xl font-medium text-[#7C8089]"
>
	<input
		class="absolute left-1 top-1 w-auto border-none bg-transparent text-left text-sm font-normal {color} outline-none"
		value="123"
	/>
	<div class="flex h-full w-full items-center justify-center">
		<input
			class="w-full border-none bg-transparent text-center text-3xl font-medium text-[#7C8089] outline-none"
			value="3"
		/>
	</div>
</div>
