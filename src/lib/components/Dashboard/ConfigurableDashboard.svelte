<script lang="ts">
    import { onMount } from 'svelte';
    import Settings from 'lucide-svelte/icons/settings';
    import Plus from 'lucide-svelte/icons/plus';
    import Save from 'lucide-svelte/icons/save';
    import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
    
    // Widget Components
    import DashboardWidget from './DashboardWidget.svelte';
    import StatsWidget from './widgets/StatsWidget.svelte';
    import TasksWidget from './widgets/TasksWidget.svelte';
    import CalendarWidget from './widgets/CalendarWidget.svelte';
    import CalendarEventsWidget from './widgets/CalendarEventsWidget.svelte';
    import ChartWidget from './widgets/ChartWidget.svelte';
    import QuickActionsWidget from './widgets/QuickActionsWidget.svelte';
    import RelationsWidget from './widgets/RelationsWidget.svelte';
    
    interface WidgetConfig {
        id: string;
        title: string;
        type: string;
        color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'yellow';
        size: 'sm' | 'md' | 'lg' | 'xl';
        visible: boolean;
        position: number;
    }
    
    // Default widget configurations with width-based sizes
    const defaultWidgets: WidgetConfig[] = [
        { id: 'stats', title: 'Estadísticas', type: 'stats', color: 'blue', size: 'lg', visible: true, position: 0 },
        { id: 'calendar-events', title: 'Fechas Importantes', type: 'calendar-events', color: 'purple', size: 'lg', visible: true, position: 1 },
        { id: 'chart', title: 'Progreso', type: 'chart', color: 'orange', size: 'sm', visible: true, position: 2 },
        { id: 'tasks', title: 'Tareas de Hoy', type: 'tasks', color: 'green', size: 'md', visible: true, position: 3 },
        { id: 'relations', title: 'Relaciones', type: 'relations', color: 'pink', size: 'md', visible: true, position: 4 },
        { id: 'actions', title: 'Acciones Rápidas', type: 'actions', color: 'indigo', size: 'sm', visible: true, position: 5 }
    ];
    
    let widgets = $state(defaultWidgets);
    
    // Sorted widgets for display (derived state)
    const sortedWidgets = $derived(widgets.slice().sort((a, b) => a.position - b.position));
    let isEditing = $state(false);
    let draggedItem: string | null = $state(null);
    let dropZone: string | null = $state(null);
    
    const availableWidgetTypes = [
        { type: 'stats', title: 'Estadísticas', component: StatsWidget },
        { type: 'tasks', title: 'Tareas', component: TasksWidget },
        { type: 'relations', title: 'Relaciones', component: RelationsWidget },
        { type: 'calendar-events', title: 'Fechas Importantes', component: CalendarEventsWidget },
        { type: 'calendar', title: 'Calendario (Demo)', component: CalendarWidget },
        { type: 'chart', title: 'Gráfico', component: ChartWidget },
        { type: 'actions', title: 'Acciones Rápidas', component: QuickActionsWidget }
    ];
    
    const colors: Array<WidgetConfig['color']> = ['blue', 'green', 'purple', 'orange', 'red', 'indigo', 'pink', 'yellow'];
    
    onMount(() => {
        // Load saved configuration
        const savedConfig = localStorage.getItem('dashboard-config');
        if (savedConfig) {
            try {
                widgets = JSON.parse(savedConfig);
            } catch (e) {
                console.error('Error loading dashboard config:', e);
                widgets = [...defaultWidgets];
            }
        }
    });

    // HTML5 Drag and Drop Functions
    function handleDragStart(event: DragEvent, widgetId: string) {
        if (!isEditing) return;
        
        draggedItem = widgetId;
        event.dataTransfer!.effectAllowed = 'move';
        event.dataTransfer!.setData('text/html', widgetId);
        
        // Add visual feedback
        const target = event.target as HTMLElement;
        target.style.opacity = '0.5';
        target.classList.add('dragging');
    }
    
    function handleDragEnd(event: DragEvent) {
        draggedItem = null;
        dropZone = null;
        
        // Remove visual feedback
        const target = event.target as HTMLElement;
        target.style.opacity = '1';
        target.classList.remove('dragging');
        
        // Remove all drop zone highlights
        document.querySelectorAll('.drop-zone-active').forEach(el => {
            el.classList.remove('drop-zone-active');
        });
    }
    
    function handleDragOver(event: DragEvent, targetWidgetId: string) {
        if (!isEditing || !draggedItem || draggedItem === targetWidgetId) return;
        
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
        dropZone = targetWidgetId;
    }
    
    function handleDragEnter(event: DragEvent, targetWidgetId: string) {
        if (!isEditing || !draggedItem || draggedItem === targetWidgetId) return;
        
        event.preventDefault();
        const target = event.currentTarget as HTMLElement;
        target.classList.add('drop-zone-active');
    }
    
    function handleDragLeave(event: DragEvent) {
        const target = event.currentTarget as HTMLElement;
        target.classList.remove('drop-zone-active');
    }
    
    function handleDrop(event: DragEvent, targetWidgetId: string) {
        if (!isEditing || !draggedItem || draggedItem === targetWidgetId) return;
        
        event.preventDefault();
        
        // Find dragged and target widgets
        const draggedWidget = widgets.find(w => w.id === draggedItem);
        const targetWidget = widgets.find(w => w.id === targetWidgetId);
        
        if (!draggedWidget || !targetWidget) return;
        
        // Swap both positions AND sizes
        const draggedPosition = draggedWidget.position;
        const targetPosition = targetWidget.position;
        const draggedSize = draggedWidget.size;
        const targetSize = targetWidget.size;
        
        widgets = widgets.map(w => {
            if (w.id === draggedItem) {
                return { ...w, position: targetPosition, size: targetSize };
            } else if (w.id === targetWidgetId) {
                return { ...w, position: draggedPosition, size: draggedSize };
            }
            return w;
        });
        
        // Clean up
        draggedItem = null;
        dropZone = null;
        const target = event.currentTarget as HTMLElement;
        target.classList.remove('drop-zone-active');
    }
    
    function toggleEditMode() {
        isEditing = !isEditing;
    }
    
    function toggleWidgetVisibility(event: CustomEvent) {
        const widgetId = event.detail.id;
        widgets = widgets.map(w => 
            w.id === widgetId ? { ...w, visible: !w.visible } : w
        );
    }
    
    function changeWidgetSize(event: CustomEvent) {
        const { id, size } = event.detail;
        widgets = widgets.map(w => 
            w.id === id ? { ...w, size } : w
        );
    }
    
    function removeWidget(event: CustomEvent) {
        const widgetId = event.detail.id;
        widgets = widgets.filter(w => w.id !== widgetId);
    }
    
    function addWidget(type: string) {
        const widgetType = availableWidgetTypes.find(t => t.type === type);
        if (!widgetType) return;
        
        const newWidget: WidgetConfig = {
            id: `${type}_${Date.now()}`,
            title: widgetType.title,
            type: type,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 'md',
            visible: true,
            position: widgets.length
        };
        
        widgets = [...widgets, newWidget];
    }
    
    function resetDashboard() {
        widgets = [...defaultWidgets];
    }
    
    function saveDashboard() {
        localStorage.setItem('dashboard-config', JSON.stringify(widgets));
        isEditing = false;
    }
    
    function getWidgetComponent(type: string) {
        const widgetType = availableWidgetTypes.find(t => t.type === type);
        return widgetType?.component || StatsWidget;
    }
