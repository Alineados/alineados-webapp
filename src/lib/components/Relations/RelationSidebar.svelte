<script lang="ts">
    import type { Relation, Area } from '$lib/interfaces/Relations.interface';
    import ArrowUp from 'lucide-svelte/icons/arrow-up';
    import ArrowDown from 'lucide-svelte/icons/arrow-down';
    import SadFace from '$lib/icons/SadFace.svelte';
    import MedFace from '$lib/icons/MedFace.svelte';
    import HappyFace from '$lib/icons/HappyFace.svelte';
    import User from 'lucide-svelte/icons/user';
    import RelationImagesCarousel from '$lib/components/Relations/RelationImagesCarousel.svelte';
    import Item from '$lib/components/Item.svelte';
    import Copy from '$lib/icons/Copy.svelte';
    import Plus from '$lib/icons/Plus.svelte';
    import Order from '$lib/icons/Order.svelte';
    import TrashCan from '$lib/icons/TrashCan.svelte';
    import { nanoid } from 'nanoid';
    import { Countries } from '$lib/interfaces/countries';
    import { getStateLevel, getStateColor } from '$lib/stores/relations/relations';
    import { dndzone } from 'svelte-dnd-action';
    import { toast } from 'svelte-sonner';
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
    import { PhotosService } from '$lib/services/photos/photos';

    interface Props {
        relation: Relation;
        areas: Area[];
    }

    let { relation, areas }: Props = $props();

    // Obtener el token del contexto
    const token = getContext<string>('token');
    const relationService = RelationService.getInstance(token || '');
    const photosService = PhotosService.getInstance(token || '');
    let uploadingProfile = $state(false);

    // Estados locales para edición
    // For new relations (no ID), start with no status selected (0)
    // For existing relations, use the status from database
    let stateLevel = $state(relation.id ? getStateLevel(relation.status) : 0);
    // For search indicators, use local state for immediate UI updates (optimistic UI)
    // Initialize from relation data with frontend fix for false+false = null
    let iSeekThem = $state(
        relation.i_seek_them === false && relation.they_seek_me === false 
            ? null 
            : relation.i_seek_them
    );
    let theySeekMe = $state(
        relation.i_seek_them === false && relation.they_seek_me === false 
            ? null 
            : relation.they_seek_me
    );
    
    // Transform phone numbers to objects with country code and number
    let phoneItems = $state(
        relation.contact_info?.phone_numbers?.length > 0 
            ? relation.contact_info.phone_numbers.map(phone => {
                // Handle different phone number formats
                if (phone.includes(' ')) {
                    // Format: "+52 1234567890"
                    const parts = phone.split(' ');
                    return {
                        id: nanoid(),
                        countryCode: parts[0] || '+52',
                        number: parts.slice(1).join(' ')
                    };
                } else {
                    // Format: "+521234567890" - need to extract country code
                    const countryCode = Countries.find(c => phone.startsWith(c.code))?.code || '+52';
                    const number = phone.replace(countryCode, '');
                    return {
                        id: nanoid(),
                        countryCode: countryCode,
                        number: number
                    };
                }
            })
            : [{ id: nanoid(), countryCode: '+52', number: '' }]
    );
    
    // Transform emails to objects
    let emailItems = $state(
        relation.contact_info?.emails?.length > 0
            ? relation.contact_info.emails.map(email => ({
                id: nanoid(),
                email: email
            }))
            : [{ id: nanoid(), email: '' }]
    );
    
    const flipDurationMs = 300;

    // Calcular datos derivados
    const areaName = $derived(areas.find((a: Area) => a.id === relation.area_id)?.name || 'Sin área');
    
    // Validation - enable only if title has 1+ char
    const nameText = $derived(($currentRelationData?.full_name || relation.full_name || '').trim());
    const fieldsDisabled = $derived(nameText.length === 0);
    
    function showNameRequiredToast() {
        if (fieldsDisabled) {
            toast.error('Primero debes escribir el nombre de la relación', {
                description: 'Completa el campo de nombre antes de agregar otra información'
            });
        }
    }

    // Notion-like Area picker: select existing or create while typing
    let areaInput = $state('');
    $effect(() => { areaInput = areas.find(a => a.id === relation.area_id)?.name || ''; });

    async function createAreaIfNeeded(name: string): Promise<string | undefined> {
        if (!name || !userState.id) return undefined;
        const res = await fetch(`${relationService['baseUrl']?.replace('/relations','')}/relations/areas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ uid: userState.id, name })
        });
        const data = await res.json();
        if (res.ok && data?.data?.id) {
            areas = [...areas, { id: data.data.id, name: data.data.name, created_at: data.data.created_at, updated_at: data.data.updated_at } as any];
            return data.data.id as string;
        }
        return undefined;
    }

    async function setAreaByName(name: string) {
        const existing = areas.find(a => a.name.toLowerCase() === name.toLowerCase());
        let areaId = existing?.id;
        if (!areaId) {
            areaId = await createAreaIfNeeded(name);
        }
        if (areaId) {
            await saveRelationDataImmediate({ area_id: areaId });
        }
    }
    
    // Mapeo de estado level a string
    function getStatusFromLevel(level: number): string {
        switch (level) {
            case 1: return 'Mala';
            case 2: return 'Regular';
            case 3: return 'Buena';
            default: return '';
        }
    }

    // Función principal de autosave (con debounce)
    const debouncedSaveRelation = debounce(async (updates: any) => {
        if (!userState.id) {
            console.warn('⚠️ RelationSidebar - No user ID');
            return;
        }

        // If no relation ID, this might be a new relation that needs to be created
        if (!relation.id) {
            console.log('🆕 RelationSidebar - Creating new relation');
            updates.uid = userState.id;
        }

        setRelationSaving(true);

        try {
            const relationData = {
                ...(relation.id && { id: relation.id }),
                uid: userState.id,
                ...updates
            };

            console.log('🔍 RelationSidebar - Saving relation data:', relationData);

            const response = await relationService.saveRelation(relationData);

            if (response.status >= 200 && response.status < 300 && response.data) {
                console.log('✅ RelationSidebar - Relation saved successfully');
                
                // Update local relation data
                Object.assign(relation, response.data);
                
                // Update the store
                updateCurrentRelationData(response.data);
                
                // Set success status
                setRelationSaved();
            } else {
                console.error('❌ RelationSidebar - Error saving relation:', response.error);
                setRelationError();
                toast.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('❌ RelationSidebar - Error saving relation:', error);
            setRelationError();
            toast.error('Error al guardar los cambios');
        }
    }, 1000); // 1 second debounce

    // Immediate save function (for important changes)
    async function saveRelationDataImmediate(updates: any) {
        if (!userState.id) {
            console.warn('⚠️ RelationSidebar - No user ID');
            return;
        }

        if (!relation.id) {
            console.log('🆕 RelationSidebar - Creating new relation immediately');
            updates.uid = userState.id;
        }

        setRelationSaving(true);

        try {
            const relationData = {
                ...(relation.id && { id: relation.id }),
                uid: userState.id,
                ...updates
            };

            const response = await relationService.saveRelation(relationData);

            if (response.status >= 200 && response.status < 300 && response.data) {
                Object.assign(relation, response.data);
                updateCurrentRelationData(response.data);
                setRelationSaved();
            } else {
                setRelationError();
                toast.error('Error al guardar los cambios');
            }
        } catch (error) {
            setRelationError();
            toast.error('Error al guardar los cambios');
        }
    }

    // Función para actualizar el estado
    async function setStateLevel(value: number) {
        stateLevel = value;
        // Backend expects number status; send as number
        await saveRelationDataImmediate({ status: value });
    }

    // Funciones para actualizar indicadores de búsqueda (Optimistic UI)
    async function setISeekThem(value: boolean) {
        // Update UI immediately for better UX
        iSeekThem = value;
        relation.i_seek_them = value;
        updateCurrentRelationData({ i_seek_them: value });
        
        // Save to backend (no await to avoid blocking UI)
        saveRelationDataImmediate({ i_seek_them: value }).catch(error => {
            // If backend fails, revert the optimistic update
            console.error('Failed to save i_seek_them:', error);
            iSeekThem = relation.i_seek_them === false && relation.they_seek_me === false ? null : relation.i_seek_them;
        });
    }

    async function setTheySeekMe(value: boolean) {
        // Update UI immediately for better UX
        theySeekMe = value;
        relation.they_seek_me = value;
        updateCurrentRelationData({ they_seek_me: value });
        
        // Save to backend (no await to avoid blocking UI)
        saveRelationDataImmediate({ they_seek_me: value }).catch(error => {
            // If backend fails, revert the optimistic update
            console.error('Failed to save they_seek_me:', error);
            theySeekMe = relation.i_seek_them === false && relation.they_seek_me === false ? null : relation.they_seek_me;
        });
    }

    // Helper functions for arrow colors
    function getArrowColor(value: boolean | null): string {
        if (value === null || value === undefined) return 'text-gray-400';
        return value ? 'text-green-500' : 'text-red-500';
    }

    // Phone functions
    function addPhoneItem(id: string) {
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        
        const index = phoneItems.findIndex(item => item.id === id);
        const currentItem = phoneItems[index];
        
        // Don't add if the current item is empty
        if (!currentItem.number || currentItem.number.trim() === '') {
            return;
        }
        
        const newItem = { id: nanoid(), countryCode: '+52', number: '' };
        const newItems = [...phoneItems];
        newItems.splice(index + 1, 0, newItem);
        phoneItems = newItems;
    }

    function removePhoneItem(id: string) {
        if (phoneItems.length === 1 && phoneItems[0].number === '' && phoneItems[0].id === id) {
            return;
        }
        phoneItems = phoneItems.filter(item => item.id !== id);
        if (phoneItems.length === 0) {
            phoneItems = [{ id: nanoid(), countryCode: '+52', number: '' }];
        }
    }

    function handlePhoneInput() {
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        // Ensure there's always an empty item at the end
        if (phoneItems.length === 0 || phoneItems[phoneItems.length - 1].number !== '') {
            const newItem = { id: nanoid(), countryCode: '+52', number: '' };
            phoneItems = [...phoneItems, newItem];
        }
        
        // Save phone numbers to backend
        savePhoneNumbers();
    }
    
    async function savePhoneNumbers() {
        const phoneNumbers = phoneItems
            .filter(item => item.number && item.number.trim() !== '')
            .map(item => `${item.countryCode}${item.number}`);
            
        debouncedSaveRelation({
            contact_info: {
                ...relation.contact_info,
                phone_numbers: phoneNumbers
            }
        });
    }

    function handlePhoneDndConsider(e: any) {
        phoneItems = e.detail.items;
    }

    function handlePhoneDndFinalize(e: any) {
        phoneItems = e.detail.items;
        savePhoneNumbers(); // Save after reordering
    }

    function copyPhoneToClipboard(item: any) {
        const fullPhone = `${item.countryCode} ${item.number}`;
        navigator.clipboard.writeText(fullPhone);
        toast.success('Teléfono copiado al portapapeles', { duration: 1000 });
    }

    // Email functions  
    function addEmailItem(id: string) {
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        
        const index = emailItems.findIndex(item => item.id === id);
        const currentItem = emailItems[index];
        
        // Don't add if the current item is empty
        if (!currentItem.email || currentItem.email.trim() === '') {
            return;
        }
        
        const newItem = { id: nanoid(), email: '' };
        const newItems = [...emailItems];
        newItems.splice(index + 1, 0, newItem);
        emailItems = newItems;
    }

    function removeEmailItem(id: string) {
        if (emailItems.length === 1 && emailItems[0].email === '' && emailItems[0].id === id) {
            return;
        }
        emailItems = emailItems.filter(item => item.id !== id);
        if (emailItems.length === 0) {
            emailItems = [{ id: nanoid(), email: '' }];
        }
    }

    function handleEmailInput() {
        if (fieldsDisabled) {
            showNameRequiredToast();
            return;
        }
        // Ensure there's always an empty item at the end
        if (emailItems.length === 0 || emailItems[emailItems.length - 1].email !== '') {
            const newItem = { id: nanoid(), email: '' };
            emailItems = [...emailItems, newItem];
        }
        
        // Save emails to backend
        saveEmails();
    }
    
    async function saveEmails() {
        const emails = emailItems
            .filter(item => item.email && item.email.trim() !== '' && validateEmail(item.email))
            .map(item => item.email);
            
        debouncedSaveRelation({
            contact_info: {
                ...relation.contact_info,
                emails: emails
            }
        });
    }

    function handleEmailDndConsider(e: any) {
        emailItems = e.detail.items;
    }

    function handleEmailDndFinalize(e: any) {
        emailItems = e.detail.items;
        saveEmails(); // Save after reordering
    }

    function copyEmailToClipboard(item: any) {
        navigator.clipboard.writeText(item.email);
        toast.success('Email copiado al portapapeles', { duration: 1000 });
    }

    // Validation functions
    function validatePhoneNumber(value: string): boolean {
        const phoneRegex = /^\d{0,}$/;
        return phoneRegex.test(value);
    }

    function validateEmail(value: string): boolean {
        if (value === '') return true; // Allow empty for placeholder
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    // Handle keypress for phone inputs
    function handlePhoneKeyPress(event: KeyboardEvent, itemId: string) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const currentItem = phoneItems.find(item => item.id === itemId);
            if (currentItem && currentItem.number.trim() !== '') {
                addPhoneItem(itemId);
                // Focus the next item
                setTimeout(() => {
                    const nextInput = document.querySelector(`[data-phone-id="${phoneItems[phoneItems.findIndex(item => item.id === itemId) + 1]?.id}"]`) as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                }, 100);
            }
        }
    }

    // Handle keypress for email inputs
    function handleEmailKeyPress(event: KeyboardEvent, itemId: string) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const currentItem = emailItems.find(item => item.id === itemId);
            if (currentItem && currentItem.email.trim() !== '' && validateEmail(currentItem.email)) {
                addEmailItem(itemId);
                // Focus the next item
                setTimeout(() => {
                    const nextInput = document.querySelector(`[data-email-id="${emailItems[emailItems.findIndex(item => item.id === itemId) + 1]?.id}"]`) as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                }, 100);
            }
        }
    }
</script>



<div class="w-80 space-y-8 ml-12">
    <div>
        <h3 class="mb-4 text-lg font-medium">Foto de perfil</h3>
        <RelationImagesCarousel {relation} />
    </div>

    <!-- Contenedor Estado e Indicadores -->
    <div class="rounded-xl border border-gray-200 bg-white py-4 px-6">
        <div class="flex flex-col gap-6">
            
            <!-- Estado -->
            <div>
                <h3 class="mb-3 text-lg font-medium">Estado de la Relación</h3>
                <div class="inline-flex gap-2 px-1 py-1 rounded-lg border-2 border-transparent">
                    <button 
                        class="transition-all duration-200 flex-shrink-0 {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick={() => {
                            if (fieldsDisabled) {
                                showNameRequiredToast();
                                return;
                            }
                            setStateLevel(3);
                        }}
                        disabled={fieldsDisabled}
                    >
                        <div class="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 {
                            stateLevel === 3 
                                ? 'bg-green-500/20 ring-2 ring-green-500/50 scale-110' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }">
                            <HappyFace class="h-8 w-8 {stateLevel === 3 ? 'text-green-600' : 'text-gray-400'}" />
                        </div>
                    </button>
                    <button 
                        class="transition-all duration-200 flex-shrink-0 {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick={() => {
                            if (fieldsDisabled) {
                                showNameRequiredToast();
                                return;
                            }
                            setStateLevel(2);
                        }}
                        disabled={fieldsDisabled}
                    >
                        <div class="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 {
                            stateLevel === 2 
                                ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50 scale-110' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }">
                            <MedFace class="h-8 w-8 {stateLevel === 2 ? 'text-yellow-600' : 'text-gray-400'}" />
                        </div>
                    </button>
                    <button 
                        class="transition-all duration-200 flex-shrink-0 {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick={() => {
                            if (fieldsDisabled) {
                                showNameRequiredToast();
                                return;
                            }
                            setStateLevel(1);
                        }}
                        disabled={fieldsDisabled}
                    >
                        <div class="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 {
                            stateLevel === 1 
                                ? 'bg-red-500/20 ring-2 ring-red-500/50 scale-110' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }">
                            <SadFace class="h-8 w-8 {stateLevel === 1 ? 'text-red-600' : 'text-gray-400'}" />
                        </div>
                    </button>
                </div>
            </div>

            <!-- Indicadores de búsqueda -->
            <div>
                <h3 class="mb-3 text-lg font-medium">Indicadores de Relación</h3>
                <div class="space-y-3">
                    <!-- Yo lo busco -->
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Yo lo busco</span>
                        <div class="flex gap-2">
                            <button 
                                class="px-3 py-1 rounded-full text-sm font-medium transition-all {
                                    iSeekThem === true
                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                                onclick={() => {
                                    if (fieldsDisabled) {
                                        showNameRequiredToast();
                                        return;
                                    }
                                    setISeekThem(true);
                                }}
                                disabled={fieldsDisabled}
                            >
                                Sí
                            </button>
                            <button 
                                class="px-3 py-1 rounded-full text-sm font-medium transition-all {
                                    iSeekThem === false
                                        ? 'bg-red-100 text-red-700 ring-2 ring-red-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                                onclick={() => {
                                    if (fieldsDisabled) {
                                        showNameRequiredToast();
                                        return;
                                    }
                                    setISeekThem(false);
                                }}
                                disabled={fieldsDisabled}
                            >
                                No
                            </button>
                            <ArrowUp class="h-5 w-5 {getArrowColor(iSeekThem)}" />
                        </div>
                    </div>
                    
                    <!-- Él me busca -->
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Él / Ella me busca</span>
                        <div class="flex gap-2">
                            <button 
                                class="px-3 py-1 rounded-full text-sm font-medium transition-all {
                                    theySeekMe === true
                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                                onclick={() => {
                                    if (fieldsDisabled) {
                                        showNameRequiredToast();
                                        return;
                                    }
                                    setTheySeekMe(true);
                                }}
                                disabled={fieldsDisabled}
                            >
                                Sí
                            </button>
                            <button 
                                class="px-3 py-1 rounded-full text-sm font-medium transition-all {
                                    theySeekMe === false
                                        ? 'bg-red-100 text-red-700 ring-2 ring-red-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                                onclick={() => {
                                    if (fieldsDisabled) {
                                        showNameRequiredToast();
                                        return;
                                    }
                                    setTheySeekMe(false);
                                }}
                                disabled={fieldsDisabled}
                            >
                                No
                            </button>
                            <ArrowDown class="h-5 w-5 {getArrowColor(theySeekMe)}" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

                    <!-- Información de contacto -->
                <div class="rounded-xl border border-gray-200 bg-white py-4 px-6">
                    <h3 class="mb-4 text-lg font-medium">Información de Contacto</h3>

        <!-- Selector de Área (Notion-like) -->
        <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Área</h4>
            <div class="item-container group flex h-auto items-center justify-between">
                <div class="flex w-full items-center gap-3 rounded-lg p-1 focus-within:bg-alineados-gray-100 hover:bg-alineados-gray-50">
                    <button class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600" aria-label="Copy" onclick={() => navigator.clipboard.writeText(areaInput)}>
                        <Copy styleTw="size-5" />
                    </button>
                    <input
                        list="areas-list"
                        type="text"
                        value={areaInput}
                        oninput={(e) => {
                            if (fieldsDisabled) {
                                showNameRequiredToast();
                                return;
                            }
                            areaInput = e.currentTarget.value;
                        }}
                        onkeydown={async (e) => {
                            if (fieldsDisabled) {
                                showNameRequiredToast();
                                return;
                            }
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                await setAreaByName(areaInput.trim());
                            }
                        }}
                        onblur={async () => {
                            if (fieldsDisabled) return;
                            if ((areaInput || '').trim().length > 0) {
                                await setAreaByName(areaInput.trim());
                            }
                        }}
                        onfocus={() => {
                            if (fieldsDisabled) {
                                showNameRequiredToast();
                            }
                        }}
                        placeholder={fieldsDisabled ? "Primero escribe el nombre de la relación" : "Selecciona o crea un área"}
                        disabled={fieldsDisabled}
                        class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                    />
                    <datalist id="areas-list">
                        {#each areas as area}
                            <option value={area.name}></option>
                        {/each}
                    </datalist>
                </div>
            </div>
        </div>
        
        <!-- Números de teléfono -->
        <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Números telefónicos</h4>
            <div 
                class="flex flex-col gap-2"
                role="list"
                use:dndzone={{
                    items: phoneItems.filter(item => item.number !== ''),
                    flipDurationMs,
                    dropTargetStyle: {}
                }}
                onconsider={handlePhoneDndConsider}
                onfinalize={handlePhoneDndFinalize}
            >
                {#each phoneItems as item (item.id)}
                    <div class="item-container group flex h-auto items-center justify-between">
                        {#if item.number !== ''}
                            <div class="flex items-center gap-0">
                                <button onclick={() => addPhoneItem(item.id)} class="invisible text-alineados-gray-300 group-hover:visible hover:text-alineados-gray-600 focus:text-alineados-gray-600" aria-label="Plus">
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
                        <!-- {:else} -->
                            <!-- Invisible spacer to maintain alignment when no content -->
                            <!-- <div class="w-4 h-4"></div> -->
                            <!-- <div class="w-4 h-4"></div> -->
                        {/if}

                        <!-- Main content area with Item styling -->
                        <div class="flex w-full items-center gap-3 rounded-lg p-1 focus-within:bg-alineados-gray-100 hover:bg-alineados-gray-50" class:ml-1={true}>
                            <!-- Copy button -->
                            <button
                                aria-label="Copy"
                                onclick={() => copyPhoneToClipboard(item)}
                                class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600"
                            >
                                <Copy styleTw="size-5" />
                            </button>

                            <!-- Country code select with flag -->
                            <div class="flex-none relative">
                                <!-- Display selected value (code only) -->
                                <div class="w-20 bg-transparent text-sm font-medium text-alineados-gray-600 pl-6 pr-2 pointer-events-none {fieldsDisabled ? 'opacity-50' : ''}"
                                     style="background-image: url('{Countries.find(c => c.code === item.countryCode)?.flag || '/images/flags/mx.svg'}'); background-repeat: no-repeat; background-position: 4px center; background-size: 16px 12px;">
                                    {item.countryCode}
                                </div>
                                <!-- Hidden select for functionality -->
                                <select
                                    value={item.countryCode}
                                    onchange={(e) => {
                                        const newItems = phoneItems.map(p => 
                                            p.id === item.id 
                                                ? { ...p, countryCode: e.currentTarget.value }
                                                : p
                                        );
                                        phoneItems = newItems;
                                        savePhoneNumbers();
                                    }}
                                    disabled={fieldsDisabled}
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                >
                                    {#each Countries as country}
                                        <option value={country.code}>
                                            {country.code} {country.label}
                                        </option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Phone number input -->
                            <div class="flex-1">
                                <input
                                    type="tel"
                                    value={item.number}
                                    data-phone-id={item.id}
                                    oninput={(e) => {
                                        if (fieldsDisabled) {
                                            showNameRequiredToast();
                                            return;
                                        }
                                        const value = e.currentTarget.value;
                                        // Validate only numbers
                                        if (validatePhoneNumber(value)) {
                                            const newItems = phoneItems.map(p => 
                                                p.id === item.id 
                                                    ? { ...p, number: value }
                                                    : p
                                            );
                                            phoneItems = newItems;
                                            handlePhoneInput();
                                        } else {
                                            // Revert to previous value
                                            e.currentTarget.value = item.number;
                                        }
                                    }}
                                    onfocus={() => {
                                        if (fieldsDisabled) {
                                            showNameRequiredToast();
                                        }
                                    }}
                                    onkeydown={(e) => handlePhoneKeyPress(e, item.id)}
                                    placeholder="Número de teléfono"
                                    class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                                    disabled={fieldsDisabled}
                                />
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="ml-2 flex w-auto items-center justify-center gap-1 invisible group-focus-within:visible group-hover:visible">
                            <button
                                onclick={() => removePhoneItem(item.id)}
                                class="text-alineados-gray-400 hover:text-red-500"
                                aria-label="Delete"
                            >
                                <TrashCan styleTw="size-4" />
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Correos electrónicos -->
        <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Correos electrónicos</h4>
            <div 
                class="flex flex-col gap-2"
                role="list"
                use:dndzone={{
                    items: emailItems.filter(item => item.email !== ''),
                    flipDurationMs,
                    dropTargetStyle: {}
                }}
                onconsider={handleEmailDndConsider}
                onfinalize={handleEmailDndFinalize}
            >
                {#each emailItems as item (item.id)}
                    <div class="item-container group flex h-auto items-center justify-between">
                        {#if item.email !== ''}
                            <div class="flex items-center gap-0">
                                <button onclick={() => addEmailItem(item.id)} class="invisible text-alineados-gray-300 group-hover:visible hover:text-alineados-gray-600 focus:text-alineados-gray-600" aria-label="Plus">
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
                        {:else}
                            <!-- Invisible spacer to maintain alignment when no content -->
                            <div class="w-4 h-4"></div>
                            <div class="w-4 h-4"></div>
                        {/if}

                        <!-- Main content area with Item styling -->
                        <div class="flex w-full items-center gap-3 rounded-lg p-1 focus-within:bg-alineados-gray-100 hover:bg-alineados-gray-50" class:ml-1={true} class:border-red-200={item.email !== '' && !validateEmail(item.email)}>
                            <!-- Copy button -->
                            <button
                                aria-label="Copy"
                                onclick={() => copyEmailToClipboard(item)}
                                class="text-alineados-gray-300 hover:text-alineados-gray-600 focus:text-alineados-gray-600"
                            >
                                <Copy styleTw="size-5" />
                            </button>

                            <!-- Email input -->
                            <div class="flex-1">
                                <input
                                    type="email"
                                    value={item.email}
                                    data-email-id={item.id}
                                    oninput={(e) => {
                                        if (fieldsDisabled) {
                                            showNameRequiredToast();
                                            return;
                                        }
                                        const value = e.currentTarget.value;
                                        const newItems = emailItems.map(em => 
                                            em.id === item.id 
                                                ? { ...em, email: value }
                                                : em
                                        );
                                        emailItems = newItems;
                                        handleEmailInput();
                                    }}
                                    onfocus={() => {
                                        if (fieldsDisabled) {
                                            showNameRequiredToast();
                                        }
                                    }}
                                    onkeydown={(e) => handleEmailKeyPress(e, item.id)}
                                    placeholder="correo@ejemplo.com"
                                    class="w-full bg-transparent text-sm font-medium text-alineados-gray-600 focus:outline-none border-none resize-none overflow-hidden group-hover:underline {item.email !== '' && !validateEmail(item.email) ? 'text-red-500' : ''} {fieldsDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                                    disabled={fieldsDisabled}
                                />
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="ml-2 flex w-auto items-center justify-center gap-1 invisible group-focus-within:visible group-hover:visible">
                            <button
                                onclick={() => removeEmailItem(item.id)}
                                class="text-alineados-gray-400 hover:text-red-500"
                                aria-label="Delete"
                            >
                                <TrashCan styleTw="size-4" />
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Foto de perfil manejada por RelationImagesCarousel -->
    </div>
</div>
