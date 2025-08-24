<script lang="ts">
    import { goto } from '$app/navigation';
    import BackArrow from '$lib/icons/BackArrow.svelte';
    import Edit from 'lucide-svelte/icons/edit';
    import Trash2 from 'lucide-svelte/icons/trash-2';
    import Star from 'lucide-svelte/icons/star';
    import ElipsisVertical from '$lib/icons/ElipsisVertical.svelte';
    import File from '$lib/icons/File.svelte';
    import type { Relation } from '$lib/interfaces/Relations.interface';
    import { createEventDispatcher } from 'svelte';
    import AutosaveIndicator from '$lib/components/AutosaveIndicator.svelte';
    import { getContext } from 'svelte';
    import { RelationService } from '$lib/services/relations/relations';
    import { 
        setRelationSaving, 
        setRelationSaved, 
        setRelationError,
        updateCurrentRelationData,
        currentRelationData,
        debounce
    } from '$lib/stores/relations/autosave';
    import { userState } from '$lib/stores';
    import { toast } from 'svelte-sonner';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    interface Props {
        relation: Relation;
        isEditing?: boolean;
        isNew?: boolean;
    }

    let { relation, isEditing = false, isNew = false }: Props = $props();
    const dispatch = createEventDispatcher();
    
    // Obtener el token del contexto
    const token = getContext<string>('token');
    const relationService = RelationService.getInstance(token || '');

    // Input para el nombre de la relación
    let nameInput: HTMLInputElement;
    let isFocused = $state(false);
    let displayName = $state('');
    let fullName = $state('');
    let isCreatingRelation = $state(false); // Prevent multiple creation calls
    const MAX_LENGTH = 28;

    // Profile photo upload
    import { PhotosService } from '$lib/services/photos/photos';
    const photosService = PhotosService.getInstance(token || '');
    let uploadingPhoto = $state(false);
    let showMenu = $state(false);
    let showDeleteConfirm = $state(false);
    async function handlePhotoChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file || !userState.id) return;
        uploadingPhoto = true;
        try {
            const url = await photosService.upload(userState.id, file, 'profiles');
            // Use debounced save logic for critical change via immediate save in sidebar equivalent
            setRelationSaving(true);
            const response = await relationService.saveRelation({ id: relation.id, uid: userState.id, photo_url: url } as any);
            if (response.status >= 200 && response.status < 300 && response.data) {
                Object.assign(relation, response.data);
                updateCurrentRelationData(response.data);
                setRelationSaved();
            } else {
                setRelationError();
            }
        } finally {
            uploadingPhoto = false;
        }
    }



    $effect(() => {
        if (relation.full_name?.length > MAX_LENGTH) {
            displayName = relation.full_name.substring(0, MAX_LENGTH) + '...';
        } else {
            displayName = relation.full_name || '';
        }
        fullName = relation.full_name || '';
    });

    // Debounced save function for name
    const debouncedSaveName = debounce(async (fullName: string) => {
        if (!userState.id) {
            console.warn('⚠️ RelationHeader - No user ID');
            return;
        }

        // Allow creation of new relations without ID
        if (!relation.id) {
            console.log('🆕 RelationHeader - Creating new relation with name');
        }

        setRelationSaving(true);

        try {
            const relationData = {
                ...(relation.id && { id: relation.id }),
                uid: userState.id,
                full_name: fullName
            };

            console.log('🔍 RelationHeader - Saving relation name:', relationData);

            const response = await relationService.saveRelation(relationData);

            if (response.status >= 200 && response.status < 300 && response.data) {
                console.log('✅ RelationHeader - Relation name saved successfully');
                // Update local relation data
                Object.assign(relation, response.data);
                updateCurrentRelationData(response.data);
                setRelationSaved();
            } else {
                console.error('❌ RelationHeader - Error saving relation name:', response.error);
                setRelationError();
                toast.error('Error al guardar el nombre');
            }
        } catch (error) {
            console.error('❌ RelationHeader - Error saving relation name:', error);
            setRelationError();
            toast.error('Error al guardar el nombre');
        }
    }, 800); // 800ms debounce for name

    // Create relation immediately for new relations
    async function createRelationNow(name: string) {
        if (!userState.id || isCreatingRelation) return;
        
        isCreatingRelation = true; // Prevent concurrent calls
        console.log('🔥 CREATING RELATION NOW:', name);
        setRelationSaving(true);
        
        try {
            const response = await relationService.saveRelation({ 
                full_name: name,
                uid: userState.id 
            } as any);
            
            if (response.data && response.data.id) {
                console.log('🔥 RELATION CREATED WITH ID:', response.data.id);
                // Update the relation with the new ID
                Object.assign(relation, response.data);
                setRelationSaved();
                
                // Update URL if we're on /new
                if (typeof window !== 'undefined' && window.location.pathname.includes('/new')) {
                    window.history.replaceState({}, '', `/relations/${response.data.id}`);
                }
            }
        } catch (error) {
            console.error('Error creating relation:', error);
            setRelationError();
            toast.error('Error al crear la relación');
        } finally {
            isCreatingRelation = false; // Allow future calls
        }
    }

    function handleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        const newName = input.value;
        
        console.log('🔥 NAME INPUT CHANGED:', newName, 'Length:', newName?.length || 0, 'Relation ID:', relation.id);
        
        // Update locally immediately
        fullName = newName;
        relation.full_name = newName;
        // Broadcast to global store so sections react instantly
        updateCurrentRelationData({ ...relation, full_name: newName });
        
        // Save after debounce if name is not empty
        if (newName.trim() !== '') {
            // Si no hay ID y hay nombre, crear relación inmediatamente para habilitar secciones
            if (!relation.id) {
                console.log('🔥 CREATING RELATION IMMEDIATELY - No ID found');
                createRelationNow(newName);
            } else {
                debouncedSaveName(newName);
            }
        }
    }

    function goBack() {
        goto('/relations');
    }

    function handleEdit() {
        // Always editable: stay on same route
        goto(`/relations/${relation.id}`);
    }

    function handleDelete() {
        showDeleteConfirm = true;
        showMenu = false;
    }

    async function confirmDelete() {
        try {
            if (!relation.id || !userState.id) {
                toast.error('Error: No se puede eliminar la relación');
                return;
            }

            const response = await relationService.deleteRelation(relation.id, userState.id);
            
            if (response.status >= 200 && response.status < 300) {
                toast.success('Relación archivada correctamente');
                // Redirect to relations list after successful deletion
                setTimeout(() => goto('/relations'), 1000);
            } else {
                toast.error('Error al archivar la relación');
            }
        } catch (error) {
            console.error('❌ Error deleting relation:', error);
            toast.error('Error al archivar la relación');
        } finally {
            showDeleteConfirm = false;
        }
    }

    async function handleHighlight() {
        if (!userState.id || !relation.id) return;
        
        const newHighlightedState = !relation.highlighted;
        console.log('Destacar relación:', relation.id, 'State:', newHighlightedState);
        
        try {
            const response = await relationService.saveRelation({ 
                id: relation.id, 
                uid: userState.id, 
                highlighted: newHighlightedState 
            } as any);
            
            if (response.data) {
                Object.assign(relation, response.data);
                toast.success(newHighlightedState ? 'Relación destacada' : 'Relación sin destacar');
            }
        } catch (error) {
            console.error('Error updating highlight:', error);
            toast.error('Error al actualizar el destacado');
        }
        
        showMenu = false;
    }

    function handleExport() {
        // TODO: Implementar exportación
        console.log('Exportar relación:', relation.id);
        showMenu = false;
    }

    // Cleanup function for empty relations
    async function cleanupIfEmpty() {
        if (isNew && relation.id && relationService.isRelationEmpty(relation)) {
            console.log('🧹 RelationHeader - Cleaning up empty relation on page leave');
            await relationService.cleanupEmptyRelation(relation);
        }
    }

    // Handle page leave cleanup
    function handleBeforeUnload() {
        if (isNew && relation.id && relationService.isRelationEmpty(relation)) {
            // Use synchronous cleanup for page unload
            console.log('🧹 RelationHeader - Synchronous cleanup on page unload');
            try {
                // Use async cleanup instead of synchronous for now
                // TODO: Implement proper cleanup on page unload
                console.log('Cleanup needed for relation:', relation.id);
            } catch (error) {
                console.error('Error in synchronous cleanup:', error);
            }
        }
    }

    onMount(() => {
        if (browser) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Also try async cleanup when component is destroyed
            cleanupIfEmpty();
        }
    });
