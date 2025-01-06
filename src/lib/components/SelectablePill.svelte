<script lang="ts">
	let {
		text = $bindable(),
		selected = false,
		isLink = false,
		pid,
		name,
		onInput
	}: {
		text: string;
		selected?: boolean;
		isLink?: boolean;
		pid: string;
		name: string;
		onInput?: (pid: string, name: string) => void;
	} = $props();
</script>

{#if isLink}
	<a
		href={`./edit?pid=${pid}&pillar_name=${name}`}
		role="button"
		class={`inline-flex items-center rounded-3xl border px-2 py-1 transition-transform duration-300 ease-in-out hover:border-[#57D95D] hover:bg-[#E7FAE8] hover:text-[#075F0B] ${
			selected
				? 'border-[#57D95D] bg-[#E7FAE8] text-[#075F0B]'
				: 'border-[#E1E1E1] text-alineados-gray-800'
		} transition-colors duration-300 ease-in-out`}
	>
		<span class="text-xs font-medium">{text}</span>
	</a>
{:else}
	<button
		onclick={() => onInput && onInput(pid, name)}
		type="button"
		class={`inline-flex items-center rounded-3xl border px-2 py-1 transition-transform duration-300 ease-in-out hover:border-[#57D95D] hover:bg-[#E7FAE8] hover:text-[#075F0B] ${
			selected
				? 'border-[#57D95D] bg-[#E7FAE8] text-[#075F0B]'
				: 'border-[#E1E1E1] text-alineados-gray-800'
		} transition-colors duration-300 ease-in-out`}
	>
		<span class="text-xs font-medium">{text}</span>
	</button>
{/if}