</script>

<div class="space-y-6">
    <!-- Dashboard Controls -->
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Mi Dashboard</h2>
        
        <div class="flex items-center gap-2">
            {#if isEditing}
                
                <button 
                    onclick={resetDashboard}
                    class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <RotateCcw class="w-4 h-4" />
                    Restaurar
                </button>
                
                <button 
                    onclick={saveDashboard}
                    class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Save class="w-4 h-4" />
                    Guardar
                </button>
            {/if}
            
            <button 
                onclick={toggleEditMode}
                class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <Settings class="w-4 h-4" />
                {isEditing ? 'Terminar Edición' : 'Configurar'}
            </button>
        </div>
    </div>
    
    <!-- Add Widget Panel (only in edit mode) -->
    {#if isEditing}
        <div class="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Agregar Widgets</h3>
            <div class="flex flex-wrap gap-2">
                {#each availableWidgetTypes as widgetType}
                    <button 
                        onclick={() => addWidget(widgetType.type)}
                        class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Plus class="w-4 h-4" />
                        {widgetType.title}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
    
    <!-- Dashboard Layout: Masonry Grid with HTML5 Drag and Drop -->
    <div class="dashboard-grid">
        {#each sortedWidgets as widget (widget.id)}
            {#if widget.visible}
                {#if isEditing}
                    <div 
                        class="widget-container {widget.size} {widget.type}"
                        class:drop-zone-highlight={dropZone === widget.id}
                        class:dragging={draggedItem === widget.id}
                        draggable="true"
                        role="button"
                        tabindex="0"
                        aria-label="Arrastrar widget {widget.title}"
                        ondragstart={(e) => handleDragStart(e, widget.id)}
                        ondragend={handleDragEnd}
                        ondragover={(e) => handleDragOver(e, widget.id)}
                        ondragenter={(e) => handleDragEnter(e, widget.id)}
                        ondragleave={handleDragLeave}
                        ondrop={(e) => handleDrop(e, widget.id)}
                    >
                        <DashboardWidget 
                            config={widget}
                            {isEditing}
                            on:toggle-visibility={toggleWidgetVisibility}
                            on:remove-widget={removeWidget}
                            on:change-size={changeWidgetSize}
                        >
                            {#snippet children()}
                                {@const WidgetComponent = getWidgetComponent(widget.type)}
                                <WidgetComponent />
                            {/snippet}
                        </DashboardWidget>
                    </div>
                {:else}
                    <div 
                        class="widget-container {widget.size} {widget.type}"
                        class:drop-zone-highlight={dropZone === widget.id}
                        class:dragging={draggedItem === widget.id}
                    >
                        <DashboardWidget 
                            config={widget}
                            {isEditing}
                            on:toggle-visibility={toggleWidgetVisibility}
                            on:remove-widget={removeWidget}
                            on:change-size={changeWidgetSize}
                        >
                            {#snippet children()}
                                {@const WidgetComponent = getWidgetComponent(widget.type)}
                                <WidgetComponent />
                            {/snippet}
                        </DashboardWidget>
                    </div>
                {/if}
            {/if}
        {/each}
    </div>
    
    {#if isEditing}
        <div class="text-center text-sm text-gray-500 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p>💡 <strong>Modo de edición activado:</strong></p>
            <p>• <strong>Arrastra los widgets</strong> para intercambiar posiciones y tamaños automáticamente</p>
            <p>• <strong>Intercambio inteligente:</strong> Al arrastrar, el widget adopta el tamaño de la posición destino</p>
            <p>• <strong>Cambia el ancho</strong> manualmente con el botón azul (1/4, 2/4, 3/4, 4/4)</p>
            <p>• <strong>Distribución automática:</strong> Los widgets se reorganizan en filas según su ancho</p>
            <p>• <strong>Oculta/muestra</strong> widgets con el botón del ojo</p>
            <p>• <strong>Elimina</strong> widgets con el botón rojo X</p>
        </div>
    {/if}
</div>

<style>
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        align-items: start;
        width: 100%;
    }
    
    .widget-container {
        width: 100%;
        height: 350px; /* Altura fija para todos */
        transition: all 0.3s ease;
        border-radius: 12px;
    }
    
    /* Widget de calendario con más altura para mostrar todo el contenido */
    .widget-container.calendar-events {
        height: 500px;
    }
    
    /* Widget widths based on grid column spans */
    .widget-container.sm {
        grid-column: span 1; /* 1/4 del ancho */
    }
    
    .widget-container.md {
        grid-column: span 2; /* 2/4 del ancho (mitad) */
    }
    
    .widget-container.lg {
        grid-column: span 3; /* 3/4 del ancho */
    }
    
    .widget-container.xl {
        grid-column: span 4; /* Ancho completo */
    }
    
    /* Responsive adjustments - maintain 4-column base but scale appropriately */
    @media (max-width: 1024px) {
        .dashboard-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        
        .widget-container.xl {
            grid-column: span 3;
        }
        
        .widget-container.lg {
            grid-column: span 2;
        }
    }
    
    @media (max-width: 768px) {
        .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .widget-container.xl,
        .widget-container.lg {
            grid-column: span 2;
        }
        
        .widget-container.md {
            grid-column: span 1;
        }
    }
    
    @media (max-width: 640px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
        
        .widget-container.sm,
        .widget-container.md,
        .widget-container.lg,
        .widget-container.xl {
            grid-column: span 1;
        }
    }
    
    /* Drag and Drop Effects */
    .widget-container[draggable="true"] {
        cursor: grab;
    }
    
    .widget-container[draggable="true"]:active {
        cursor: grabbing;
    }
    
    .widget-container.dragging {
        opacity: 0.6;
        transform: rotate(2deg) scale(0.98);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }
    
    .widget-container.drop-zone-highlight {
        outline: 3px dashed #3b82f6;
        outline-offset: 4px;
        background-color: rgba(59, 130, 246, 0.05);
    }
    
    :global(.drop-zone-active) {
        outline: 3px dashed #10b981 !important;
        outline-offset: 4px;
        background-color: rgba(16, 185, 129, 0.05) !important;
        border-radius: 12px;
    }
    
    /* Smooth transitions */
    .widget-container {
        transition: all 0.2s ease-in-out;
    }
    
    .widget-container:not(.dragging) {
        transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    }
    
    /* Grid auto-placement ensures widgets fill rows intelligently */
    .dashboard-grid {
        grid-auto-flow: row dense;
    }
</style>
