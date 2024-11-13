<script lang="ts">
	import * as InputOTP from '$lib/shared/ui/input-otp/index';
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';

	export let maxlength: number = 6;
	export let pattern: string = new RegExp(REGEXP_ONLY_DIGITS_AND_CHARS).source;
</script>

<div class="mt-12">
	<InputOTP.Root {maxlength} {pattern}>
		{#snippet children({ cells })}
			{#each cells as cell, index (index)}
				<InputOTP.Slot
					class="h-16 w-16 rounded-3xl border-alineados_gray-100 bg-alineados_gray-50 text-3xl font-semibold"
					{cell}
				/>
			{/each}
		{/snippet}
	</InputOTP.Root>
</div>
