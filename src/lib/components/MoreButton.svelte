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
        const titleInput = document.querySelector('input[placeholder="Título de la Situación"]');
        const problemContent = document.querySelector('.mt-9.flex.flex-col.gap-12');
        
        if (!titleInput || !problemContent) {
            console.log('Elements not found:', { titleInput, problemContent });
            return;
        }
        
        const container = document.createElement('div');
        container.style.backgroundColor = '#ffffff';
        container.style.padding = '40px';
        container.style.width = '800px'; // Reduced width for better scale
        container.style.fontFamily = 'Inter, system-ui, sans-serif';
        
        const titleDiv = document.createElement('h1');
        titleDiv.textContent = (titleInput as HTMLInputElement).value;
        titleDiv.style.fontSize = '2.25rem'; // Reduced from 3rem
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.marginBottom = '2rem';
        titleDiv.style.color = '#111827';
        container.appendChild(titleDiv);
        
        const contentClone = problemContent.cloneNode(true) as HTMLElement;
        
        // Apply styles to maintain visual hierarchy
        const styles = document.createElement('style');
        styles.textContent = `
            h2 { font-size: 1.5rem; font-weight: 500; color: #111827; margin-bottom: 1rem; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .gap-12 { gap: 3rem; }
            .gap-2 { gap: 0.5rem; }
            .items-center { align-items: center; }
            .text-alineados-gray-900 { color: #111827; }
            .mt-5 { margin-top: 1.25rem; }
        `;
        container.appendChild(styles);
        container.appendChild(contentClone);
        
        document.body.appendChild(container);
        
        try {
            const canvas = await html2canvas(container, {
                scale: 1.5, // Reduced scale for better overall view
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff',
                width: 800,
                windowWidth: 800
            });
            
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('alineados-situacion.pdf');
        } finally {
            document.body.removeChild(container);
        }
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
