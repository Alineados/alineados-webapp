<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Settings from 'lucide-svelte/icons/settings';
    import X from 'lucide-svelte/icons/x';
    import Eye from 'lucide-svelte/icons/eye';
    import EyeOff from 'lucide-svelte/icons/eye-off';
    import Maximize2 from 'lucide-svelte/icons/maximize-2';
    import Minimize2 from 'lucide-svelte/icons/minimize-2';
    
    interface WidgetConfig {
        id: string;
        title: string;
        type: string;
        color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'yellow';
        size: 'sm' | 'md' | 'lg' | 'xl';
        visible: boolean;
        position: number;
    }
    
    let {
        config,
        isEditing = false,
        children
    }: {
        config: WidgetConfig;
        isEditing?: boolean;
        children?: any;
    } = $props();
    
    const dispatch = createEventDispatcher();
    
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-900',
        green: 'bg-green-50 border-green-200 text-green-900',
        purple: 'bg-purple-50 border-purple-200 text-purple-900',
        orange: 'bg-orange-50 border-orange-200 text-orange-900',
        red: 'bg-red-50 border-red-200 text-red-900',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
        pink: 'bg-pink-50 border-pink-200 text-pink-900',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900'
    };
    
    const sizeClasses = {
        sm: 'widget-sm',
        md: 'widget-md', 
        lg: 'widget-lg',
        xl: 'widget-xl'
    };
    
    function toggleVisibility() {
        dispatch('toggle-visibility', { id: config.id });
    }
    
    function removeWidget() {
        dispatch('remove-widget', { id: config.id });
    }
    
    function cycleSize() {
        const sizes: Array<WidgetConfig['size']> = ['sm', 'md', 'lg', 'xl'];
        const currentIndex = sizes.indexOf(config.size);
        const nextIndex = (currentIndex + 1) % sizes.length;
        const nextSize = sizes[nextIndex];
        
        dispatch('change-size', { id: config.id, size: nextSize });
    }
</script>

<div class="widget relative rounded-xl border-2 p-4 h-full {colorClasses[config.color]}" class:opacity-50={!config.visible}>
    {#if isEditing}
        <div class="absolute top-2 right-2 flex gap-1 z-10">
            <button 
                onclick={cycleSize}
                class="p-1 rounded-full bg-white/80 hover:bg-white transition-colors text-blue-600"
                                    title="Cambiar ancho: {config.size === 'sm' ? '1/4' : config.size === 'md' ? '2/4' : config.size === 'lg' ? '3/4' : '4/4'} → {config.size === 'sm' ? '2/4' : config.size === 'md' ? '3/4' : config.size === 'lg' ? '4/4' : '1/4'}"
            >
                {#if config.size === 'sm' || config.size === 'md'}
                    <Maximize2 class="w-4 h-4" />
                {:else}
                    <Minimize2 class="w-4 h-4" />
                {/if}
            </button>
            <button 
                onclick={toggleVisibility}
                class="p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                title={config.visible ? 'Ocultar widget' : 'Mostrar widget'}
            >
                {#if config.visible}
                    <Eye class="w-4 h-4" />
                {:else}
                    <EyeOff class="w-4 h-4" />
                {/if}
            </button>
            <button 
                onclick={removeWidget}
                class="p-1 rounded-full bg-white/80 hover:bg-white transition-colors text-red-600"
                title="Eliminar widget"
            >
                <X class="w-4 h-4" />
            </button>
        </div>
    {/if}
    
    <div class="widget-content h-full flex flex-col">
        <!-- Header with drag handle for better UX -->
        <div class="flex items-center justify-between mb-4 select-none" class:cursor-move={isEditing}>
            <div class="flex items-center gap-2">
                <h3 class="font-semibold text-lg">{config.title}</h3>
                                    {#if isEditing}
                        <span class="text-xs px-2 py-1 bg-white/60 rounded-full font-medium uppercase tracking-wide">
                            {config.size === 'sm' ? '1/4' : config.size === 'md' ? '2/4' : config.size === 'lg' ? '3/4' : '4/4'}
                        </span>
                    {/if}
            </div>
            {#if !isEditing}
                <button class="p-1 rounded-full hover:bg-white/50 transition-colors">
                    <Settings class="w-4 h-4" />
                </button>
            {/if}
        </div>
        
        {#if config.visible}
            <div class="widget-body flex-1 overflow-y-auto">
                {@render children?.()}
            </div>
        {:else}
            <div class="flex items-center justify-center flex-1 text-gray-400">
                <div class="text-center">
                    <EyeOff class="w-8 h-8 mx-auto mb-2" />
                    <p class="text-sm">Widget oculto</p>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .widget {
        width: 100%;
        height: 100%;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .widget:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    .widget-content {
        height: 100%;
    }
    
    .widget-body {
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 4px;
    }
    
    /* Custom scrollbar */
    .widget-body::-webkit-scrollbar {
        width: 4px;
    }
    
    .widget-body::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .widget-body::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
    }
    
    .widget-body::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
    }
</style>