</script>

<div class="flex flex-col gap-2 px-4 md:px-8 lg:px-16 w-full pt-8">
    <p class="flex flex-row text-sm font-medium text-alineados-gray-600">
        <a href="/relations" class="text-alineados-gray-600 hover:underline">Relaciones</a>
        <span class="mx-1">/</span>
        <span class="text-alineados-orange-900" title={fullName}>
            {isNew ? 'Nueva Relación' : (displayName || 'Sin nombre')}
        </span>
    </p>
    
    <div class="flex flex-col items-start gap-5 border-b border-alineados-gray-100 pb-4 lg:flex-row lg:justify-between">
        <div class="flex items-start gap-4">
            <!-- Foto movida al Sidebar -->
            <div class="flex items-center gap-3">
                <input
                    bind:this={nameInput}
                    placeholder={isFocused ? "" : "Nombre de la Relación"}
                    type="text"
                    maxlength={MAX_LENGTH}
                    value={fullName}
                    oninput={handleInput}
                    onfocus={() => { isFocused = true; }}
                    onblur={() => { isFocused = false; }}
                    class="relative bg-transparent text-5xl font-bold text-alineados-gray-900 focus:outline-none rounded-md px-2 {(fullName.trim().length === 0) ? 'border-2 animate-border-cursor-blink' : 'border-none'} focus:border-alineados-orange-500 [caret-width:3px] [caret-color:alineados-orange-900]"
                />
                {#if relation.highlighted}
                    <Star class="size-8 text-yellow-500 fill-current" />
                {/if}
            </div>
        </div>
        
        <div class="flex flex-row justify-start gap-4">
            <!-- Indicador de autosave -->
            <div class="flex items-center">
                <AutosaveIndicator showTimestamp={true} isRelationMode={true} />
            </div>
            
            <div class="flex items-center gap-2">
                <!-- Botón Editar -->
                {#if !isEditing}
                    <button
                        onclick={handleEdit}
                        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alineados-green-500 transition-colors"
                    >
                        <Edit class="h-4 w-4" />
                        Editar
                    </button>
                {/if}
                
                <!-- Botón Regresar -->
                <button 
                    onclick={goBack}
                    class="group flex items-center gap-[6px] rounded-lg bg-alineados-gray-100 px-4 py-3 text-alineados-blue-900 transition duration-300 ease-in-out hover:shadow-lg"
                >
                    <BackArrow class="size-4" />
                    <span class="text-sm font-medium">Regresar</span>
                </button>
                
                <!-- Menú de 3 puntos -->
                <div class="relative">
                    <button 
                        class="rounded-full p-2 hover:bg-alineados-gray-100"
                        onclick={() => showMenu = !showMenu}
                    >
                        <ElipsisVertical styleTw="size-5" />
                    </button>
                    
                    {#if showMenu}
                        <div class="absolute right-0 top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md mt-1">
                            <button
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100"
                                onclick={handleHighlight}
                            >
                                <Star class="mr-2 size-4 {relation.highlighted ? 'text-yellow-500 fill-current' : ''}" />
                                {relation.highlighted ? 'Quitar destacado' : 'Destacar'}
                            </button>
                            
                            <button
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100"
                                onclick={handleDelete}
                            >
                                <Trash2 class="mr-2 size-4" />
                                Eliminar
                            </button>
                            
                            <button
                                class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-alineados-gray-100"
                                onclick={handleExport}
                            >
                                <File class="mr-2 size-4" />
                                Exportar
                            </button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Click outside to close menu -->
{#if showMenu}
    <div 
        class="fixed inset-0 z-40" 
        onclick={() => showMenu = false}
        onkeydown={(e) => e.key === 'Escape' && (showMenu = false)}
        role="button"
        tabindex="-1"
        aria-label="Cerrar menú"
    ></div>
{/if}

<!-- Delete confirmation modal -->
{#if showDeleteConfirm}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-gray-900">¿Eliminar relación?</h3>
                <p class="text-sm text-gray-600 mt-2">
                    Esta acción archivará la relación "<strong>{relation.full_name || 'Sin nombre'}</strong>". 
                    Podrás restaurarla más tarde si es necesario.
                </p>
            </div>
            
            <div class="flex gap-3 justify-end">
                <button 
                    onclick={() => showDeleteConfirm = false}
                    class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onclick={confirmDelete}
                    class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                    Archivar relación
                </button>
            </div>
        </div>
    </div>
{/if}
