<script lang="ts">
    import { PhotosService } from '$lib/services/photos/photos';
    import { getContext } from 'svelte';
    import { userState } from '$lib/stores';
    import Plus from '$lib/icons/Plus.svelte';
    import TrashCan from '$lib/icons/TrashCan.svelte';
    import type { Relation } from '$lib/interfaces/Relations.interface';
    import { RelationService } from '$lib/services/relations/relations';
    import { toast } from 'svelte-sonner';
    import { currentRelationData } from '$lib/stores/relations/autosave';

    let { relation }: { relation: Relation } = $props();
    
    // Validation logic - usar global store
    const nameText = $derived(($currentRelationData?.full_name || relation.full_name || '').trim());
    const fieldsDisabled = $derived(nameText.length === 0);

    const token = getContext<string>('token') || '';
    const photosService = PhotosService.getInstance(token);
    const relationService = RelationService.getInstance(token);

    let uploading = $state(false);
    let fileInput: HTMLInputElement;
    let displayUrl = $state('');
    let imageKey = $state(Date.now()); // Force re-render key

    // Renovar signed URL automáticamente cuando se monta el componente o cambia la URL
    $effect(() => {
        const renewUrl = async () => {
            if (relation.photo_url) {
                if (relation.photo_url.includes('X-Goog-Signature')) {
                    try {
                        const renewedUrl = await photosService.getSignedUrl(relation.photo_url);
                        displayUrl = renewedUrl;
                    } catch (e) {
                        console.warn('Could not renew signed URL:', e);
                        displayUrl = relation.photo_url; // Usar URL original como fallback
                    }
                } else {
                    displayUrl = relation.photo_url;
                }
                // Update key to force re-render
                imageKey = Date.now();
            } else {
                displayUrl = '';
                imageKey = Date.now();
            }
        };
        renewUrl();
    });

    function triggerFileInput() { fileInput?.click(); }

    async function handleUpload(e: Event) {
        const file = (e.currentTarget as HTMLInputElement).files?.[0];
        if (!file || !userState.id) return;
        uploading = true;
        try {
            const url = await photosService.upload(userState.id, file, 'profiles');
            
            console.log('🔥 UPLOAD SUCCESS - URL:', url);
            
            // IMMEDIATE UI UPDATE - NO BACKEND CALL YET
            displayUrl = url;
            imageKey = Date.now();
            
            console.log('🔥 DISPLAY URL SET:', displayUrl);
            
            // Save to backend
            const response = await relationService.saveRelation({ id: relation.id, uid: userState.id, photo_url: url } as any);
            if (response.data) {
                console.log('🔥 BACKEND RESPONSE:', response.data);
                // Update relation but preserve displayUrl
                Object.assign(relation, response.data);
                relation.photo_url = url; // Force this value
                displayUrl = url; // Force this value
                imageKey = Date.now(); // Force re-render again
            }
            
            console.log('🔥 FINAL STATE - relation.photo_url:', relation.photo_url, 'displayUrl:', displayUrl);
            
            toast.success('Imagen subida correctamente');
        } catch (error) {
            console.error('Error uploading image:', error);
            // Revert on error
            relation.photo_url = '';
            displayUrl = '';
            toast.error('Error al subir la imagen');
        } finally {
            uploading = false;
            // Clear the file input for future uploads
            if (fileInput) fileInput.value = '';
        }
    }

    let showDeleteConfirm = $state(false);

    async function confirmRemoveImage() {
        if (!relation.photo_url || !userState.id) return;
        
        // Store original URL for error rollback
        const originalUrl = relation.photo_url;
        
        uploading = true;
        showDeleteConfirm = false; // Hide tooltip
        try {
            // Delete from storage first
            await photosService.delete(userState.id, relation.photo_url);
            
            // Update UI immediately first for better UX
            relation.photo_url = '';
            displayUrl = '';
            imageKey = Date.now(); // Force re-render
            
            // Update relation in backend
            const response = await relationService.saveRelation({ id: relation.id, uid: userState.id, photo_url: '' } as any);
            
            if (response.data) {
                // Merge response but keep photo_url empty
                Object.assign(relation, { ...response.data, photo_url: '' });
            }
            
            // Force final update to ensure UI is correct
            relation.photo_url = '';
            displayUrl = '';
            imageKey = Date.now();
            
            toast.success('Imagen eliminada correctamente');
        } catch (error) {
            console.error('Error deleting image:', error);
            // Revert changes on error
            relation.photo_url = originalUrl;
            displayUrl = originalUrl;
            toast.error('Error al eliminar la imagen');
        } finally {
            uploading = false;
        }
    }
