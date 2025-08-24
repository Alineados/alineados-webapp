<script lang="ts">
    import ConfigurableDashboard from '$lib/components/Dashboard/ConfigurableDashboard.svelte';
</script>

<div class="container mx-auto px-4 py-8">
    <p class="mb-2 text-sm font-medium text-alineados-gray-600">Inicio</p>
    <div class="mb-8 flex items-center justify-between">
        <h1 class="text-5xl font-bold text-alineados-gray-900">Bienvenidos a Alineados</h1>
        <div class="flex gap-2">
            <a 
                href="https://form.jotform.com/250950590856061" 
                target="_blank" 
                rel="noopener noreferrer"
                class="rounded-xl bg-alineados-blue-900 px-4 py-2 text-sm font-medium text-white inline-block text-center"
            >
                Dar Retroalimentación
            </a>

            <a 
                href="https://form.jotform.com/250948884184068" 
                target="_blank" 
                rel="noopener noreferrer"
                class="rounded-xl bg-alineados-blue-900 px-4 py-2 text-sm font-medium text-white inline-block text-center"
            >
            Dar Tu Legado
            </a>


            <a 
                href="https://outlook.office.com/bookwithme/user/02406cc0b69540d5b2c1c3540884f6b7%40alineado.org/meetingtype/wbjRQ6ebHUe6Uz05vWTWTA2?anonymous&isanonymous=true" 
                target="_blank" 
                rel="noopener noreferrer"
                class="rounded-xl bg-alineados-blue-900 px-4 py-2 text-sm font-medium text-white inline-block text-center"
            >
                Necesito Asesoramiento
            </a>
        </div>
    </div>

    <!-- Configurable Dashboard -->
    <ConfigurableDashboard />
</div>