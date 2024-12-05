<script>
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index';
	import ThreeDots from '$lib/icons/ElipsisVertical.svelte';
</script>


<DropdownMenu.Root >
	<DropdownMenu.Trigger class="-ml-1" aria-label="More">
		<ThreeDots styleTw="size-6" />
	</DropdownMenu.Trigger>
	<!-- Content -->
	<DropdownMenu.Content class="bg-alineados-gray-100 z-50">
		<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
			<span class="font-normal">Desactivar</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
			<span class="font-normal">Bloquear</span>
		</DropdownMenu.Item>
		<!--Content group -->
		<DropdownMenu.Group>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100">
					<span class="font-normal">Descargar</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent class="bg-alineados-gray-100">
					<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
						<span class="font-normal">Descargar xlsx</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
						<span class="font-normal">Descargar pdf</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
