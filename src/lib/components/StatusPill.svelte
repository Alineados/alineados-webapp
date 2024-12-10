<script lang="ts">
	let { status = $bindable(), classTw = "px-4 py-[6px] " } = $props();

</script>

<div class={`inline-flex items-center rounded-full ${classTw} 
	${status ? 'bg-alineados-green-100 text-alineados-green-900' : 'bg-red-100 text-red-600'}`}>
	<span class="text-xs font-semibold">{status ? 'Activo' : 'Inactivo'}</span>
</div>
