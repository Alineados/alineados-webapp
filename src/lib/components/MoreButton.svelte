<script lang="ts">
	import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index';
	import ThreeDots from '$lib/icons/ElipsisVertical.svelte';
	import Blocked from '$lib/icons/Blocked.svelte';
	import Lock from '$lib/icons/Lock.svelte';
	import File from '$lib/icons/File.svelte';
	import { updateSecurityAndActive, problemCard } from '$lib/stores';
    import html2canvas from 'html2canvas';
    import { jsPDF } from 'jspdf';

	// Function to update
	// 1. active / inactive .....  2. security / non-security
	function handleClick(kind: number) {
		setTimeout(() => {
			updateSecurityAndActive(kind);
		}, 500);
	}

    async function exportToPDF() {
        const element = document.body; // or any specific element you want to capture
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('alineados-export.pdf');
    }
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="-ml-1" aria-label="More">
		<ThreeDots styleTw="size-6" />
	</DropdownMenu.Trigger>
	<!-- Content -->
	<DropdownMenu.Content class="z-50 bg-alineados-gray-100">
		<DropdownMenu.Item
			onclick={() => {
				if (!$problemCard.completed_at) handleClick(1);
			}}
			class={$problemCard.completed_at !== null
				? 'opacity-100'
				: 'bg-white hover:cursor-pointer hover:bg-alineados-gray-100 '}
			disabled={$problemCard.completed_at !== null}
		>
			<Blocked class="mt-0.5" />
			<span class="font-normal">
				{#if $problemCard.active}
					Desactivar
				{:else}
					Activar
				{/if}
			</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => handleClick(2)}
			class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
		>
			<Lock class="mt-0.5" />
			<span class="font-normal">
				{#if $problemCard.security}
					Desbloquear
				{:else}
					Bloquear
				{/if}
			</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
            onclick={exportToPDF}
            class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
        >
            <File class="mt-0.5" />
            <span class="font-normal">Exportar</span>
        </DropdownMenu.Item>
		<!--Content group -->
		<!-- <DropdownMenu.Group>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger class="bg-white hover:bg-alineados-gray-100 	">
					<File class="mt-0.5" />
					<span class="font-normal">Descargar</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent class="bg-alineados-gray-100">
					<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
						<File class="mt-0.5" />
						<span class="font-normal">Descargar xlsx</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100">
						<File class="mt-0.5" />
						<span class="font-normal">Descargar pdf</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Group> -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
