<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const { value, options } = $props<{
        value: string;
        options: Array<{ value: string; label: string }>;
    }>();

    let isOpen = $state(false);
    let selectedValue = $derived(value);

    const dispatch = createEventDispatcher<{
        change: string;
    }>();

    function handleSelect(newValue: string) {
        dispatch('change', newValue);
        isOpen = false;
    }

    function toggleOpen() {
        isOpen = !isOpen;
    }
</script>

<div class="relative">
    <button
        type="button"
        class="flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        on:click={toggleOpen}
    >
        <span>{options.find(opt => opt.value === selectedValue)?.label}</span>
        <svg class="h-4 w-4" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    </button>

    {#if isOpen}
        <div class="absolute z-50 mt-1 w-full rounded-md border bg-white p-1 shadow-lg">
            {#each options as option}
                <button
                    class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 data-[selected=true]:bg-slate-100"
                    data-selected={option.value === selectedValue}
                    on:click={() => handleSelect(option.value)}
                >
                    {option.label}
                </button>
            {/each}
        </div>
    {/if}
</div>