<script lang="ts">
	import FieldInput from './field-input.svelte';
	import Password from './password.svelte';

	import { infoState } from '$lib/stores';
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col gap-3">
		<!-- user information -->
		<h2 class="text-xl text-stone-800">Información de usuario</h2>
		<div class="border-b-100 border"></div>
	</div>

	<div class="flex flex-col gap-6">
		<!-- password -->
		<Password label="Contraseña" bind:value={infoState.password} name="password" />
		{#each infoState.infoFields as field}
			<FieldInput label={field.label} name={field.name} bind:value={field.value} />
		{/each}
	</div>
</div>
