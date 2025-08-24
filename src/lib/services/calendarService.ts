import type { ApiResponse } from './types';

export interface CalendarEvent {
    id: string;
    relation_id: string;
    relation_name: string;
    area_name: string;
    date: string;
    label: string;
    event_type: string;
    repeat: string; // "none", "annual", "monthly", "weekly"
}

export interface CalendarEventsResponse {
    events: CalendarEvent[];
}

export interface CalendarFilters {
    uid: string;
    date_from?: string;
    date_to?: string;
    area_id?: string;
    search?: string; // Para filtrar por nombre de relación o label
}

class CalendarService {
    private baseUrl = 'http://localhost:8080/api/v1';

    /**
     * Obtiene eventos del calendario con filtros opcionales
     */
    async getCalendarEvents(filters: CalendarFilters): Promise<ApiResponse<CalendarEventsResponse>> {
        try {
            const params = new URLSearchParams();
            params.append('uid', filters.uid);
            
            if (filters.date_from) {
                params.append('date_from', filters.date_from);
            }
            
            if (filters.date_to) {
                params.append('date_to', filters.date_to);
            }
            
            if (filters.area_id) {
                params.append('area_id', filters.area_id);
            }

            const response = await fetch(`${this.baseUrl}/relations/calendar?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: CalendarEventsResponse = await response.json();
            
            // Filtro local por search si se proporciona
            let filteredEvents = data.events;
            if (filters.search && filters.search.trim() !== '') {
                const searchTerm = filters.search.toLowerCase();
                filteredEvents = data.events.filter(event => 
                    event.relation_name.toLowerCase().includes(searchTerm) ||
                    event.label.toLowerCase().includes(searchTerm) ||
                    event.area_name.toLowerCase().includes(searchTerm)
                );
            }
            
            return {
                success: true,
                data: { events: filteredEvents }
            };
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }

    /**
     * Obtiene eventos para el mes actual
     */
    async getCurrentMonthEvents(uid: string, search?: string): Promise<ApiResponse<CalendarEventsResponse>> {
        const now = new Date();
        return this.getMonthEvents(uid, now, search);
    }

    async getMonthEvents(uid: string, date: Date, search?: string): Promise<ApiResponse<CalendarEventsResponse>> {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Get first day of specified month
        const firstDay = new Date(year, month, 1);
        // Get last day of specified month  
        const lastDay = new Date(year, month + 1, 0);

        return this.getCalendarEvents({
            uid,
            date_from: firstDay.toISOString().split('T')[0],
            date_to: lastDay.toISOString().split('T')[0],
            search
        });
    }

    /**
     * Obtiene eventos para un rango de fechas específico
     */
    async getEventsInRange(uid: string, startDate: Date, endDate: Date, search?: string): Promise<ApiResponse<CalendarEventsResponse>> {
        return this.getCalendarEvents({
            uid,
            date_from: startDate.toISOString().split('T')[0],
            date_to: endDate.toISOString().split('T')[0],
            search
        });
    }

    /**
     * Obtiene eventos para un mes específico
     */
    async getMonthEvents(uid: string, date: Date, search?: string): Promise<ApiResponse<CalendarEventsResponse>> {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Get first day of specified month
        const firstDay = new Date(year, month, 1);
        // Get last day of specified month  
        const lastDay = new Date(year, month + 1, 0);

        return this.getCalendarEvents({
            uid,
            date_from: firstDay.toISOString().split('T')[0],
            date_to: lastDay.toISOString().split('T')[0],
            search
        });
    }

    /**
     * Obtiene próximos eventos (siguiente mes)
     */
    async getUpcomingEvents(uid: string, days: number = 30, search?: string): Promise<ApiResponse<CalendarEventsResponse>> {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);

        return this.getCalendarEvents({
            uid,
            date_from: now.toISOString().split('T')[0],
            date_to: futureDate.toISOString().split('T')[0],
            search
        });
    }

    /**
     * Formatea una fecha para mostrar en el calendario
     */
    formatEventDate(dateString: string): { 
        date: string;
        time?: string;
        isToday: boolean;
        isPast: boolean;
        daysFromNow: number;
    } {
        // Crear fecha local desde string para evitar problemas de zona horaria
        const dateOnly = dateString.split('T')[0];
        const [year, month, day] = dateOnly.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day); // month - 1 porque Date usa 0-11
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        
        const timeDiff = eventDay.getTime() - today.getTime();
        const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
        
        return {
            date: eventDate.toLocaleDateString('es-ES', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            time: eventDate.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            isToday: daysDiff === 0,
            isPast: daysDiff < 0,
            daysFromNow: daysDiff
        };
    }

    /**
     * Agrupa eventos por mes
     */
    groupEventsByMonth(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
        return events.reduce((groups, event) => {
            const date = new Date(event.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            
            groups[monthKey].push(event);
            return groups;
        }, {} as Record<string, CalendarEvent[]>);
    }


}

export const calendarService = new CalendarService();
