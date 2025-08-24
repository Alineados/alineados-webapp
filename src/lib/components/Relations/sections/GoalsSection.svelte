<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import Cube from '$lib/icons/Cube.svelte';
    import { nanoid } from 'nanoid';
    import type { Relation } from '$lib/interfaces/Relations.interface';
    import { createEventDispatcher } from 'svelte';
    import { getContext } from 'svelte';
    import { RelationService } from '$lib/services/relations/relations';
    import { userState } from '$lib/stores';
    import { setRelationSaving, setRelationSaved, setRelationError, updateCurrentRelationData, currentRelationData, debounce } from '$lib/stores/relations/autosave';
    import { dndzone } from 'svelte-dnd-action';
    import { toast } from 'svelte-sonner';

    interface Props {
        relation: Relation;
        isEditing: boolean;
    }

    let { relation, isEditing }: Props = $props();
    const dispatch = createEventDispatcher();

    // Estado local para metas con esta persona
    let items = $state([
        { id: nanoid(), description: '', prominent: false, daily: false }
    ]);
    
    let newlyCreatedItemId = $state('');
    let isOnlyText = $state(true);
    const flipDurationMs = 300;

    // Validation - enable only if title has 1+ char
    const nameText = $derived(($currentRelationData?.full_name || relation.full_name || '').trim());
    const fieldsDisabled = $derived(nameText.length === 0);

    function showNameRequiredToast() {
        toast.error('Primero completa el nombre de la relación para continuar');
    }

    // Efecto para sincronizar con la relación
    $effect(() => {
        if (relation.goals_with_person && relation.goals_with_person.length > 0) {
            const goalItems = relation.goals_with_person.map(goal => {
                // Manejar tanto formato string como objeto
                if (typeof goal === 'string') {
                    return {
                        id: nanoid(),
                        description: goal,
                        prominent: false,
                        daily: false
                    };
                } else {
                    // Formato backend: { text, highlighted }
                    const goalObj = goal as any;
                    return {
                        id: nanoid(),
                        description: goalObj.text || goalObj,
                        prominent: goalObj.highlighted || false,
                        daily: false
                    };
                }
            });
            items = [...goalItems, { id: nanoid(), description: '', prominent: false, daily: false }];
        } else {
            items = [{ id: nanoid(), description: '', prominent: false, daily: false }];
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

    // Special save function for goals with highlighting
    const debouncedSaveGoals = debounce(async (goalsData: Array<{text: string, highlighted: boolean}>) => {
        if (!userState.id || !relation.id) return;
        
        setRelationSaving(true);
        try {
            console.log('🔥 SAVING GOALS WITH HIGHLIGHTING:', goalsData);
            
            // Create a special request for goals with highlighting
            const response = await relationService.saveRelation({ 
                id: relation.id, 
                uid: userState.id, 
                goals_with_person: goalsData 
            } as any);
            
            if (response.data) {
                console.log('🔥 GOALS SAVE RESPONSE:', response.data);
                // Actualizar la relación con la respuesta del backend
                Object.assign(relation, response.data);
                setRelationSaved();
            }
        } catch (e) {
            console.error('❌ Error saving goals:', e);
            setRelationError();
        }
    }, 800);

    // Sync + autosave
    function syncChanges() {
        const itemsWithContent = items.filter(item => item.description.trim() !== '');
        
        // Actualizar localmente - guardar objetos con text y highlighted
        const goalsData = itemsWithContent.map(item => ({
            text: item.description,
            highlighted: item.prominent
        }));
        
        // Para compatibilidad con frontend, seguir usando strings en relation.goals_with_person
        relation.goals_with_person = itemsWithContent.map(item => item.description);
        
        // Autosave - REAL: enviar formato backend con highlighting
        console.log('🔥 GOALS DEBUG - Saving goals data:', goalsData);
        console.log('🔥 GOALS DEBUG - Relation ID:', relation.id);
        
        // Usar una función especial para metas que maneje el highlighting
        debouncedSaveGoals(goalsData);
    }

    function addItem(id: string) {
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
        items = items.map(item => 
            item.id === id ? { ...item, prominent: !item.prominent } : item
        );
        syncChanges();
    }

    function toggleDaily(id: string) {
        items = items.map(item => 
            item.id === id ? { ...item, daily: !item.daily } : item
        );
        syncChanges();
    }

    function handleInput() {
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

    function handleDndConsider(e: CustomEvent) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent) {
        items = e.detail.items;
        syncChanges();
    }

    const hasContent = (item: any) => item.description && item.description.trim() !== '';
    const isEmpty = (item: any) => !item.description || item.description.trim() === '';
</script>

<div class="flex flex-col">
    <div class="flex items-center gap-2">
        <Cube styleTw="size-6 text-alineados-gray-900" />
        <h2 class="text-2xl font-medium text-alineados-gray-900">Metas con esta persona</h2>
    </div>
    
    <div 
        class="mt-5 flex flex-col gap-2 -ml-10"
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
            />
        {/each}
    </div>
</div>