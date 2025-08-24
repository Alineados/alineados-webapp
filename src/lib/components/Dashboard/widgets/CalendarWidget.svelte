<script lang="ts">
    import ChevronLeft from 'lucide-svelte/icons/chevron-left';
    import ChevronRight from 'lucide-svelte/icons/chevron-right';
    
    let {
        title = "Racha de Actividad"
    } = $props();
    
    let currentMonth = $state(new Date().getMonth());
    let currentYear = $state(new Date().getFullYear());
    
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    
    function previousMonth() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
    }
    
    function nextMonth() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
    }
    
    // Generate random activity data for demonstration
    function getActivityLevel() {
        return Math.floor(Math.random() * 4); // 0-3 intensity levels
    }
</script>

<div class="space-y-4">
    <div class="flex items-center justify-between">
        <h4 class="font-medium">{months[currentMonth]} {currentYear}</h4>
        <div class="flex items-center gap-1">
            <button 
                onclick={previousMonth}
                class="p-1 rounded hover:bg-white/50 transition-colors"
            >
                <ChevronLeft class="w-4 h-4" />
            </button>
            <button 
                onclick={nextMonth}
                class="p-1 rounded hover:bg-white/50 transition-colors"
            >
                <ChevronRight class="w-4 h-4" />
            </button>
        </div>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
        {#each daysOfWeek as day}
            <div class="text-center text-xs font-medium text-gray-600 p-1">{day}</div>
        {/each}
        
        {#each Array(35) as _, i}
            {@const intensity = getActivityLevel()}
            <div 
                class="aspect-square rounded-sm cursor-pointer transition-opacity hover:opacity-80
                       {intensity === 0 ? 'bg-gray-100' : 
                        intensity === 1 ? 'bg-green-200' : 
                        intensity === 2 ? 'bg-green-400' : 
                        'bg-green-600'}"
                title="Actividad del día {i + 1}"
            ></div>
        {/each}
    </div>
    
    <div class="flex items-center justify-between text-xs text-gray-600">
        <span>Menos</span>
        <div class="flex items-center gap-1">
            <div class="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-200 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-400 rounded-sm"></div>
            <div class="w-3 h-3 bg-green-600 rounded-sm"></div>
        </div>
        <span>Más</span>
    </div>
</div>
