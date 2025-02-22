<script lang="ts">
	import Pin from './pin.svelte';
	let pin: string = $state('123');

	import { infoState } from '$lib/stores';
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col gap-3">
		<!-- user information -->
		<h2 class="text-xl text-stone-800">Pin</h2>
		<div class="border-b-100 border"></div>
	</div>

	<div class="flex flex-col gap-6">
		<Pin
			bind:value={infoState.pin}
			name="Código de ingreso a texto específico"
			description="Ultima modificación hace 8 meses"
		/>
	</div>
</div>
