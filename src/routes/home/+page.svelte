<script lang="ts">
    import { page } from '$app/stores';
    import ChevronLeft from 'lucide-svelte/icons/chevron-left';
    import ChevronRight from 'lucide-svelte/icons/chevron-right';
    import Check from 'lucide-svelte/icons/check';
    import Clock from 'lucide-svelte/icons/clock';
    import Activity from 'lucide-svelte/icons/activity';

    let frequency = $state('Semanal');
    let currentLevel = $state('Principiante');
    let timeFrame = $state('Semanal');

    const stats = {
        concluidos: 33,
        activos: 51,
        noActivos: 15,
        total: 98
    };

    const yearStats = {
        2024: { completed: 32, active: 20, inactive: 10 },
        2025: { completed: 20, active: 15, inactive: 5 },
        2026: { completed: 47, active: 30, inactive: 12 }
    };

    const recommendations = [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet'
    ];

    const turboPro = [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet'
    ];

    const todayTasks = [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet'
    ];

    const todayMeetings = [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet'
    ];

    const highlightedElements = [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet'
    ];
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

    <!-- Frequency and Level Selectors -->
    <div class="mb-8 grid grid-cols-3 gap-6">
        <div class="flex items-center justify-between rounded-xl border p-4">
            <span class="text-sm font-medium">Frecuencia</span>
            <div class="flex gap-2">
                <button class="rounded-full px-3 py-1 text-sm {frequency === 'Diario' ? 'bg-green-100 text-green-800' : 'text-gray-600'}">
                    Diario
                </button>
                <button class="rounded-full px-3 py-1 text-sm {frequency === 'Semanal' ? 'bg-green-100 text-green-800' : 'text-gray-600'}">
                    Semanal
                </button>
                <button class="rounded-full px-3 py-1 text-sm {frequency === 'Mensual' ? 'bg-green-100 text-green-800' : 'text-gray-600'}">
                    Mensual
                </button>
            </div>
        </div>

        <div class="flex flex-col items-center rounded-xl border p-4">
            <span class="mb-2 text-sm font-medium">Nivel Actual</span>
            <div class="flex w-full justify-between">
                <span class="text-xs {currentLevel === 'Principiante' ? 'text-green-600 font-medium' : 'text-gray-400'}">Principiante</span>
                <span class="text-xs {currentLevel === 'Básico' ? 'text-green-600 font-medium' : 'text-gray-400'}">Básico</span>
                <span class="text-xs {currentLevel === 'Intermedio' ? 'text-green-600 font-medium' : 'text-gray-400'}">Intermedio</span>
                <span class="text-xs {currentLevel === 'Avanzado' ? 'text-green-600 font-medium' : 'text-gray-400'}">Avanzado</span>
            </div>
            <div class="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div class="h-full w-1/4 rounded-full bg-green-500" />
            </div>
        </div>

        <div class="flex items-center justify-between rounded-xl border p-4">
            <span class="text-sm font-medium">Horizonte de Tiempo</span>
            <div class="flex gap-2">
                <button class="rounded-full px-3 py-1 text-sm {timeFrame === 'Semanal' ? 'bg-green-100 text-green-800' : 'text-gray-600'}">
                    Semanal
                </button>
                <button class="rounded-full px-3 py-1 text-sm {timeFrame === 'Mensual' ? 'bg-green-100 text-green-800' : 'text-gray-600'}">
                    Mensual
                </button>
                <button class="rounded-full px-3 py-1 text-sm {timeFrame === 'Anual' ? 'bg-green-100 text-green-800' : 'text-gray-600'}">
                    Anual
                </button>
            </div>
        </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-12 gap-6">
        <!-- Left Column -->
        <div class="col-span-3 space-y-6">
            <!-- Recommendations -->
            <div class="rounded-xl border bg-green-50 p-4">
                <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-medium">Recomendaciones</h3>
                    <button class="rounded-full bg-white p-1">
                        <Check class="h-4 w-4 text-green-600" />
                    </button>
                </div>
                <div class="space-y-3">
                    {#each recommendations as rec}
                        <p class="text-sm text-gray-600">{rec}</p>
                    {/each}
                </div>
            </div>

            <!-- TurboPro -->
            <div class="rounded-xl border bg-white p-4">
                <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-medium">TurboPro</h3>
                    <span class="rounded-full bg-gray-100 px-2 py-1 text-xs">4</span>
                </div>
                <div class="space-y-3">
                    {#each turboPro as item}
                        <p class="text-sm text-gray-600">{item}</p>
                    {/each}
                </div>
            </div>

            <!-- Today's Tasks -->
            <div class="rounded-xl border bg-white p-4">
                <h3 class="mb-4 font-medium">Hábitos Hoy</h3>
                <div class="space-y-3">
                    {#each todayTasks as task}
                        <div class="flex items-center gap-2">
                            <input type="checkbox" class="rounded border-gray-300" />
                            <p class="text-sm text-gray-600">{task}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Center Column -->
        <div class="col-span-6 space-y-6">
            <!-- Statistics -->
            <div class="rounded-xl border bg-white p-6">
                <h3 class="mb-4 font-medium">Estadísticas</h3>
                <div class="mb-4 flex justify-between">
                    <button class="text-sm font-medium text-gray-600">Acciones</button>
                    <button class="text-sm font-medium text-gray-600">Pensamientos</button>
                    <button class="text-sm font-medium text-gray-600">Relatos</button>
                    <button class="text-sm font-medium text-green-600">Situaciones por Mejorar</button>
                </div>

                <!-- Statistics Section -->
                <div class="mb-6">
                    <div class="mb-2 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="h-4 w-4 rounded-full border-2 border-blue-900"></div>
                            <span class="text-sm text-blue-900">Concluidos</span>
                        </div>
                        <span class="font-medium text-blue-900">33</span>
                    </div>
                    <div class="mb-2 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="h-4 w-4 rounded-full border-2 border-blue-500"></div>
                            <span class="text-sm text-blue-500">Activos</span>
                        </div>
                        <span class="font-medium text-blue-500">51</span>
                    </div>
                    <div class="mb-2 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="h-4 w-4 rounded-full border-2 border-blue-200"></div>
                            <span class="text-sm text-blue-200">No activos:</span>
                        </div>
                        <span class="font-medium text-blue-200">15</span>
                    </div>
                    <div class="flex items-center justify-between border-t pt-2">
                        <div class="flex items-center gap-2">
                            <div class="h-4 w-4"></div>
                            <span class="font-medium">Total:</span>
                        </div>
                        <span class="font-medium">98</span>
                    </div>
                </div>

                <!-- Chart -->
                <div class="h-64 w-full"> <!-- Increased height from h-48 to h-64 -->
                    <div class="flex h-full items-end justify-between">
                        <div class="flex gap-2">
                            <div class="w-8 rounded-t-lg bg-alineados-blue-900" style="height: 75%">
                                <div class="mt-2 text-center text-xs text-white">10</div>
                            </div>
                            <div class="w-8 rounded-t-lg bg-alineados-blue-500" style="height: 85%">
                                <div class="mt-2 text-center text-xs text-white">20</div>
                            </div>
                            <div class="w-8 rounded-t-lg bg-alineados-blue-200" style="height: 35%">
                                <div class="mt-2 text-center text-xs text-white">2</div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <div class="w-8 rounded-t-lg bg-alineados-blue-900" style="height: 65%">
                                <div class="mt-2 text-center text-xs text-white">8</div>
                            </div>
                            <div class="w-8 rounded-t-lg bg-alineados-blue-500" style="height: 70%">
                                <div class="mt-2 text-center text-xs text-white">11</div>
                            </div>
                            <div class="w-8 rounded-t-lg bg-alineados-blue-200" style="height: 25%">
                                <div class="mt-2 text-center text-xs text-white">1</div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <div class="w-8 rounded-t-lg bg-alineados-blue-900" style="height: 80%">
                                <div class="mt-2 text-center text-xs text-white">15</div>
                            </div>
                            <div class="w-8 rounded-t-lg bg-alineados-blue-500" style="height: 85%">
                                <div class="mt-2 text-center text-xs text-white">20</div>
                            </div>
                            <div class="w-8 rounded-t-lg bg-alineados-blue-200" style="height: 70%">
                                <div class="mt-2 text-center text-xs text-white">12</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-2 flex justify-between">
                    <span class="text-sm text-gray-600">2024</span>
                    <span class="text-sm text-gray-600">2025</span>
                    <span class="text-sm text-gray-600">2026</span>
                </div>
            </div>

            <!-- Calendar -->
            <div class="rounded-xl border bg-white p-6">
                <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-medium">Racha</h3>
                    <div class="flex items-center gap-2">
                        <button class="rounded-lg p-1 hover:bg-gray-100">
                            <ChevronLeft class="h-5 w-5" />
                        </button>
                        <span class="text-sm">2025</span>
                        <button class="rounded-lg p-1 hover:bg-gray-100">
                            <ChevronRight class="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <!-- Calendar grid would go here -->
                <div class="grid grid-cols-7 gap-1">
                    {#each ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as day}
                        <div class="text-center text-sm font-medium text-gray-600">{day}</div>
                    {/each}
                    {#each Array(35) as _, i}
                        {@const intensity = Math.floor(Math.random() * 4)} <!-- 0: none, 1: light, 2: medium, 3: dark -->
                        <div class="aspect-square rounded-sm {intensity === 0 ? 'bg-gray-100' : 
                            intensity === 1 ? 'bg-green-200' : 
                            intensity === 2 ? 'bg-green-400' : 
                            'bg-green-600'}" />
                    {/each}
                </div>
            </div>
        </div>

        <!-- Right Column -->
        <div class="col-span-3 space-y-6">
            <!-- Performance Chart -->
            <div class="rounded-xl border bg-white p-6">
                <div class="mb-4 flex items-center justify-between">
                    <h3 class="font-medium">Rendimiento General</h3>
                    <button class="rounded-full bg-gray-100 px-2 py-1 text-xs">Gráfica</button>
                </div>
                <!-- Radar chart would go here -->
                <div class="h-48 w-full bg-gray-50" />
            </div>

            <!-- Legacy Section -->
            <div class="rounded-xl border bg-white p-6">
                <h3 class="mb-6 font-medium">Tu Legado</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Nivel A</span>
                        <span class="text-sm font-medium">100</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Nivel B</span>
                        <span class="text-sm font-medium">50</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Nivel C</span>
                        <span class="text-sm font-medium">20</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Nivel D</span>
                        <span class="text-sm font-medium">10</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm">Nivel E</span>
                        <span class="text-sm font-medium">5</span>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-4">
                    <div class="rounded-lg border p-3 text-center">
                        <span class="text-xs text-gray-600">Donar tiempo</span>
                        <p class="font-medium">0</p>
                        <span class="text-xs text-gray-400">Acumulado</span>
                    </div>
                    <div class="rounded-lg border p-3 text-center">
                        <span class="text-xs text-gray-600">Subir testimonio</span>
                        <p class="font-medium">0</p>
                        <span class="text-xs text-gray-400">Acumulado</span>
                    </div>
                    <div class="rounded-lg border p-3 text-center">
                        <span class="text-xs text-gray-600">Referir amistades</span>
                        <p class="font-medium">4</p>
                        <span class="text-xs text-gray-400">Acumulado</span>
                    </div>
                    <div class="rounded-lg border p-3 text-center">
                        <span class="text-xs text-gray-600">Donar económicamente</span>
                        <p class="font-medium">0</p>
                        <span class="text-xs text-gray-400">Acumulado</span>
                    </div>
                </div>

                <div class="mt-4 text-center">
                    <p class="text-xs text-gray-400">Las acciones con esta tonalidad son obligatorias en esta etapa, sin realizarlas no se podrá avanzar</p>
                </div>
            </div>
        </div>
    </div>
</div>