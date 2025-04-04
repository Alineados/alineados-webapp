<script lang="ts">
    import Copy from '$lib/icons/Copy.svelte';
    import TrashCan from '$lib/icons/TrashCan.svelte';
    import Star from '$lib/icons/Star.svelte';
    import { toast } from 'svelte-sonner';
    
    export let value: string = '';
    // Remove unused exports
    export let isStarred: boolean = false;
    export let isUnique: boolean = false;
    export let deleteItem: () => void;
    export let prominentItem: () => void;
    
    function handleInput(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        let content = textarea.value.replace(/[¿?]/g, '');
        
        if (content.trim() === '') {
            value = '';
        } else {
            value = `¿${content}?`;
        }
        
        // Adjust height
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        
        // Position cursor
        const cursorPosition = textarea.selectionStart;
        requestAnimationFrame(() => {
            // Adjust cursor position to account for the ¿ character
            const newPosition = content.trim() === '' ? 1 : cursorPosition + 1;
            textarea.setSelectionRange(newPosition, newPosition);
        });
    }

    function copyClipboard() {
        navigator.clipboard.writeText(value);
        toast.success('Copiado al portapapeles', { duration: 1000 });
    }
</script>

<div class="item-container group flex h-auto items-center justify-between" class:pl-8={isUnique}>
    <div class="ml-1 flex w-full items-center gap-3 rounded-lg p-1 focus-within:bg-alineados-gray-100 hover:bg-alineados-gray-50">
        <button
            aria-label="Copy"
            on:click={copyClipboard}
            class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600"
        >
            <Copy styleTw="size-5" />
        </button>

        <textarea
            class="flex-grow resize-none overflow-hidden border-none bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none group-hover:underline"
            bind:value
            placeholder="Agregar problema"
            on:input={handleInput}
            rows="1"
            spellcheck="false"
        ></textarea>
    </div>

    <div class="invisible ml-2 flex w-auto items-center justify-center gap-1 group-focus-within:visible group-hover:visible">
        <button
            on:click={prominentItem}
            class:text-alineados-gray-400={!isStarred}
            class:text-yellow-500={isStarred}
            class:hover:text-yellow-500={true}
            aria-label="Star"
        >
            <Star styleTw="size-4" />
        </button>
        <button
            on:click={deleteItem}
            class="text-alineados-gray-400 hover:text-red-500"
            aria-label="Delete"
        >
            <TrashCan styleTw="size-4" />
        </button>
    </div>
</div>