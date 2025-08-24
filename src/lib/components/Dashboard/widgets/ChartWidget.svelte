<script lang="ts">
    import BarChart from 'lucide-svelte/icons/bar-chart';
    
    let {
        title = "Progreso Mensual",
        data = [
            { label: "Ene", value: 75, color: "bg-blue-500" },
            { label: "Feb", value: 85, color: "bg-green-500" },
            { label: "Mar", value: 65, color: "bg-purple-500" },
            { label: "Abr", value: 90, color: "bg-orange-500" },
            { label: "May", value: 80, color: "bg-red-500" },
            { label: "Jun", value: 95, color: "bg-indigo-500" }
        ]
    } = $props();
    
    const maxValue = $derived(Math.max(...data.map(d => d.value)));
</script>

<div class="space-y-4">
    <div class="flex items-center gap-2">
        <BarChart class="w-5 h-5 text-gray-600" />
        <span class="text-sm text-gray-600">Últimos 6 meses</span>
    </div>
    
    <div class="h-32 flex items-end justify-between gap-2">
        {#each data as item}
            <div class="flex flex-col items-center gap-2 flex-1">
                <div 
                    class="w-full rounded-t {item.color} transition-all duration-500 hover:opacity-80"
                    style="height: {(item.value / maxValue) * 100}%"
                    title="{item.label}: {item.value}%"
                ></div>
                <span class="text-xs text-gray-600">{item.label}</span>
            </div>
        {/each}
    </div>
    
    <div class="flex items-center justify-between text-xs text-gray-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
    </div>
</div>
