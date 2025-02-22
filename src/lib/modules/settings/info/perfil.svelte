<script lang="ts">
	import Avatar from '$lib/icons/Avatar.svelte';
	import Info from '$lib/icons/Info.svelte';
	import { infoState } from '$lib/stores';
</script>

<div class="flex flex-row items-center gap-3 text-stone-500">
	<!-- avatar -->
	<div class="jusfity-center flex h-fit w-fit items-center rounded-full bg-stone-100 p-3">
		<Avatar style="size-8" />
	</div>

	<div class="flex flex-col gap-1">
		<!-- label -->
		<div class="flex items-center gap-1 text-stone-400">
			<label class="text-base" for="name">Nombre de usuario </label>
			<Info style="size-5" />
		</div>
		<!-- input -->
		<input
			name="name"
			bind:value={infoState.name}
			type="text"
			class="w-full rounded-md border border-stone-200 text-base"
		/>
	</div>
</div>
