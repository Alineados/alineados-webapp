<script lang="ts">
    import type { Relation, Area, ImportantDate, SocialNetwork } from '$lib/interfaces/Relations.interface';
    import { RelationsService } from '$lib/services/relations';
    import { getStateLevel, getStateColor } from '$lib/stores/relations/relations';
    import { goto } from '$app/navigation';
    
    // Componentes de iconos
    import SadFace from '$lib/icons/SadFace.svelte';
    import MedFace from '$lib/icons/MedFace.svelte';
    import HappyFace from '$lib/icons/HappyFace.svelte';
    import ArrowUp from 'lucide-svelte/icons/arrow-up';
    import ArrowDown from 'lucide-svelte/icons/arrow-down';
    import Plus from 'lucide-svelte/icons/plus';
    import X from 'lucide-svelte/icons/x';
    import Calendar from 'lucide-svelte/icons/calendar';
    import Phone from 'lucide-svelte/icons/phone';
    import Mail from 'lucide-svelte/icons/mail';
    import User from 'lucide-svelte/icons/user';

    // Props
    interface Props {
        relation: Relation;
        areas: Area[];
        uid: string;
        isNew: boolean;
    }
    
    let { relation, areas, uid, isNew }: Props = $props();
    
    // Estados reactivos
    let formData = $state({ ...relation });
    let isSaving = $state(false);
    let lastSaveTime = $state<Date | null>(null);
    let saveTimer: NodeJS.Timeout | null = null;
    
    // Calcular datos derivados
    const stateLevel = $derived(getStateLevel(formData.status));
    const stateColors = $derived(getStateColor(formData.status));
    const areaName = $derived(areas.find((a: any) => a.id === formData.area_id)?.name || 'Seleccionar área');
    
    // Función de autosave
    async function autoSave() {
        if (isSaving) return;
        
        isSaving = true;
        try {
            const result = await RelationsService.upsertRelation({
                id: formData.id || undefined,
                uid: formData.uid,
                full_name: formData.full_name || undefined,
                area_id: formData.area_id || undefined,
                photo_url: formData.photo_url || undefined,
                i_seek_them: formData.i_seek_them,
                they_seek_me: formData.they_seek_me,
                status: formData.status || undefined,
                profession: formData.profession.length > 0 ? formData.profession : undefined,
                vocation: formData.vocation.length > 0 ? formData.vocation : undefined,
                positive_qualities: formData.positive_qualities.length > 0 ? formData.positive_qualities : undefined,
                improvement_qualities: formData.improvement_qualities.length > 0 ? formData.improvement_qualities : undefined,
                goals_with_person: formData.goals_with_person.length > 0 ? formData.goals_with_person : undefined,
                important_dates: formData.important_dates.length > 0 ? formData.important_dates : undefined,
                contact_info: formData.contact_info
            });
            
            // Si es nueva, actualizar el ID
            if (isNew && result.id) {
                formData.id = result.id;
                // Redirigir a la vista de la relación creada
                goto(`/relations/${result.id}`);
            }
            
            lastSaveTime = new Date();
        } catch (error) {
            console.error('Error saving relation:', error);
        } finally {
            isSaving = false;
        }
    }
    
    // Debounce del autosave
    function scheduleAutoSave() {
        if (saveTimer) {
            clearTimeout(saveTimer);
        }
        saveTimer = setTimeout(autoSave, 1000); // Guardar después de 1 segundo de inactividad
    }
    
    // Funciones para manejar arrays
    function addToArray(arrayName: keyof Relation, value: string) {
        if (value.trim()) {
            (formData[arrayName] as string[]).push(value.trim());
            formData = { ...formData };
            scheduleAutoSave();
        }
    }
    
    function removeFromArray(arrayName: keyof Relation, index: number) {
        (formData[arrayName] as any[]).splice(index, 1);
        formData = { ...formData };
        scheduleAutoSave();
    }
    
    // Funciones para fechas importantes
    function addImportantDate() {
        formData.important_dates.push({
            date: new Date().toISOString().split('T')[0],
            label: ''
        });
        formData = { ...formData };
    }
    
    function removeImportantDate(index: number) {
        formData.important_dates.splice(index, 1);
        formData = { ...formData };
        scheduleAutoSave();
    }
    
    // Funciones para redes sociales
    function addSocialNetwork() {
        formData.contact_info.social_networks.push({
            platform: '',
            handle: ''
        });
        formData = { ...formData };
    }
    
    function removeSocialNetwork(index: number) {
        formData.contact_info.social_networks.splice(index, 1);
        formData = { ...formData };
        scheduleAutoSave();
    }
    
    // Handlers de cambio
    function handleFieldChange() {
        scheduleAutoSave();
    }
