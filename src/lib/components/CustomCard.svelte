<script lang="ts">
	import * as Card from '$lib/shared/ui/card/index.js';
</script>

<Card.Root
	class="w-[200px] transform rounded-3xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
>
	<Card.Content>
		<slot name="content"></slot>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<slot name="footer"></slot>
	</Card.Footer>
</Card.Root>
