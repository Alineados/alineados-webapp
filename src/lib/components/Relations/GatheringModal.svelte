<script lang="ts">
    import { createEventDispatcher, getContext } from 'svelte';
    import type { RelationListItem } from '$lib/interfaces/Relations.interface';
    import { PhotosService } from '$lib/services/photos/photos';
    import { GatheringsService, type CreateGatheringRequest } from '$lib/services/gatherings/gatherings';
    import { userState } from '$lib/stores';
    import Upload from 'lucide-svelte/icons/upload';
    import X from 'lucide-svelte/icons/x';
    import ChevronDown from 'lucide-svelte/icons/chevron-down';

    let { open = $bindable(false), relations = [] }: { open?: boolean; relations?: RelationListItem[] } = $props();

    const dispatch = createEventDispatcher();
    const token = getContext<string>('token') || '';
    const photosService = PhotosService.getInstance(token);
    const gatheringsService = GatheringsService.getInstance(token);

    let relationId = $state('');
    let date = $state(new Date().toISOString().slice(0,16)); // yyyy-MM-ddTHH:mm (local)
    let notes = $state('');
    let location = $state('');
    let photoFile = $state<File | null>(null);
    let isSubmitting = $state(false);
    let isDragOver = $state(false);
    let fileInput = $state<HTMLInputElement>();

    function close() { open = false; dispatch('close'); }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragOver = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        isDragOver = false;
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragOver = false;
        const files = e.dataTransfer?.files;
        if (files && files[0] && files[0].type.startsWith('image/')) {
            photoFile = files[0];
        }
    }

    function triggerFileInput() {
        fileInput?.click();
    }

    async function handleSubmit() {
        if (!userState.id || !relationId) return;
        isSubmitting = true;
        try {
            let photoUrl: string | undefined;
            if (photoFile) {
                photoUrl = await photosService.upload(userState.id, photoFile, 'gatherings');
            }
            const payload: CreateGatheringRequest = {
                uid: userState.id,
                relation_id: relationId,
                date: new Date(date).toISOString(),
                notes: notes || undefined,
                location: location || undefined,
                ...(photoUrl && { photo_url: photoUrl }), // Solo incluir si existe
            };
            const res = await gatheringsService.create(payload);
            if (res.status >= 200 && res.status < 300) {
                dispatch('created', res.data);
                close();
            }
        } finally {
            isSubmitting = false;
        }
    }
</script>

{#if open}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-alineados-gray-900">Registrar Encuentro</h3>
            <button onclick={close} class="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X class="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
                <!-- Relación Select -->
                <div>
                    <label for="relation-select" class="block text-sm font-semibold text-gray-700 mb-2">Relación</label>
                    <div class="relative">
                        <select 
                            id="relation-select"
                            bind:value={relationId} 
                            class="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:border-alineados-green-500 focus:outline-none focus:ring-4 focus:ring-alineados-green-100 transition-all"
                        >
                            <option value="">Selecciona una relación</option>
                            {#each relations as r}
                                <option value={r.id}>{r.full_name}</option>
                            {/each}
                        </select>
                        <ChevronDown class="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <!-- Fecha y Hora -->
                <div>
                    <label for="date-input" class="block text-sm font-semibold text-gray-700 mb-2">Fecha y hora</label>
                    <input 
                        id="date-input"
                        type="datetime-local" 
                        bind:value={date} 
                        class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 focus:border-alineados-green-500 focus:outline-none focus:ring-4 focus:ring-alineados-green-100 transition-all"
                    />
                </div>

                <!-- Lugar -->
                <div>
                    <label for="location-input" class="block text-sm font-semibold text-gray-700 mb-2">Lugar</label>
                    <input 
                        id="location-input"
                        type="text" 
                        bind:value={location} 
                        placeholder="Dónde fue el encuentro"
                        class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 focus:border-alineados-green-500 focus:outline-none focus:ring-4 focus:ring-alineados-green-100 transition-all"
                    />
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
                <!-- Notas -->
                <div>
                    <label for="notes-input" class="block text-sm font-semibold text-gray-700 mb-2">Notas</label>
                    <textarea 
                        id="notes-input"
                        bind:value={notes} 
                        rows="4" 
                        placeholder="Describe qué pasó en el encuentro..."
                        class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 focus:border-alineados-green-500 focus:outline-none focus:ring-4 focus:ring-alineados-green-100 transition-all resize-none"
                    ></textarea>
                </div>

                <!-- Drag & Drop Photo -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Foto del encuentro</label>
                    <div 
                        role="button"
                        tabindex="0"
                        class="relative rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-alineados-green-400 transition-colors {
                            isDragOver ? 'border-alineados-green-500 bg-alineados-green-50' : ''
                        } {
                            photoFile ? 'border-alineados-green-500 bg-alineados-green-50' : ''
                        }"
                        ondragover={handleDragOver}
                        ondragleave={handleDragLeave}
                        ondrop={handleDrop}
                        onkeydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                triggerFileInput();
                            }
                        }}
                        onclick={triggerFileInput}
                    >
                        {#if photoFile}
                            <div class="space-y-2">
                                <div class="w-12 h-12 mx-auto bg-alineados-green-100 rounded-full flex items-center justify-center">
                                    <Upload class="w-6 h-6 text-alineados-green-600" />
                                </div>
                                <p class="text-sm font-medium text-alineados-green-600">{photoFile.name}</p>
                                <button 
                                    onclick={() => photoFile = null}
                                    class="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        {:else}
                            <div class="space-y-3">
                                <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                    <Upload class="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-700">Arrastra una imagen aquí</p>
                                    <p class="text-xs text-gray-500">o</p>
                                    <button 
                                        onclick={triggerFileInput}
                                        class="mt-1 text-sm font-semibold text-alineados-green-600 hover:text-alineados-green-700 transition-colors"
                                    >
                                        selecciona desde tu dispositivo
                                    </button>
                                </div>
                            </div>
                        {/if}
                        
                        <input 
                            bind:this={fileInput}
                            type="file" 
                            accept="image/*" 
                            class="hidden"
                            onchange={(e) => photoFile = (e.currentTarget.files?.[0] || null)} 
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-8 flex justify-end gap-3">
            <button 
                onclick={close}
                class="px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
                Cancelar
            </button>
            <button 
                onclick={handleSubmit}
                disabled={!relationId || isSubmitting}
                class="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-alineados-green-600 hover:bg-alineados-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
                {isSubmitting ? 'Registrando...' : 'Registrar Encuentro'}
            </button>
        </div>
    </div>
</div>
{/if}

<style>
/* Minimal */
</style>


