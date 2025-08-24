<script lang="ts">
    import Plus from 'lucide-svelte/icons/plus';
    import Users from 'lucide-svelte/icons/users';
    import Target from 'lucide-svelte/icons/target';
    import BookOpen from 'lucide-svelte/icons/book-open';
    import Calendar from 'lucide-svelte/icons/calendar';
    import { goto } from '$app/navigation';
    
    let {
        title = "Acciones Rápidas"
    } = $props();
    
    const actions = [
        { 
            label: "Nueva Meta", 
            icon: Target, 
            color: "bg-green-500 hover:bg-green-600", 
            action: () => goto('/personal/pillars/edit')
        },
        { 
            label: "Nueva Relación", 
            icon: Users, 
            color: "bg-blue-500 hover:bg-blue-600", 
            action: () => goto('/relations/new')
        },
        { 
            label: "Nuevo Pensamiento", 
            icon: BookOpen, 
            color: "bg-purple-500 hover:bg-purple-600", 
            action: () => goto('/personal/thoughts')
        },
        { 
            label: "Agendar Reunión", 
            icon: Calendar, 
            color: "bg-orange-500 hover:bg-orange-600", 
            action: () => window.open('https://outlook.office.com/bookwithme/user/02406cc0b69540d5b2c1c3540884f6b7%40alineado.org/meetingtype/wbjRQ6ebHUe6Uz05vWTWTA2?anonymous&isanonymous=true', '_blank')
        }
    ];
</script>

<div class="space-y-3">
    {#each actions as action}
        {@const IconComponent = action.icon}
        <button 
            onclick={action.action}
            class="w-full flex items-center gap-3 p-3 rounded-lg text-white transition-colors {action.color}"
        >
            <IconComponent class="w-5 h-5" />
            <span class="font-medium">{action.label}</span>
        </button>
    {/each}
</div>