</script>

<div class="relative z-10 h-60 w-full overflow-hidden rounded-lg bg-alineados-gray-50">
    {#if !displayUrl || displayUrl.trim() === ''}
        <!-- Default profile image background -->
        <div class="absolute inset-0 flex items-center justify-center bg-alineados-blue-500">
            <!-- Alineados logo -->
            <img 
                src="/images/logo/VERDE IMAGEN.webp" 
                alt="Alineados Logo" 
                class="w-20 h-20 object-contain opacity-80"
                onerror={(e) => {
                    // Fallback to user icon if logo fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentNode;
                    if (parent) {
                        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svg.setAttribute('class', 'w-24 h-24 text-white');
                        svg.setAttribute('fill', 'currentColor');
                        svg.setAttribute('viewBox', '0 0 24 24');
                        svg.innerHTML = '<path d=\"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\"/>';
                        parent.appendChild(svg);
                    }
                }}
            />
        </div>
        <!-- Upload button overlay -->
        <div class="absolute inset-0 flex items-center justify-center">
            <button 
                onclick={fieldsDisabled ? () => toast.error('Primero debes escribir el nombre de la relación') : triggerFileInput} 
                disabled={uploading || fieldsDisabled} 
                class="flex items-center gap-2 rounded-lg bg-alineados-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-alineados-green-700 shadow-lg {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
            >
                {#if uploading}
                    Subiendo...
                {:else}
                    <Plus styleTw="size-5 text-white" /> {fieldsDisabled ? 'Completa el nombre primero' : 'Subir foto'}
                {/if}
            </button>
        </div>
    {:else}
        {#key imageKey}
            <img src={displayUrl} alt="Foto de perfil" class="absolute inset-0 h-full w-full rounded-lg object-cover p-1 transition-opacity duration-500" />
        {/key}
        <!-- Delete button with confirmation tooltip -->
        <div class="absolute top-2 right-2">
            {#if showDeleteConfirm}
                <!-- Confirmation tooltip with fixed positioning -->
                <div class="fixed z-[9999] bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-2xl min-w-max transform -translate-x-1/2 -translate-y-full"
                     style="top: {showDeleteConfirm ? 'calc(var(--tooltip-top, 0px) - 12px)' : '0px'}; left: var(--tooltip-left, 50%);">
                    <div class="text-center mb-2">¿Eliminar imagen?</div>
                    <div class="flex gap-2 justify-center">
                        <button 
                            onclick={confirmRemoveImage} 
                            class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors"
                            disabled={uploading}
                        >
                            Sí
                        </button>
                        <button 
                            onclick={() => showDeleteConfirm = false} 
                            class="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded transition-colors"
                        >
                            No
                        </button>
                    </div>
                    <!-- Arrow pointing down -->
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
            {/if}
            <button 
                onclick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const top = rect.top + window.scrollY;
                    const left = rect.left + window.scrollX + rect.width / 2;
                    document.documentElement.style.setProperty('--tooltip-top', `${top}px`);
                    document.documentElement.style.setProperty('--tooltip-left', `${left}px`);
                    showDeleteConfirm = true;
                }} 
                class="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-300" 
                aria-label="Eliminar imagen"
            >
                <TrashCan styleTw="size-4 text-white" />
            </button>
        </div>
    {/if}

    <input bind:this={fileInput} class="hidden" type="file" accept="image/*" onchange={handleUpload} />
</div>


