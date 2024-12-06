<script lang="ts">
	let {
		text = $bindable(),
		selected = false,
		pid,
		name 
	}: {
		text: string;
		selected?: boolean;
		pid: string;
		name: string;
	} = $props();

</script>

<a
	href={`./edit?pid=${pid}&pillar_name=${name}`}
	role="button"
	class={`inline-flex items-center rounded-3xl border px-4 py-2 transition-transform duration-300 ease-in-out hover:border-[#57D95D] hover:bg-[#E7FAE8] hover:text-[#075F0B] ${
		selected
			? 'border-[#57D95D] bg-[#E7FAE8] text-[#075F0B]'
			: 'border-[#E1E1E1] text-alineados-gray-800'
	} transition-colors duration-300 ease-in-out`}

>
	<span class="text-base font-medium">{text}</span>
</a>
