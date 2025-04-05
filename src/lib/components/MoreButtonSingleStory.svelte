<script lang="ts">
    import * as DropdownMenu from '$lib/shared/ui/dropdown-menu/index';
    import ThreeDots from '$lib/icons/ElipsisVertical.svelte';
    import File from '$lib/icons/File.svelte';
    import html2canvas from 'html2canvas';
    import { jsPDF } from 'jspdf';
    import { page } from '$app/stores';
	import Lock from '$lib/icons/Lock.svelte';

    async function exportToPDF() {
        // Get the entire page including navigation
        const pageContent = document.querySelector('main');
        
        if (!pageContent) {
            console.log('Elements not found:', { pageContent });
            return;
        }
        
        const container = document.createElement('div');
        container.style.backgroundColor = '#ffffff';
        container.style.width = '800px';
        container.style.fontFamily = 'Inter, system-ui, sans-serif';
        
        // Clone the entire content
        const contentClone = pageContent.cloneNode(true) as HTMLElement;
        
        // Apply styles to maintain exact layout
        const styles = document.createElement('style');
        styles.textContent = `
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .flex-row { flex-direction: row !important; }
            .gap-2 { gap: 0.5rem !important; }
            .gap-4 { gap: 1rem !important; }
            .gap-6 { gap: 1.5rem !important; }
            .pb-16 { padding-bottom: 4rem !important; }
            .pt-8 { padding-top: 2rem !important; }
            .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
            .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
            .text-3xl { font-size: 1.875rem !important; }
            .font-medium { font-weight: 500 !important; }
            .text-alineados-gray-900 { color: #111827 !important; }
            .text-alineados-blue-800 { color: #1E40AF !important; }
            .text-base { font-size: 1rem !important; }
            .font-semibold { font-weight: 600 !important; }
            .rounded-2xl { border-radius: 1rem !important; }
            .w-full { width: 100% !important; }
            .space-y-3 > * + * { margin-top: 0.75rem !important; }
            .size-6 { width: 1.5rem !important; height: 1.5rem !important; }
            .items-center { align-items: center !important; }
            svg { display: inline-block !important; vertical-align: middle !important; }
            img { max-width: 100% !important; height: auto !important; }
            .banner { width: 100% !important; max-height: 300px !important; object-fit: cover !important; }
            .justify-between { justify-content: space-between !important; }
            .items-start { align-items: flex-start !important; }
            button { display: inline-flex !important; align-items: center !important; }
            .text-yellow-400 { color: #FBBF24 !important; }
            .text-lg { font-size: 1.125rem !important; }
            .breadcrumb { display: flex !important; gap: 0.5rem !important; color: #6B7280 !important; }
            .breadcrumb-item { color: #6B7280 !important; }
            .breadcrumb-item:last-child { color: #FBBF24 !important; }
        `;
        container.appendChild(styles);
        container.appendChild(contentClone);
        
        document.body.appendChild(container);
        
        try {
            const canvas = await html2canvas(container, {
                scale: 2,
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
            pdf.save('alineados-relato.pdf');
        } finally {
            document.body.removeChild(container);
        }
    }
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger class="-ml-1" aria-label="More">
        <ThreeDots styleTw="size-6" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="z-50 bg-alineados-gray-100">
        <DropdownMenu.Item
            onclick={exportToPDF}
            class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
        >
            <File class="mt-0.5" />
            <span class="font-normal">Exportar</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item
			class="bg-white hover:cursor-pointer hover:bg-alineados-gray-100"
		>
			<Lock class="mt-0.5" />
			<span class="font-normal">
					Bloquear
			</span>
		</DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
