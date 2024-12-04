<script lang="ts">
	import { PinInput as InputOTPPrimitive } from 'bits-ui';
	import type { ComponentProps } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		cell,
		class: className,
		...restProps
	}: ComponentProps<typeof InputOTPPrimitive.Cell> = $props();

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.value.length > 1) {
			input.value = input.value.slice(0, 1); // Limita la entrada a un solo carácter
		}
	}
</script>

<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	class={cn(
		'relative flex h-12 w-12 items-center justify-center border border-gray-300 text-lg font-semibold text-gray-700 transition-all duration-200 ease-in-out first:rounded-l-md last:rounded-r-md focus-within:ring-2 focus-within:ring-green-500',
		cell.isActive && 'z-10 ring-2 ring-green-500 ring-offset-2',
		className
	)}
	{...restProps}
	oninput={handleInput}
>
	{cell.char}
	{#if cell.hasFakeCaret}
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<div class="h-6 w-px animate-caret-blink bg-blue-500"></div>
		</div>
	{/if}
</InputOTPPrimitive.Cell>
