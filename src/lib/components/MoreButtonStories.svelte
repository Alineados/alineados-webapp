<script lang="ts">
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index';
	import ThreeDots from '$lib/icons/ElipsisVertical.svelte';
	import File from '$lib/icons/File.svelte';
	import Upload from '$lib/icons/Upload.svelte';

	function downloadTemplate() {
		const link = document.createElement('a');
		link.href = '/templates/relato-template.xlsx';
		link.download = 'plantilla-relato.xlsx';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="-ml-1" aria-label="More">
		<ThreeDots styleTw="size-6" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="z-50 bg-alineados-gray-100">
		<DropdownMenu.Item
			onclick={downloadTemplate}
			class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
		>
			<File class="mt-0.5" />
			<span class="font-normal">Descargar plantilla</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			disabled
			class="bg-white opacity-50"
		>
			<Upload class="mt-0.5" />
			<span class="font-normal">Subir plantilla</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>