<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Cube from '$lib/icons/Cube.svelte';
    import { nanoid } from 'nanoid';
    import type { Relation } from '$lib/interfaces/Relations.interface';
    import { createEventDispatcher } from 'svelte';
    import { dndzone, SOURCES, TRIGGERS } from 'svelte-dnd-action';
    import { getContext } from 'svelte';
    import { RelationService } from '$lib/services/relations/relations';
    import { userState } from '$lib/stores';
    import { 
        setRelationSaving, 
        setRelationSaved, 
        setRelationError, 
        updateCurrentRelationData, 
        currentRelationData,
        debounce 
    } from '$lib/stores/relations/autosave';
    import { toast } from 'svelte-sonner';

    interface Props {
        relation: Relation;
        isEditing: boolean;
    }

    let { relation, isEditing }: Props = $props();
    const dispatch = createEventDispatcher();
    
    // Validation logic - enable only if title has 1+ char
    const nameText = $derived(($currentRelationData?.full_name || relation.full_name || '').trim());
    const fieldsDisabled = $derived(nameText.length === 0);
    
    function showNameRequiredToast() {
        if (fieldsDisabled) {
            toast.error('Primero debes escribir el nombre de la relación', {
                description: 'Completa el campo de nombre antes de agregar información profesional'
            });
        }
    }

    // Estado local unificado para profesiones y vocaciones
    let items = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    
    let newlyCreatedItemId = $state('');

    let isOnlyText = $state(true);
    const flipDurationMs = 300;

    // Efecto para sincronizar con la relación
    $effect(() => {
        const allItems = [];
        
        // Agregar profesiones
        if (relation.profession && relation.profession.length > 0) {
            allItems.push(...relation.profession.map(prof => ({
                id: nanoid(),
                description: prof,
                prominent: false,
                daily: false
            })));
        }

        // Agregar vocaciones
        if (relation.vocation && relation.vocation.length > 0) {
            allItems.push(...relation.vocation.map(voc => ({
                id: nanoid(),
                description: voc,
                prominent: false,
                daily: false
            })));
        }

        // Si no hay items, crear uno vacío
        if (allItems.length === 0) {
            items = [{ id: nanoid(), description: '', prominent: false, daily: false }];
        } else {
            // Asegurar que siempre haya un item vacío al final
            items = [...allItems, { id: nanoid(), description: '', prominent: false, daily: false }];
        }
    });

    // Autosave helper
    const token = getContext<string>('token');
    const relationService = RelationService.getInstance(token || '');
    const debouncedSaveRelation = debounce(async (updates: any) => {
        if (!userState.id) return;
        if (!relation.id) updates.uid = userState.id;
        setRelationSaving(true);
        try {
            const payload = {
                ...(relation.id && { id: relation.id }),
                uid: userState.id,
                ...updates,
            };
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

    // Función para sincronizar cambios con la relación y guardar
    function syncChanges() {
        const itemsWithContent = items.filter(item => item.description.trim() !== '');
        
        // Actualizar localmente
        relation.profession = itemsWithContent.map(item => item.description);
        relation.vocation = []; // Mantenemos todo como profesiones por simplicidad
        
        // Autosave
        debouncedSaveRelation({
            profession: relation.profession,
            vocation: relation.vocation,
        });
    }

    function addItem(id: string) {
        // Check validation first
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        
        const index = items.findIndex(item => item.id === id);
        const currentItem = items[index];
        
        // Don't add if the current item is empty
        if (!currentItem.description || currentItem.description.trim() === '') {
            return;
        }
        
        const newItem = { id: nanoid(), description: '', prominent: false, daily: false };
        
        // Insert new item right after the clicked item
        const newItems = [...items];
        newItems.splice(index + 1, 0, newItem);
        items = newItems;
        
        // Mark this item for focusing
        newlyCreatedItemId = newItem.id;
        // Reset after a short delay to avoid re-focusing on re-renders
        setTimeout(() => newlyCreatedItemId = '', 100);
        
        syncChanges();
    }

    function removeItem(id: string) {
        // No eliminar si es el último elemento vacío
        if (items.length === 1 && items[0].description === '' && items[0].id === id) {
            return;
        }
        
        // Eliminar el item
        items = items.filter(item => item.id !== id);
        
        // Asegurar que siempre haya al menos un elemento vacío al final
        if (items.length === 0 || items[items.length - 1].description !== '') {
            items = [...items, { id: nanoid(), description: '', prominent: false, daily: false }];
        }
        syncChanges();
    }

    function toggleProminent(id: string) {
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        items = items.map(item => 
            item.id === id ? { ...item, prominent: !item.prominent } : item
        );
        syncChanges();
    }

    function toggleDaily(id: string) {
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        items = items.map(item => 
            item.id === id ? { ...item, daily: !item.daily } : item
        );
        syncChanges();
    }

    function handleInput() {
        // Check validation first
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        
        // Ensure there's always an empty item at the end
        if (items.length === 0 || items[items.length - 1].description !== '') {
            const newItem = { id: nanoid(), description: '', prominent: false, daily: false };
            items = [...items, newItem];
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
            return true; // Indicate success
        }
        return false; // Indicate failure
    }

    function moveItemDown(id: string) {
        const index = items.findIndex(item => item.id === id);
        // Don't move the last empty item
        const lastNonEmptyIndex = items.findIndex((item, idx) => idx === items.length - 1 && item.description === '');
        const maxMoveableIndex = lastNonEmptyIndex !== -1 ? lastNonEmptyIndex - 1 : items.length - 1;
        
        if (index < maxMoveableIndex) {
            const newItems = [...items];
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
            items = newItems;
            syncChanges();
            return true; // Indicate success
        }
        return false; // Indicate failure
    }

    function handleDndConsider(e: CustomEvent) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent) {
        items = e.detail.items;
        syncChanges();
    }

    // Simpler approach: filter in template instead of creating derived arrays
    const hasContent = (item: any) => item.description && item.description.trim() !== '';
    const isEmpty = (item: any) => !item.description || item.description.trim() === '';
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Cube styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Profesión y vocación</h2>
    </div>
    
    <div 
        class="mt-5 flex flex-col gap-2 -ml-10" 
        role="list"
        use:dndzone={{
            items: items, 
            flipDurationMs, 
            dropTargetStyle: {}
        }}
        onconsider={handleDndConsider}
        onfinalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <Item
                itemId={item.id}
                deleteItem={() => removeItem(item.id)}
                addItem={() => addItem(item.id)}
                prominentItem={() => toggleProminent(item.id)}
                dailyItem={() => toggleDaily(item.id)}
                onInput={handleInput}
                onBlur={handleBlur}
                onFocus={() => {
                    if (fieldsDisabled) {
                        showNameRequiredToast();
                    }
                }}
                bind:isOnlyText
                bind:isDaily={item.daily}
                bind:isStarred={item.prominent}
                bind:value={item.description}
                animate={false}
                focusOnNew={item.id === newlyCreatedItemId}
                isDisabled={fieldsDisabled}
                showOnlyDelete={true}
            />
        {/each}
    </div>
</div>