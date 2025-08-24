<script lang="ts">
    import Copy from '$lib/icons/Copy.svelte';
    import Plus from '$lib/icons/Plus.svelte';
    import Order from '$lib/icons/Order.svelte';
    import TrashCan from '$lib/icons/TrashCan.svelte';
    import Cube from '$lib/icons/Cube.svelte';
    import { nanoid } from 'nanoid';
    import type { Relation } from '$lib/interfaces/Relations.interface';
    import { createEventDispatcher } from 'svelte';
    import { getContext } from 'svelte';
    import { RelationService } from '$lib/services/relations/relations';
    import { userState } from '$lib/stores';
    import { setRelationSaving, setRelationSaved, setRelationError, updateCurrentRelationData, currentRelationData, debounce } from '$lib/stores/relations/autosave';
    import { toast } from 'svelte-sonner';
    import { dndzone } from 'svelte-dnd-action';

    interface Props {
        relation: Relation;
        isEditing: boolean;
    }

    let { relation, isEditing }: Props = $props();
    const dispatch = createEventDispatcher();

    // Opciones predefinidas para fechas importantes
    const dateTypeOptions = [
        'Cumpleaños',
        'Aniversario',
        'Graduación',
        'Boda',
        'Primer encuentro',
        'Día especial',
        'Festividad'
    ];

    // Opciones de repetición
    const repeatOptions = [
        { value: 'none', label: 'No repetir' },
        { value: 'annual', label: 'Anualmente' },
        { value: 'monthly', label: 'Mensualmente' },
        { value: 'weekly', label: 'Semanalmente' }
    ];

    // Estado local para fechas importantes
    let items = $state([
        { id: nanoid(), dateType: '', dateValue: '', repeat: 'none' }
    ]);

    const flipDurationMs = 300;

    // Validation - enable only if title has 1+ char
    const nameText = $derived(($currentRelationData?.full_name || relation.full_name || '').trim());
    const fieldsDisabled = $derived(nameText.length === 0);

    function showNameRequiredToast() {
        toast.error('Primero completa el nombre de la relación para continuar');
    }

    function hasContent(item: any) {
        return item.dateType.trim() !== '' && item.dateValue.trim() !== '';
    }

    // Efecto para sincronizar con la relación
    $effect(() => {
        if (relation.important_dates && relation.important_dates.length > 0) {
            const dateItems = relation.important_dates.map(date => {
                // Convert RFC3339 date to YYYY-MM-DD for HTML date input
                let displayDate = date.date;
                if (date.date && date.date.includes('T')) {
                    displayDate = date.date.split('T')[0];
                }
                
                return {
                    id: nanoid(),
                    dateType: date.label,
                    dateValue: displayDate,
                    repeat: date.repeat || 'none'
                };
            });
            items = [...dateItems, { id: nanoid(), dateType: '', dateValue: '', repeat: 'none' }];
        } else {
            items = [{ id: nanoid(), dateType: '', dateValue: '', repeat: 'none' }];
        }
    });

    const token = getContext<string>('token');
    const relationService = RelationService.getInstance(token || '');
    const debouncedSaveRelation = debounce(async (updates: any) => {
        if (!userState.id) return;
        if (!relation.id) updates.uid = userState.id;
        setRelationSaving(true);
        try {
            const payload = { ...(relation.id && { id: relation.id }), uid: userState.id, ...updates };
            const response = await relationService.saveRelation(payload);
            if (response.status >= 200 && response.status < 300 && response.data) {
                Object.assign(relation, response.data);
                updateCurrentRelationData(response.data);
                setRelationSaved();
            } else {
                setRelationError();
            }
        } catch (e) {
            setRelationError();
        }
    }, 800);

    // Sync + autosave
    function syncChanges() {
        const itemsWithContent = items.filter(item => item.dateType.trim() !== '' && item.dateValue.trim() !== '');
        
        relation.important_dates = itemsWithContent.map(item => {
            // Convert YYYY-MM-DD to RFC3339 format expected by backend
            let formattedDate = item.dateValue;
            if (item.dateValue && !item.dateValue.includes('T')) {
                // If it's a date string (YYYY-MM-DD), convert to RFC3339
                const date = new Date(item.dateValue + 'T00:00:00.000Z');
                formattedDate = date.toISOString();
            }
            
            return {
                label: item.dateType,
                date: formattedDate,
                repeat: item.repeat || 'none'
            };
        });
        // Autosave
        debouncedSaveRelation({ important_dates: relation.important_dates });
    }

    function addItem(id: string) {
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        
        const index = items.findIndex(item => item.id === id);
        const currentItem = items[index];
        
        // Don't add if the current item is empty
        if (!hasContent(currentItem)) {
            return;
        }
        
        const newItem = { id: nanoid(), dateType: '', dateValue: '', repeat: 'none' };
        
        // Insert new item right after the clicked item
        const newItems = [...items];
        newItems.splice(index + 1, 0, newItem);
        items = newItems;
        syncChanges();
    }

    function removeItem(id: string) {
        if (items.length === 1 && items[0].dateType === '' && items[0].dateValue === '' && items[0].id === id) {
            return;
        }
        
        items = items.filter(item => item.id !== id);
        
        if (items.length === 0 || (items[items.length - 1].dateType !== '' || items[items.length - 1].dateValue !== '')) {
            items = [...items, { id: nanoid(), dateType: '', dateValue: '', repeat: 'none' }];
        }
        syncChanges();
    }

    function handleInput() {
        if (items.length > 0) {
            const lastItem = items[items.length - 1];
            if ((lastItem.dateType !== '' || lastItem.dateValue !== '') && lastItem.id === items[items.length - 1].id) {
                addItem(lastItem.id);
            }
            if (items.length > 1) {
                const emptyItems = items.filter(item => item.dateType === '' && item.dateValue === '' && item.id !== items[items.length - 1].id);
                emptyItems.forEach(item => removeItem(item.id));
            }
        }
        syncChanges();
    }

    function handleBlur() {
        syncChanges();
    }

    function moveItemUp(id: string) {
        const index = items.findIndex(item => item.id === id);
        if (index > 0) {
            const newItems = [...items];
            [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
            items = newItems;
            syncChanges();
        }
    }

    function moveItemDown(id: string) {
        const index = items.findIndex(item => item.id === id);
        if (index < items.length - 1 && hasContent(items[index + 1])) {
            const newItems = [...items];
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
            items = newItems;
            syncChanges();
        }
    }

    function handleDateTypeChange(id: string, value: string) {
        items = items.map(item => 
            item.id === id ? { ...item, dateType: value } : item
        );
        handleInput();
    }

    function handleDateValueChange(id: string, value: string) {
        items = items.map(item => 
            item.id === id ? { ...item, dateValue: value } : item
        );
        handleInput();
    }

    function handleRepeatChange(id: string, value: string) {
        items = items.map(item => 
            item.id === id ? { ...item, repeat: value } : item
        );
        handleInput();
    }

    function copyToClipboard(item: any) {
        const textToCopy = `${item.dateType}: ${item.dateValue}`;
        navigator.clipboard.writeText(textToCopy);
        toast.success('Copiado al portapapeles', {
            duration: 1000
        });
    }

    function autoResize(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    function handleDndConsider(e: CustomEvent) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent) {
        items = e.detail.items;
        syncChanges();
    }
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Cube styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Fechas importantes</h2>
    </div>
    
    <div 
        class="mt-5 flex flex-col gap-2"
        use:dndzone={{items: items.filter(hasContent), flipDurationMs, dropTargetStyle: {}}}
        onconsider={handleDndConsider}
        onfinalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <div class="item-container group flex h-auto items-center justify-between">
                <!-- Plus and Order buttons (left side) - solo si NO está vacío -->
                {#if hasContent(item)}
                    <div class="flex items-center gap-0">
                        <button
                            onclick={() => addItem(item.id)}
                            class="invisible text-alineados-gray-300 group-hover:visible hover:text-alineados-gray-600 focus:text-alineados-gray-600"
                            aria-label="Plus"
                            disabled={!isEditing}
                        >
                            <Plus styleTw="size-4" />
                        </button>

                        <div
                            class="invisible text-alineados-gray-300 group-hover:visible hover:text-alineados-gray-600 focus:text-alineados-gray-600 cursor-grab active:cursor-grabbing"
                            role="button"
                            tabindex="0"
                            aria-label="Drag to reorder"
                        >
                            <Order stroke="currentColor" />
                        </div>
                    </div>
                {/if}

                <!-- Main content area with Item styling -->
                <div class="ml-1 flex w-full items-center gap-3 rounded-lg p-1 focus-within:bg-alineados-gray-100 hover:bg-alineados-gray-50">
                    <!-- Copy button -->
                    <button
                        aria-label="Copy"
                        onclick={() => copyToClipboard(item)}
                        class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600"
                    >
                        <Copy styleTw="size-5" />
                    </button>

                    <!-- Date type select -->
                    <div class="flex-1">
                        <input
                            list={`date-types-${item.id}`}
                            type="text"
                            value={item.dateType}
                            oninput={(e) => handleDateTypeChange(item.id, e.currentTarget.value)}
                            onfocus={() => {
                                if (fieldsDisabled) {
                                    showNameRequiredToast();
                                }
                            }}
                            onblur={handleBlur}
                            placeholder="Tipo de fecha..."
                            class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            disabled={!isEditing || fieldsDisabled}
                        />
                        <datalist id={`date-types-${item.id}`}>
                            {#each dateTypeOptions as option}
                                <option value={option}></option>
                            {/each}
                        </datalist>
                    </div>

                    <!-- Date input -->
                    <div class="flex-1">
                        <input
                            type="date"
                            value={item.dateValue}
                            oninput={(e) => handleDateValueChange(item.id, e.currentTarget.value)}
                            onfocus={() => {
                                if (fieldsDisabled) {
                                    showNameRequiredToast();
                                }
                            }}
                            onblur={handleBlur}
                            class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            disabled={!isEditing || fieldsDisabled}
                        />
                    </div>

                    <!-- Repeat select -->
                    <div class="flex-1 relative">
                        <select
                            value={item.repeat}
                            onchange={(e) => handleRepeatChange(item.id, e.currentTarget.value)}
                            onfocus={() => {
                                if (fieldsDisabled) {
                                    showNameRequiredToast();
                                }
                            }}
                            onblur={handleBlur}
                            class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline appearance-none cursor-pointer {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            disabled={!isEditing || fieldsDisabled}
                        >
                            {#each repeatOptions as option}
                                <option value={option.value}>{option.label}</option>
                            {/each}
                        </select>
                        <!-- Custom dropdown arrow -->
                        <div class="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none text-alineados-gray-400">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Delete button (right side) -->
                {#if hasContent(item)}
                    <div class="ml-2 flex w-auto items-center justify-center gap-1 invisible group-focus-within:visible group-hover:visible">
                        <button
                            onclick={() => removeItem(item.id)}
                            class="text-alineados-gray-400 hover:text-red-500"
                            aria-label="Delete"
                            disabled={!isEditing}
                        >
                            <TrashCan styleTw="size-4" />
                        </button>
                    </div>
                {/if}
            </div>
        {/each}
    </div>

</div>



