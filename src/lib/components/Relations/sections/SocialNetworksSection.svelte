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

    // Opciones predefinidas para redes sociales
    const socialNetworkOptions = [
        'Instagram',
        'Facebook',
        'X',
        'YouTube',
        'LinkedIn',
        'TikTok',
        'WhatsApp',
        'Telegram',
        'Discord',
        'Snapchat',
        'Pinterest',
        'Reddit'
    ];

    // Estado local para redes sociales
    let items = $state([
        { id: nanoid(), platform: '', handle: '' }
    ]);

    const flipDurationMs = 300;

    // Validation - enable only if title has 1+ char
    const nameText = $derived(($currentRelationData?.full_name || relation.full_name || '').trim());
    const fieldsDisabled = $derived(nameText.length === 0);

    function showNameRequiredToast() {
        toast.error('Primero completa el nombre de la relación para continuar');
    }

    // Efecto para sincronizar con la relación
    $effect(() => {
        if (relation.contact_info.social_networks && relation.contact_info.social_networks.length > 0) {
            const socialItems = relation.contact_info.social_networks.map(social => ({
                id: nanoid(),
                platform: social.platform,
                handle: social.handle
            }));
            items = [...socialItems, { id: nanoid(), platform: '', handle: '' }];
        } else {
            items = [{ id: nanoid(), platform: '', handle: '' }];
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
        const itemsWithContent = items.filter(item => item.platform.trim() !== '' && item.handle.trim() !== '');
        
        relation.contact_info.social_networks = itemsWithContent.map(item => ({
            platform: item.platform,
            handle: item.handle
        }));
        // Autosave
        debouncedSaveRelation({ contact_info: { ...relation.contact_info } });
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
        
        const newItem = { id: nanoid(), platform: '', handle: '' };
        
        // Insert new item right after the clicked item
        const newItems = [...items];
        newItems.splice(index + 1, 0, newItem);
        items = newItems;
        syncChanges();
    }

    function removeItem(id: string) {
        if (items.length === 1 && items[0].platform === '' && items[0].handle === '' && items[0].id === id) {
            return;
        }
        
        items = items.filter(item => item.id !== id);
        
        if (items.length === 0 || (items[items.length - 1].platform !== '' || items[items.length - 1].handle !== '')) {
            items = [...items, { id: nanoid(), platform: '', handle: '' }];
        }
        syncChanges();
    }

    function handleInput() {
        if (items.length > 0) {
            const lastItem = items[items.length - 1];
            if ((lastItem.platform !== '' || lastItem.handle !== '') && lastItem.id === items[items.length - 1].id) {
                addItem(lastItem.id);
            }
            if (items.length > 1) {
                const emptyItems = items.filter(item => item.platform === '' && item.handle === '' && item.id !== items[items.length - 1].id);
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

    function handlePlatformChange(id: string, value: string) {
        items = items.map(item => 
            item.id === id ? { ...item, platform: value } : item
        );
        handleInput();
    }

    function handleHandleChange(id: string, value: string) {
        items = items.map(item => 
            item.id === id ? { ...item, handle: value } : item
        );
        handleInput();
    }

    function copyToClipboard(item: any) {
        const textToCopy = `${item.platform}: ${item.handle}`;
        navigator.clipboard.writeText(textToCopy);
        toast.success('Copiado al portapapeles', {
            duration: 1000
        });
    }

    const hasContent = (item: any) => item.platform.trim() !== '' || item.handle.trim() !== '';

    function handleDndConsider(e: CustomEvent) {
        const reorderedContentItems = e.detail.items;
        const emptyItems = items.filter(item => !hasContent(item));
        items = [...reorderedContentItems, ...emptyItems];
    }

    function handleDndFinalize(e: CustomEvent) {
        const reorderedContentItems = e.detail.items;
        const emptyItems = items.filter(item => !hasContent(item));
        items = [...reorderedContentItems, ...emptyItems];
        syncChanges();
    }


</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Cube styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Redes sociales</h2>
    </div>
    
    <div class="mt-5 flex flex-col gap-2">
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

                    <!-- Platform select -->
                    <div class="flex-1">
                        <input
                            list={`social-platforms-${item.id}`}
                            type="text"
                            value={item.platform}
                            oninput={(e) => handlePlatformChange(item.id, e.currentTarget.value)}
                            onfocus={() => {
                                if (fieldsDisabled) {
                                    showNameRequiredToast();
                                }
                            }}
                            onblur={handleBlur}
                            placeholder="Plataforma..."
                            class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            disabled={!isEditing || fieldsDisabled}
                        />
                        <datalist id={`social-platforms-${item.id}`}>
                            {#each socialNetworkOptions as option}
                                <option value={option}></option>
                            {/each}
                        </datalist>
                    </div>

                    <!-- Handle input -->
                    <div class="flex-1">
                        <input
                            type="text"
                            value={item.handle}
                            oninput={(e) => handleHandleChange(item.id, e.currentTarget.value)}
                            onfocus={() => {
                                if (fieldsDisabled) {
                                    showNameRequiredToast();
                                }
                            }}
                            onblur={handleBlur}
                            placeholder="@usuario"
                            class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                            disabled={!isEditing || fieldsDisabled}
                        />
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
