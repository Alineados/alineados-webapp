<script lang="ts">
    import Activity from 'lucide-svelte/icons/activity';
    import TrendingUp from 'lucide-svelte/icons/trending-up';
    import Users from 'lucide-svelte/icons/users';
    import Target from 'lucide-svelte/icons/target';
    
    let {
        title = "Estadísticas Generales",
        stats = [
            { label: "Metas Activas", value: 12, icon: Target, color: "text-green-600" },
            { label: "Relaciones", value: 8, icon: Users, color: "text-blue-600" },
            { label: "Racha Actual", value: 15, icon: TrendingUp, color: "text-purple-600" },
            { label: "Actividad Hoy", value: 5, icon: Activity, color: "text-orange-600" }
        ]
    } = $props();
</script>

<div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
        {#each stats as stat}
            {@const IconComponent = stat.icon}
            <div class="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <div class="p-2 rounded-full bg-white">
                    <IconComponent class="w-5 h-5 {stat.color}" />
                </div>
                <div>
                    <p class="text-2xl font-bold">{stat.value}</p>
                    <p class="text-sm text-gray-600">{stat.label}</p>
                </div>
            </div>
        {/each}
    </div>
</div>
