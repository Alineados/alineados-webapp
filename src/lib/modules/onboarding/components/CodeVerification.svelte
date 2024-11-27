<script lang="ts">
	import * as InputOTP from '$lib/shared/ui/input-otp/index';
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';

	export let maxlength: number = 6;
	//export let pattern: string = new RegExp(REGEXP_ONLY_DIGITS_AND_CHARS).source;
</script>

<div class="mt-12">
	<InputOTP.Root {maxlength}>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells as cell}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
</div>
