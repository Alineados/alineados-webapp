<script lang="ts">
	export let status: 'active' | 'inactive';

	let bgColor: string;
	let textColor: string;
	let text: string;

	$: {
		if (status === 'active') {
			bgColor = 'bg-[#DBFFDD]';
			textColor = 'text-[#0FC917]';
			text = 'Activo';
		} else if (status === 'inactive') {
			bgColor = 'bg-[#FFDDDD]';
			textColor = 'text-[#C9170F]';
			text = 'Inactivo';
		}
	}
</script>

<div class={`inline-flex items-center rounded-full px-4 py-2 ${bgColor} ${textColor}`}>
	<span class="text-sm font-semibold">{text}</span>
</div>
