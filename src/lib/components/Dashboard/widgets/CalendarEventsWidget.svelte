<script lang="ts">
    import { onMount } from 'svelte';
    import { calendarService, type CalendarEvent } from '$lib/services/calendarService';
    import { userState } from '$lib/stores';
    import Search from 'lucide-svelte/icons/search';
    import Calendar from 'lucide-svelte/icons/calendar';
    import ChevronLeft from 'lucide-svelte/icons/chevron-left';
    import ChevronRight from 'lucide-svelte/icons/chevron-right';
    import User from 'lucide-svelte/icons/user';
    import MapPin from 'lucide-svelte/icons/map-pin';
    import Clock from 'lucide-svelte/icons/clock';
    import Sparkles from 'lucide-svelte/icons/sparkles';

    let events: CalendarEvent[] = $state([]);
    let filteredEvents: CalendarEvent[] = $state([]);
    let loading = $state(false);
    let error = $state('');
    let searchTerm = $state('');
    let showSearch = $state(false);
    let currentDate = $state(new Date());
    let view: 'calendar' | 'list' = $state('list');
    let timeFilter: 'week' | 'month' | 'semester' | 'year' = $state('week');
    let showMonthPicker = $state(false);
    let showYearPicker = $state(false);
    
    // Modal state
    let showDayModal = $state(false);
    let selectedDate: Date | null = $state(null);
    let selectedDayEvents: CalendarEvent[] = $state([]);
    
    // Calendar state
    let calendarDays: (Date | null)[] = $state([]);
    let monthName = $state('');
    
    // Get user ID from userState
    const userId = $derived(userState.id);

    onMount(async () => {
        await loadEvents();
        generateCalendar();
    });

    function getDateRange(filter: typeof timeFilter) {
        const now = new Date();
        // Para la vista lista: siempre desde hoy en adelante
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let dateFrom: string;
        let dateTo: string;
        
        switch (filter) {
            case 'week':
                // Esta semana (desde hoy hasta domingo)
                const endOfWeek = new Date(today);
                const day = today.getDay();
                const daysUntilSunday = day === 0 ? 0 : 7 - day;
                endOfWeek.setDate(today.getDate() + daysUntilSunday);
                
                dateFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                dateTo = `${endOfWeek.getFullYear()}-${String(endOfWeek.getMonth() + 1).padStart(2, '0')}-${String(endOfWeek.getDate()).padStart(2, '0')}`;
                break;
                
            case 'month':
                // Desde hoy hasta fin de mes
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Último día del mes actual
                
                dateFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                dateTo = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;
                break;
                
            case 'semester':
                // Desde hoy hasta 6 meses después
                const endOfSemester = new Date(today.getFullYear(), today.getMonth() + 6, 0); // Último día del sexto mes
                
                dateFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                dateTo = `${endOfSemester.getFullYear()}-${String(endOfSemester.getMonth() + 1).padStart(2, '0')}-${String(endOfSemester.getDate()).padStart(2, '0')}`;
                break;
                
            case 'year':
                // Desde hoy hasta fin de año
                const endOfYear = new Date(today.getFullYear() + 1, 0, 0); // 31 de diciembre
                
                dateFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                dateTo = `${endOfYear.getFullYear()}-${String(endOfYear.getMonth() + 1).padStart(2, '0')}-${String(endOfYear.getDate()).padStart(2, '0')}`;
                break;
        }
        
        return { dateFrom, dateTo };
    }

    async function loadEvents() {
        if (!userId) return;
        
        loading = true;
        error = '';
        
        try {
            let result;
            
            if (searchTerm.trim()) {
                // Búsqueda global
                result = await calendarService.getCalendarEvents({ uid: userId, search: searchTerm });
            } else if (view === 'calendar') {
                // Vista calendario: todo el mes mostrado (incluyendo pasados)
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth(); // 0-based: enero=0, julio=6
                
                // Primer día del mes
                const startOfMonth = new Date(year, month, 1);
                // Último día del mes: ir al primer día del mes siguiente y restar 1 día
                const endOfMonth = new Date(year, month + 1, 0);
                
                // Usar fechas locales en lugar de UTC para evitar problemas de zona horaria
                const dateFrom = `${year}-${String(month + 1).padStart(2, '0')}-01`;
                const dateTo = `${year}-${String(month + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;
                
                console.log(`📅 currentDate:`, currentDate);
                console.log(`📅 month (0-indexed):`, month, `= ${month + 1} en humano`);
                console.log(`📅 startOfMonth:`, startOfMonth);
                console.log(`📅 endOfMonth:`, endOfMonth);
                console.log(`📅 Rango calendario: ${dateFrom} → ${dateTo}`);
                
                result = await calendarService.getCalendarEvents({ 
                    uid: userId, 
                    date_from: dateFrom,
                    date_to: dateTo
                });
            } else {
                // Vista lista: usar filtro temporal (solo futuros)
                const { dateFrom, dateTo } = getDateRange(timeFilter);
                result = await calendarService.getCalendarEvents({ 
                    uid: userId, 
                    date_from: dateFrom,
                    date_to: dateTo
                });
            }
            
            if (result.success && result.data) {
                events = result.data.events.sort((a: CalendarEvent, b: CalendarEvent) => 
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                
                // Debug temporal - ver qué eventos se cargaron
                console.log(`📅 [${view}] Eventos cargados:`, events.length);
                if (view === 'calendar') {
                    console.log('📅 Mes actual:', currentDate.getMonth() + 1, currentDate.getFullYear());
                    events.forEach(event => {
                        const eventDate = createLocalDate(event.date);
                        console.log(`  - ${event.label}: ${eventDate.getDate()}/${eventDate.getMonth() + 1}/${eventDate.getFullYear()}`);
                    });
                }
                
                filteredEvents = events;
            } else {
                error = result.error || 'Error al cargar eventos';
                events = [];
                filteredEvents = [];
            }
        } catch (err) {
            error = 'Error de conexión';
            events = [];
            filteredEvents = [];
        }
        
        loading = false;
    }

    function generateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthName = currentDate.toLocaleDateString('es-ES', { 
            month: 'long', 
            year: 'numeric' 
        });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        
        // Comenzar desde el lunes de la semana
        const dayOfWeek = firstDay.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(firstDay.getDate() - mondayOffset);
        
        calendarDays = [];
        
        // Generar 42 días (6 semanas x 7 días)
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            if (date.getMonth() === month) {
                calendarDays.push(date);
            } else {
                calendarDays.push(null);
            }
        }
    }

    // Función utilitaria para crear fecha local desde string YYYY-MM-DD
    function createLocalDate(dateString: string): Date {
        // Si la fecha viene con zona horaria, extraer solo la parte de fecha
        const dateOnly = dateString.split('T')[0];
        const [year, month, day] = dateOnly.split('-').map(Number);
        return new Date(year, month - 1, day); // month - 1 porque Date usa 0-11 para meses
    }

    function getEventsForDate(date: Date): CalendarEvent[] {
        if (!date) return [];
        
        // Usar fecha local para evitar problemas de zona horaria
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const matchingEvents = events.filter(event => {
            // Crear fecha local desde el string del evento
            const eventDate = createLocalDate(event.date);
            const eventYear = eventDate.getFullYear();
            const eventMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
            const eventDay = String(eventDate.getDate()).padStart(2, '0');
            const eventDateStr = `${eventYear}-${eventMonth}-${eventDay}`;
            
            const matches = eventDateStr === dateStr;
            
            // Debug temporal - ver coincidencias
            if (matches) {
                console.log(`🎯 Evento encontrado para ${dateStr}: ${event.label}`);
            }
            
            return matches;
        });
        
        // Debug temporal - eventos por día
        if (matchingEvents.length > 0) {
            console.log(`📍 Día ${dateStr} tiene ${matchingEvents.length} evento(s)`);
        }
        
        return matchingEvents;
    }

    function previousMonth() {
        const newMonth = currentDate.getMonth() - 1;
        const newYear = currentDate.getFullYear();
        currentDate = new Date(newYear, newMonth, 1);
        console.log('📅 Navegando a mes anterior:', newMonth + 1, newYear);
        console.log('📅 currentDate actualizado:', currentDate);
        generateCalendar();
        loadEvents();
    }

    function nextMonth() {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        console.log('📅 Navegando a mes siguiente:', currentDate.getMonth() + 1, currentDate.getFullYear());
        generateCalendar();
        loadEvents();
    }

    function selectMonth(monthIndex: number) {
        currentDate = new Date(currentDate.getFullYear(), monthIndex, 1);
        console.log('📅 Seleccionando mes:', monthIndex + 1, currentDate.getFullYear());
        showMonthPicker = false;
        generateCalendar();
        loadEvents();
    }

    function selectYear(year: number) {
        currentDate = new Date(year, currentDate.getMonth(), 1);
        console.log('📅 Seleccionando año:', year, currentDate.getMonth() + 1);
        showYearPicker = false;
        generateCalendar();
        loadEvents();
    }

    function generateYearOptions() {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 10; i <= currentYear + 10; i++) {
            years.push(i);
        }
        return years;
    }

    function formatEventDate(dateString: string): {
        text: string;
        isToday: boolean;
        isPast: boolean;
        daysFromNow: number;
        fullDate: string;
        timeUntil: string;
    } {
        const formatted = calendarService.formatEventDate(dateString);
        let text = '';
        let timeUntil = '';
        
        if (formatted.isToday) {
            text = 'Hoy';
            timeUntil = 'Hoy';
        } else if (formatted.daysFromNow === 1) {
            text = 'Mañana';
            timeUntil = 'En 1 día';
        } else if (formatted.daysFromNow === -1) {
            text = 'Ayer';
            timeUntil = 'Hace 1 día';
        } else if (formatted.daysFromNow > 1 && formatted.daysFromNow <= 7) {
            text = `En ${formatted.daysFromNow} días`;
            timeUntil = `En ${formatted.daysFromNow} días`;
        } else if (formatted.daysFromNow < -1 && formatted.daysFromNow >= -7) {
            text = `Hace ${Math.abs(formatted.daysFromNow)} días`;
            timeUntil = `Hace ${Math.abs(formatted.daysFromNow)} días`;
        } else {
            text = formatted.date;
            timeUntil = formatted.daysFromNow > 0 ? `En ${formatted.daysFromNow} días` : `Hace ${Math.abs(formatted.daysFromNow)} días`;
        }
        
        return {
            text,
            isToday: formatted.isToday,
            isPast: formatted.isPast,
            daysFromNow: formatted.daysFromNow,
            fullDate: formatted.date,
            timeUntil
        };
    }

    function handleSearch() {
        if (searchTerm.trim() === '') {
            filteredEvents = events;
        } else {
            // Si se busca desde vista calendario, cambiar a vista lista
            if (view === 'calendar') {
                view = 'list';
                loadEvents(); // Recargar eventos para la vista lista
            }
            
            const term = searchTerm.toLowerCase();
            filteredEvents = events.filter(event => 
                event.relation_name.toLowerCase().includes(term) ||
                event.label.toLowerCase().includes(term) ||
                event.area_name.toLowerCase().includes(term)
            );
        }
    }

    function groupEventsByPeriod(eventsList: CalendarEvent[]) {
        if (timeFilter === 'week') {
            return groupEventsByWeek(eventsList);
        } else {
            return groupEventsByMonth(eventsList);
        }
    }

    function groupEventsByWeek(eventsList: CalendarEvent[]) {
        const groups = new Map<string, CalendarEvent[]>();
        
        eventsList.forEach(event => {
            const date = new Date(event.date);
            const startOfWeek = new Date(date);
            const day = date.getDay();
            const diff = day === 0 ? -6 : 1 - day; // Lunes como primer día
            startOfWeek.setDate(date.getDate() + diff);
            
            const weekKey = `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1}/${startOfWeek.getFullYear()}`;
            
            if (!groups.has(weekKey)) {
                groups.set(weekKey, []);
            }
            groups.get(weekKey)!.push(event);
        });
        
        return Array.from(groups.entries()).map(([week, events]) => ({
            period: `Semana del ${week}`,
            events
        }));
    }

    function groupEventsByMonth(eventsList: CalendarEvent[]) {
        const groups = new Map<string, CalendarEvent[]>();
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        eventsList.forEach(event => {
            const date = new Date(event.date);
            const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            
            if (!groups.has(monthKey)) {
                groups.set(monthKey, []);
            }
            groups.get(monthKey)!.push(event);
        });
        
        return Array.from(groups.entries()).map(([month, events]) => ({
            period: month,
            events
        }));
    }

    // Reactive search - runs when events or searchTerm changes
    $effect(() => {
        handleSearch();
    });

    // Close dropdowns when clicking outside
    $effect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (!target.closest('.month-year-picker')) {
                showMonthPicker = false;
                showYearPicker = false;
            }
        }

        if (showMonthPicker || showYearPicker) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    });

    function isToday(date: Date): boolean {
        const today = new Date();
        return date && 
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    function openDayModal(date: Date, dayEvents: CalendarEvent[]) {
        selectedDate = date;
        selectedDayEvents = dayEvents;
        showDayModal = true;
    }

    function closeDayModal() {
        showDayModal = false;
        selectedDate = null;
        selectedDayEvents = [];
    }

    const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
</script>

<div class="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
    <!-- Header with search and view toggle -->
    <div class="p-4 border-b border-purple-100">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
                <div class="p-2 bg-purple-100 rounded-lg">
                    <Calendar class="w-4 h-4 text-purple-600" />
                </div>
                <div>
                    <h4 class="font-semibold text-gray-800">Fechas Importantes</h4>
                    <p class="text-xs text-gray-500">{filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}</p>
                </div>
            </div>
            
            <div class="flex items-center gap-2">
                <!-- Search toggle button -->
                <button 
                    onclick={() => { showSearch = !showSearch; if (!showSearch) searchTerm = ''; }}
                    class="p-2 rounded-lg transition-colors {showSearch ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                    title={showSearch ? 'Ocultar búsqueda' : 'Mostrar búsqueda'}
                >
                    <Search class="w-4 h-4" />
                </button>
                
                <!-- View toggle -->
                <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button 
                        onclick={() => view = 'list'}
                        class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors {view === 'list' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
                    >
                        Lista
                    </button>
                    <button 
                        onclick={() => view = 'calendar'}
                        class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors {view === 'calendar' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
                    >
                        Calendario
                    </button>
                </div>
            </div>
        </div>

        <!-- Time filter (only for list view) -->
        {#if view === 'list'}
            <div class="flex gap-1 bg-gray-100 rounded-lg p-1 mb-3">
                <button 
                    onclick={() => { timeFilter = 'week'; loadEvents(); }}
                    class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors {timeFilter === 'week' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
                >
                    Esta semana
                </button>
                <button 
                    onclick={() => { timeFilter = 'month'; loadEvents(); }}
                    class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors {timeFilter === 'month' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
                >
                    Este mes
                </button>
                <button 
                    onclick={() => { timeFilter = 'semester'; loadEvents(); }}
                    class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors {timeFilter === 'semester' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
                >
                    Semestre
                </button>
                <button 
                    onclick={() => { timeFilter = 'year'; loadEvents(); }}
                    class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors {timeFilter === 'year' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
                >
                    A\u00f1o
                </button>
            </div>
        {/if}

        <!-- Search (conditional) -->
        {#if showSearch}
            <div class="relative mt-3">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar en todas las fechas importantes..."
                    bind:value={searchTerm}
                    class="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all"
                />
            </div>
        {/if}
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
        {#if loading}
            <div class="flex flex-col items-center justify-center h-40 space-y-3">
                <div class="relative">
                    <div class="animate-spin rounded-full h-8 w-8 border-2 border-purple-200"></div>
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-600 absolute top-0 left-0"></div>
                </div>
                <p class="text-sm text-gray-600">Cargando eventos...</p>
            </div>
        {:else if error}
            <div class="flex flex-col items-center justify-center h-40 space-y-4">
                <div class="p-3 bg-red-100 rounded-full">
                    <Clock class="w-6 h-6 text-red-600" />
                </div>
                <div class="text-center">
                    <p class="text-sm font-medium text-red-800 mb-1">Error al cargar eventos</p>
                    <p class="text-xs text-red-600 mb-3">{error}</p>
                    <button 
                        onclick={loadEvents}
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        {:else if view === 'calendar'}
            <!-- Calendar View -->
            <div class="space-y-3">
                <!-- Month navigation -->
                <div class="flex items-center justify-between mb-3">
                    <button 
                        onclick={previousMonth}
                        class="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                        title="Mes anterior"
                    >
                        <ChevronLeft class="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                    </button>
                    
                    <div class="flex items-center gap-2 relative month-year-picker">
                        <!-- Month selector -->
                        <button 
                            onclick={() => showMonthPicker = !showMonthPicker}
                            class="px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-purple-50 rounded-lg transition-colors capitalize"
                        >
                            {currentDate.toLocaleDateString('es-ES', { month: 'long' })}
                        </button>
                        
                        <!-- Year selector -->
                        <button 
                            onclick={() => showYearPicker = !showYearPicker}
                            class="px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                            {currentDate.getFullYear()}
                        </button>

                        <!-- Month picker dropdown -->
                        {#if showMonthPicker}
                            <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 grid grid-cols-3 gap-1 min-w-48">
                                {#each ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] as month, index}
                                    <button 
                                        onclick={() => selectMonth(index)}
                                        class="px-2 py-1.5 text-xs rounded-md hover:bg-purple-100 transition-colors {currentDate.getMonth() === index ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'}"
                                    >
                                        {month}
                                    </button>
                                {/each}
                            </div>
                        {/if}

                        <!-- Year picker dropdown -->
                        {#if showYearPicker}
                            <div class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 max-h-48 overflow-y-auto">
                                {#each generateYearOptions() as year}
                                    <button 
                                        onclick={() => selectYear(year)}
                                        class="block w-full px-3 py-1.5 text-sm text-left rounded-md hover:bg-purple-100 transition-colors {currentDate.getFullYear() === year ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'}"
                                    >
                                        {year}
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    
                    <button 
                        onclick={nextMonth}
                        class="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                        title="Mes siguiente"
                    >
                        <ChevronRight class="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                    </button>
                </div>
                
                <!-- Calendar grid -->
                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div class="grid grid-cols-7 bg-gray-50">
                        <!-- Week headers -->
                        {#each weekDays as day}
                            <div class="text-center text-gray-600 font-semibold py-2 text-xs border-r border-gray-200 last:border-r-0">
                                {day}
                            </div>
                        {/each}
                    </div>
                    
                    <!-- Calendar days -->
                    <div class="grid grid-cols-7">
                        {#each calendarDays as date, index}
                            <div class="h-10 relative border-r border-b border-gray-100 last:border-r-0 {index >= 35 ? 'border-b-0' : ''}">
                                {#if date}
                                    {@const dayEvents = getEventsForDate(date)}
                                    {@const isCurrentMonth = date.getMonth() === currentDate.getMonth()}
                                    <button 
                                        class="w-full h-full p-1 text-center text-xs transition-all duration-200 relative group
                                               {isToday(date) ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold shadow-sm' : 
                                                isCurrentMonth ? 
                                                    (dayEvents.length > 0 ? 'text-gray-800 hover:bg-purple-50 font-medium' : 'text-gray-700 hover:bg-gray-50') :
                                                    'text-gray-400 hover:bg-gray-50'}
                                               {dayEvents.length > 0 ? 'cursor-pointer' : ''}"
                                        onclick={() => dayEvents.length > 0 && openDayModal(date, dayEvents)}
                                        disabled={dayEvents.length === 0}
                                        title={dayEvents.length > 0 ? `${dayEvents.length} evento${dayEvents.length !== 1 ? 's' : ''}` : ''}
                                    >
                                        <div class="relative z-10 flex flex-col items-center justify-center h-full">
                                            <span class="{isToday(date) ? 'text-white' : ''}">{date.getDate()}</span>
                                            
                                            <!-- Event indicators -->
                                            {#if dayEvents.length > 0}
                                                <div class="flex gap-0.5 mt-0.5">
                                                    {#each dayEvents.slice(0, 2) as event}
                                                        <div 
                                                            class="w-1.5 h-1.5 rounded-full {
                                                                isToday(date) ? 'bg-white' :
                                                                event.repeat === 'annual' ? 'bg-purple-400' :
                                                                event.repeat === 'monthly' ? 'bg-blue-400' :
                                                                event.repeat === 'weekly' ? 'bg-green-400' :
                                                                'bg-gray-400'
                                                            }"
                                                        ></div>
                                                    {/each}
                                                    {#if dayEvents.length > 2}
                                                        <div class="w-1.5 h-1.5 rounded-full {isToday(date) ? 'bg-white' : 'bg-orange-400'}"></div>
                                                    {/if}
                                                </div>
                                            {/if}
                                        </div>

                                        <!-- Hover effect for days with events -->
                                        {#if dayEvents.length > 0 && !isToday(date)}
                                            <div class="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-sm"></div>
                                        {/if}
                                    </button>
                                {:else}
                                    <div class="w-full h-full bg-gray-25"></div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {:else}
            <!-- List View -->
            <div class="space-y-4 overflow-y-auto max-h-full">
                {#if filteredEvents.length === 0}
                    <div class="flex flex-col items-center justify-center h-40 space-y-4">
                        <div class="p-4 bg-gray-100 rounded-full">
                            <Calendar class="w-8 h-8 text-gray-400" />
                        </div>
                        <div class="text-center">
                            <p class="text-sm font-medium text-gray-800 mb-1">
                                {searchTerm ? 'No se encontraron eventos' : 'No hay fechas importantes'}
                            </p>
                            <p class="text-xs text-gray-500">
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Agrega fechas importantes en las relaciones'}
                            </p>
                        </div>
                    </div>
                {:else}
                    {@const groupedEvents = groupEventsByPeriod(filteredEvents)}
                    {#each groupedEvents as group}
                        <div class="space-y-3">
                            <h3 class="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1 px-1">
                                {group.period}
                            </h3>
                            {#each group.events as event (event.id)}
                        {@const formatted = formatEventDate(event.date)}
                        <div 
                            class="relative p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden
                                   {formatted.isToday ? 'border-purple-300 bg-purple-50 shadow-sm' : ''}
                                   {formatted.isPast ? 'opacity-75' : ''}"
                        >
                            <!-- Background decoration -->
                            {#if formatted.isToday}
                                <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full opacity-50"></div>
                            {/if}
                            
                            <div class="relative flex items-start justify-between gap-3">
                                <div class="flex-1 min-w-0">
                                    <!-- Event title -->
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="p-1.5 bg-purple-100 rounded-lg">
                                            <Sparkles class="w-3 h-3 text-purple-600" />
                                        </div>
                                        <div class="flex-1">
                                            <h6 class="font-semibold text-sm text-gray-900 truncate">
                                                {event.label}
                                            </h6>
                                            {#if event.repeat && event.repeat !== 'none'}
                                                <span class="text-xs text-purple-600 font-medium">
                                                    {event.repeat === 'annual' ? '📅 Anual' : 
                                                     event.repeat === 'monthly' ? '📅 Mensual' : 
                                                     event.repeat === 'weekly' ? '📅 Semanal' : ''}
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                    
                                    <!-- Person info -->
                                    <div class="flex items-center gap-2 mb-2">
                                        <User class="w-3.5 h-3.5 text-gray-400" />
                                        <span class="text-sm text-gray-700 font-medium truncate">{event.relation_name}</span>
                                    </div>
                                    
                                    <!-- Area info -->
                                    <div class="flex items-center gap-2">
                                        <MapPin class="w-3.5 h-3.5 text-gray-400" />
                                        <span class="text-xs text-gray-500">{event.area_name}</span>
                                    </div>
                                </div>
                                
                                <!-- Date info -->
                                <div class="text-right space-y-1">
                                    <div class="text-sm font-semibold {formatted.isToday ? 'text-purple-700' : formatted.isPast ? 'text-gray-500' : 'text-gray-800'}">
                                        {formatted.text}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {formatted.fullDate}
                                    </div>
                                    {#if formatted.isToday}
                                        <div class="inline-flex px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                            ¡Es hoy!
                                        </div>
                                    {:else if formatted.daysFromNow === 1}
                                        <div class="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                            Mañana
                                        </div>
                                    {:else if formatted.daysFromNow > 1 && formatted.daysFromNow <= 7}
                                        <div class="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            Esta semana
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                            {/each}
                        </div>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>
</div>

<!-- Day Events Modal -->
{#if showDayModal && selectedDate}
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
        onclick={closeDayModal}
        onkeydown={(e) => e.key === 'Escape' && closeDayModal()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
    >
        <div 
            class="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto" 
            role="document"
        >
            <div class="flex items-center justify-between mb-4">
                <h3 id="modal-title" class="text-lg font-semibold text-gray-800">
                    Eventos del {selectedDate.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </h3>
                <button 
                    onclick={closeDayModal}
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Cerrar modal"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="space-y-3">
                {#each selectedDayEvents as event}
                    <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <Sparkles class="w-4 h-4 text-purple-600" />
                                    <h4 class="font-medium text-gray-900">{event.label}</h4>
                                    {#if event.repeat && event.repeat !== 'none'}
                                        <span class="px-2 py-0.5 text-xs font-medium rounded-full {
                                            event.repeat === 'annual' ? 'bg-purple-100 text-purple-700' :
                                            event.repeat === 'monthly' ? 'bg-blue-100 text-blue-700' :
                                            event.repeat === 'weekly' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                        }">
                                            {event.repeat === 'annual' ? 'Anual' : 
                                             event.repeat === 'monthly' ? 'Mensual' : 
                                             event.repeat === 'weekly' ? 'Semanal' : ''}
                                        </span>
                                    {/if}
                                </div>
                                
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <User class="w-3 h-3" />
                                    <span>{event.relation_name}</span>
                                </div>
                                
                                {#if event.area_name && event.area_name !== 'Sin área'}
                                    <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <MapPin class="w-3 h-3" />
                                        <span>{event.area_name}</span>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
