<script lang="ts">
	import House from 'lucide-svelte/icons/house';
	import User from 'lucide-svelte/icons/user';
	import Users from 'lucide-svelte/icons/users';
	import CircleFadingArrowUp from 'lucide-svelte/icons/circle-fading-arrow-up';
	import CircleHelp from 'lucide-svelte/icons/circle-help';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Settings from 'lucide-svelte/icons/settings';
	import CircleUserRound from 'lucide-svelte/icons/circle-user-round';
	import * as Sidebar from '$lib/shared/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/shared/ui/avatar/index.js';
	import AlineadosCheck from '$lib/icons/AlineadosCheck.svelte';

	import { useSidebar } from '$lib/shared/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	const sidebar = useSidebar();

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	let user = {
		name: 'José Penagos',
		email: 'jose_example@gmail.com',
		avatar:
			'https://img2.wallspic.com/previews/3/0/5/7/5/157503/157503-rick_and_morty-rick_sanchez-morty_smith-jerry_smith-natacion_para_adultos-x750.jpg'
	};
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					{#snippet child({ props })}
						<a href={'/dashboard'} {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<AlineadosCheck />
							</div>
							<div class="flex flex-col justify-center space-y-1">
								<span class="text-sm font-medium leading-none text-alineados-blue-50"
									>Alineados</span
								>
								<span class="text-[10px] font-medium leading-none text-alineados-blue-300"
									>Tu vida, tu alineación</span
								>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={'#'} {...props}>
									<House />
									<span>Inicio</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={'#'} {...props}>
									<User />
									<span>Personal</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						<Sidebar.MenuSub>
							<Sidebar.MenuSubItem>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={'#'} {...props}>
											<span>Pilares de Vida y conociendome</span>
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSubItem>
							<Sidebar.MenuSubItem>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={'#'} {...props}>
											<span>Pensamientos y Reglas de Vida</span>
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSubItem>
							<Sidebar.MenuSubItem>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={'#'} {...props}>
											<span>Testimonios y Organización</span>
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSubItem>
						</Sidebar.MenuSub>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={'#'} {...props}>
									<Users />
									<span>Relaciones</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						<Sidebar.MenuSub>
							<Sidebar.MenuSubItem>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={'#'} {...props}>
											<span>Personas</span>
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSubItem>
							<Sidebar.MenuSubItem>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={'#'} {...props}>
											<span>Compañer@ de vida</span>
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSubItem>
						</Sidebar.MenuSub>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={'#'} {...props}>
									<CircleFadingArrowUp />
									<span>Situaciones por mejorar</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a href={'#'} {...props}>
									<CircleHelp />
									<span>Ayuda a Alineados</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								{...props}
							>
								<Avatar.Root class="h-8 w-8 rounded-lg">
									<Avatar.Image
										src={'https://img2.wallspic.com/previews/3/0/5/7/5/157503/157503-rick_and_morty-rick_sanchez-morty_smith-jerry_smith-natacion_para_adultos-x750.jpg'}
										alt={'José Penados'}
									/>
									<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
								</Avatar.Root>
								<div class="flex flex-col justify-center space-y-1">
									<span class="text-xs font-medium leading-none text-alineados-blue-50"
										>José Penagos</span
									>
									<span class="text-[10px] font-medium leading-none text-alineados-blue-300"
										>jose_example@gmail.com</span
									>
								</div>
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>

					<DropdownMenu.Content
						side={sidebar.isMobile ? 'bottom' : 'right'}
						class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg bg-alineados-gray-100"
						align="end"
						sideOffset={4}
					>
						<DropdownMenu.Label class="bg-white p-0 font-normal">
							<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar.Root class="h-8 w-8 rounded-lg">
									<Avatar.Image src={user.avatar} alt={user.name} />
									<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
								</Avatar.Root>
								<div class="grid flex-1 text-left text-sm leading-tight text-black">
									<span class="truncate font-semibold">{user.name}</span>
									<span class="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenu.Label>

						<DropdownMenu.Separator class="h-0" />

						<DropdownMenu.Group class="bg-alineados-gray-200">
							<DropdownMenu.Item class="bg-white">
								<div class="flex items-center gap-1 text-black">
									<CircleUserRound />
									<span class="truncate text-sm">Cuenta</span>
								</div>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="bg-white">
								<div class="flex items-center gap-1 text-black">
									<Settings />
									<span class="truncate text-sm">Configuración</span>
								</div>
							</DropdownMenu.Item>
						</DropdownMenu.Group>

						<DropdownMenu.Separator class="h-0" />

						<DropdownMenu.Group class="bg-alineados-gray-200">
							<DropdownMenu.Item class="bg-white">
								<div class="flex items-center gap-1 text-black">
									<LogOut />
									<span class="truncate text-sm">Cerrar Sesión</span>
								</div>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
