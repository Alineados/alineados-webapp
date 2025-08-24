<script lang="ts">
    import Users from 'lucide-svelte/icons/users';
    import ArrowUp from 'lucide-svelte/icons/arrow-up';
    import ArrowDown from 'lucide-svelte/icons/arrow-down';
    import Star from 'lucide-svelte/icons/star';
    import { goto } from '$app/navigation';
    
    let {
        title = "Relaciones Recientes"
    } = $props();
    
    // Mock data - in real app this would come from relations service
    const relations = [
        { 
            id: 1, 
            name: "Ana García", 
            status: "green",
            i_seek_them: true,
            they_seek_me: null,
            highlighted: false,
            gatherings_count: 3
        },
        { 
            id: 2, 
            name: "Carlos Ruiz", 
            status: "yellow",
            i_seek_them: false,
            they_seek_me: true,
            highlighted: true,
            gatherings_count: 1
        },
        { 
            id: 3, 
            name: "Maria López", 
            status: "red",
            i_seek_them: null,
            they_seek_me: false,
            highlighted: false,
            gatherings_count: 0
        }
    ];
    
    function getStatusColor(status: string) {
        switch (status) {
            case 'green': return 'bg-green-100 text-green-800';
            case 'yellow': return 'bg-yellow-100 text-yellow-800';
            case 'red': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    function getArrowColor(value: boolean | null) {
        if (value === null) return 'text-gray-400';
        return value ? 'text-green-500' : 'text-red-500';
    }
    
    function viewRelation(id: number) {
        goto(`/relations/${id}`);
    }
</script>

<div class="space-y-4">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <Users class="w-5 h-5 text-gray-600" />
            <span class="text-sm text-gray-600">{relations.length} relaciones</span>
        </div>
        <button 
            onclick={() => goto('/relations')}
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
            Ver todas
        </button>
    </div>
    
    <div class="space-y-3 max-h-48 overflow-y-auto">
        {#each relations as relation}
            <button 
                class="w-full flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                onclick={() => viewRelation(relation.id)}
            >
                <div class="flex items-center gap-3 flex-1">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users class="w-4 h-4 text-gray-500" />
                    </div>
                    
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <p class="font-medium text-sm text-gray-900">{relation.name}</p>
                            {#if relation.highlighted}
                                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                            {/if}
                        </div>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="px-2 py-1 text-xs rounded-full {getStatusColor(relation.status)}">
                                {relation.status === 'green' ? 'Bien' : relation.status === 'yellow' ? 'Regular' : 'Mal'}
                            </span>
                            <span class="text-xs text-gray-500">{relation.gatherings_count} encuentros</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col items-center gap-1">
                    <ArrowUp class="w-4 h-4 {getArrowColor(relation.i_seek_them)}" />
                    <ArrowDown class="w-4 h-4 {getArrowColor(relation.they_seek_me)}" />
                </div>
            </button>
        {/each}
    </div>
    
    <button 
        onclick={() => goto('/relations/new')}
        class="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
    >
        <Users class="w-4 h-4 text-gray-600" />
        <span class="text-sm text-gray-600">Nueva relación</span>
    </button>
</div>