</script>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header con estado de guardado -->
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-gray-900">
                    {isNew ? 'Nueva Relación' : 'Editar Relación'}
                </h1>
                <div class="flex items-center gap-2 mt-1">
                    {#if isSaving}
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <div class="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full"></div>
                            <span>Guardando...</span>
                        </div>
                    {:else if lastSaveTime}
                        <p class="text-sm text-green-600">
                            ✓ Guardado automáticamente a las {lastSaveTime.toLocaleTimeString()}
                        </p>
                    {:else if !isNew}
                        <p class="text-sm text-gray-500">Los cambios se guardan automáticamente</p>
                    {/if}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Sidebar izquierdo -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                    <!-- Foto de perfil -->
                    <div class="flex flex-col items-center mb-6">
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                            {#if formData.photo_url}
                                <img 
                                    src={formData.photo_url} 
                                    alt={formData.full_name}
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <User class="h-12 w-12 text-gray-400" />
                            {/if}
                        </div>
                        <input
                            type="text"
                            placeholder="URL de la foto"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alineados-green-500"
                            bind:value={formData.photo_url}
                            onchange={handleFieldChange}
                        />
                    </div>

                    <!-- Indicadores de relación -->
                    <div class="space-y-4 mb-6">
                        <!-- Yo lo busco -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Yo lo busco</span>
                            <button
                                onclick={() => { formData.i_seek_them = !formData.i_seek_them; handleFieldChange(); }}
                                class="p-1 rounded-lg hover:bg-gray-100"
                            >
                                <ArrowUp class="h-5 w-5 {formData.i_seek_them ? 'text-alineados-green-500' : 'text-red-500'}" />
                            </button>
                        </div>
                        
                        <!-- Él me busca -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Él me busca</span>
                            <button
                                onclick={() => { formData.they_seek_me = !formData.they_seek_me; handleFieldChange(); }}
                                class="p-1 rounded-lg hover:bg-gray-100"
                            >
                                <ArrowDown class="h-5 w-5 {formData.they_seek_me ? 'text-alineados-green-500' : 'text-red-500'}" />
                            </button>
                        </div>
                        
                        <!-- Estado -->
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Estado</span>
                            <select
                                bind:value={formData.status}
                                onchange={handleFieldChange}
                                class="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-alineados-green-500"
                            >
                                <option value="mal">Mal</option>
                                <option value="normal">Normal</option>
                                <option value="bien">Bien</option>
                            </select>
                        </div>
                    </div>

                    <!-- Área -->
                    <div>
                        <div class="block text-sm font-medium text-gray-700 mb-2">Área</div>
                        <select
                            bind:value={formData.area_id}
                            onchange={handleFieldChange}
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alineados-green-500"
                        >
                            <option value="">Seleccionar área</option>
                            {#each areas as area}
                                <option value={area.id}>{area.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <!-- Contenido principal -->
            <div class="lg:col-span-3 space-y-6">
                <!-- Información básica -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                bind:value={formData.full_name}
                                onchange={handleFieldChange}
                                placeholder="Ingresa el nombre completo"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alineados-green-500"
                            />
                        </div>
                    </div>
                </div>

                <!-- Información profesional -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Información Profesional</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Profesión -->
                        <div>
                            <div class="block text-sm font-medium text-gray-700 mb-2">Profesión</div>
                            <div class="space-y-2">
                                {#each formData.profession as prof, index}
                                    <div class="flex items-center gap-2">
                                        <span class="flex-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{prof}</span>
                                        <button onclick={() => removeFromArray('profession', index)} class="text-red-500 hover:text-red-700">
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                {/each}
                                <input
                                    type="text"
                                    placeholder="Agregar profesión..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    onkeydown={(e) => {
                                        if (e.key === 'Enter') {
                                            addToArray('profession', e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <!-- Vocación -->
                        <div>
                            <div class="block text-sm font-medium text-gray-700 mb-2">Vocación</div>
                            <div class="space-y-2">
                                {#each formData.vocation as voc, index}
                                    <div class="flex items-center gap-2">
                                        <span class="flex-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{voc}</span>
                                        <button onclick={() => removeFromArray('vocation', index)} class="text-red-500 hover:text-red-700">
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                {/each}
                                <input
                                    type="text"
                                    placeholder="Agregar vocación..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    onkeydown={(e) => {
                                        if (e.key === 'Enter') {
                                            addToArray('vocation', e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cualidades -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Cualidades</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Cualidades positivas -->
                        <div>
                            <div class="block text-sm font-medium text-gray-700 mb-2">Cualidades Positivas</div>
                            <div class="space-y-2">
                                {#each formData.positive_qualities as quality, index}
                                    <div class="flex items-center gap-2">
                                        <span class="flex-1 text-sm text-gray-600">• {quality}</span>
                                        <button onclick={() => removeFromArray('positive_qualities', index)} class="text-red-500 hover:text-red-700">
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                {/each}
                                <input
                                    type="text"
                                    placeholder="Agregar cualidad positiva..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    onkeydown={(e) => {
                                        if (e.key === 'Enter') {
                                            addToArray('positive_qualities', e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <!-- Cualidades por mejorar -->
                        <div>
                            <div class="block text-sm font-medium text-gray-700 mb-2">Cualidades por Mejorar</div>
                            <div class="space-y-2">
                                {#each formData.improvement_qualities as quality, index}
                                    <div class="flex items-center gap-2">
                                        <span class="flex-1 text-sm text-gray-600">• {quality}</span>
                                        <button onclick={() => removeFromArray('improvement_qualities', index)} class="text-red-500 hover:text-red-700">
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                {/each}
                                <input
                                    type="text"
                                    placeholder="Agregar cualidad por mejorar..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    onkeydown={(e) => {
                                        if (e.key === 'Enter') {
                                            addToArray('improvement_qualities', e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Metas -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Metas con esta Persona</h3>
                    <div class="space-y-2">
                        {#each formData.goals_with_person as goal, index}
                            <div class="flex items-start gap-2">
                                <div class="w-2 h-2 bg-alineados-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span class="flex-1 text-sm text-gray-700">{goal}</span>
                                <button onclick={() => removeFromArray('goals_with_person', index)} class="text-red-500 hover:text-red-700">
                                    <X class="h-4 w-4" />
                                </button>
                            </div>
                        {/each}
                        <input
                            type="text"
                            placeholder="Agregar meta..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            onkeydown={(e) => {
                                if (e.key === 'Enter') {
                                    addToArray('goals_with_person', e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                    </div>
                </div>

                <!-- Fechas importantes -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Fechas Importantes</h3>
                        <button
                            onclick={addImportantDate}
                            class="flex items-center gap-2 px-3 py-1 text-sm bg-alineados-green-100 text-alineados-green-700 rounded-lg hover:bg-alineados-green-200"
                        >
                            <Plus class="h-4 w-4" />
                            Agregar
                        </button>
                    </div>
                    <div class="space-y-3">
                        {#each formData.important_dates as date, index}
                            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar class="h-5 w-5 text-gray-400" />
                                <div class="flex-1 grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        bind:value={date.label}
                                        onchange={handleFieldChange}
                                        placeholder="Etiqueta (ej: Cumpleaños)"
                                        class="px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                    <input
                                        type="date"
                                        bind:value={date.date}
                                        onchange={handleFieldChange}
                                        class="px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                </div>
                                <button onclick={() => removeImportantDate(index)} class="text-red-500 hover:text-red-700">
                                    <X class="h-4 w-4" />
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Información de contacto -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Teléfonos -->
                        <div>
                            <div class="block text-sm font-medium text-gray-700 mb-2">Teléfonos</div>
                            <div class="space-y-2">
                                {#each formData.contact_info.phone_numbers as phone, index}
                                    <div class="flex items-center gap-2">
                                        <Phone class="h-4 w-4 text-gray-400" />
                                        <span class="flex-1 text-sm">{phone}</span>
                                        <button 
                                            onclick={() => {
                                                formData.contact_info.phone_numbers.splice(index, 1);
                                                handleFieldChange();
                                            }} 
                                            class="text-red-500 hover:text-red-700"
                                        >
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                {/each}
                                <input
                                    type="tel"
                                    placeholder="Agregar teléfono..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    onkeydown={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            formData.contact_info.phone_numbers.push(e.currentTarget.value.trim());
                                            e.currentTarget.value = '';
                                            handleFieldChange();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <!-- Emails -->
                        <div>
                            <div class="block text-sm font-medium text-gray-700 mb-2">Emails</div>
                            <div class="space-y-2">
                                {#each formData.contact_info.emails as email, index}
                                    <div class="flex items-center gap-2">
                                        <Mail class="h-4 w-4 text-gray-400" />
                                        <span class="flex-1 text-sm truncate">{email}</span>
                                        <button 
                                            onclick={() => {
                                                formData.contact_info.emails.splice(index, 1);
                                                handleFieldChange();
                                            }} 
                                            class="text-red-500 hover:text-red-700"
                                        >
                                            <X class="h-4 w-4" />
                                        </button>
                                    </div>
                                {/each}
                                <input
                                    type="email"
                                    placeholder="Agregar email..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    onkeydown={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            formData.contact_info.emails.push(e.currentTarget.value.trim());
                                            e.currentTarget.value = '';
                                            handleFieldChange();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <!-- Redes sociales -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <div class="block text-sm font-medium text-gray-700">Redes Sociales</div>
                                <button
                                    onclick={addSocialNetwork}
                                    class="text-alineados-green-600 hover:text-alineados-green-700"
                                >
                                    <Plus class="h-4 w-4" />
                                </button>
                            </div>
                            <div class="space-y-2">
                                {#each formData.contact_info.social_networks as social, index}
                                    <div class="space-y-1 p-2 border border-gray-200 rounded">
                                        <div class="flex items-center gap-2">
                                            <input
                                                type="text"
                                                bind:value={social.platform}
                                                onchange={handleFieldChange}
                                                placeholder="Plataforma"
                                                class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            <button onclick={() => removeSocialNetwork(index)} class="text-red-500 hover:text-red-700">
                                                <X class="h-4 w-4" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            bind:value={social.handle}
                                            onchange={handleFieldChange}
                                            placeholder="@handle"
                                            class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
