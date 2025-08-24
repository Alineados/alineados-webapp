<script lang="ts">
    import Check from 'lucide-svelte/icons/check';
    import Plus from 'lucide-svelte/icons/plus';
    
    let {
        title = "Tareas de Hoy",
        initialTasks = [
            { id: 1, text: "Revisar metas semanales", completed: false },
            { id: 2, text: "Llamar a Juan", completed: true },
            { id: 3, text: "Ejercicio matutino", completed: false },
            { id: 4, text: "Meditar 10 min", completed: false }
        ]
    } = $props();
    
    // Local state for tasks
    let tasks = $state([...initialTasks]);
    
    function toggleTask(taskId: number) {
        tasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
    }
    
    const completedCount = $derived(tasks.filter(t => t.completed).length);
</script>

<div class="space-y-4 h-full flex flex-col">
    <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
            {completedCount} de {tasks.length} completadas
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2 mx-3">
            <div 
                class="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style="width: {(completedCount / tasks.length) * 100}%"
            ></div>
        </div>
    </div>
    
    <div class="space-y-2 flex-1 overflow-y-auto">
        {#each tasks as task (task.id)}
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <button 
                    onclick={() => toggleTask(task.id)}
                    class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                           {task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}"
                >
                    {#if task.completed}
                        <Check class="w-3 h-3 text-white" />
                    {/if}
                </button>
                <span class="flex-1 text-sm {task.completed ? 'line-through text-gray-500' : 'text-gray-700'}">
                    {task.text}
                </span>
            </div>
        {/each}
    </div>
    
    <button class="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
        <Plus class="w-4 h-4" />
        <span class="text-sm text-gray-600">Agregar tarea</span>
    </button>
</div>
