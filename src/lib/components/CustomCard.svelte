<script lang="ts">
	import * as Card from '$lib/shared/ui/card/index.js';

	export let state: 'default' | 'stable' | 'warning' | 'danger' = 'default';
</script>

<Card.Root
	class={`h-[224px] w-[227px] transform rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
		state === 'stable'
			? 'border-blue-500'
			: state === 'warning'
				? 'border-yellow-500'
				: state === 'danger'
					? 'border-red-500'
					: ''
	}`}
>
	<Card.Content>
		<slot name="content"></slot>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<slot name="footer"></slot>
	</Card.Footer>
</Card.Root>
