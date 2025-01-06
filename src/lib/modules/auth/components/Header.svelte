<script lang="ts">
	let { title, description }: { title: string; description: string } = $props();
</script>

<div class="flex flex-col gap-6">
	<h1 class="text-2xl font-medium text-black">
		{title}
	</h1>
	<p class="text-xs font-medium text-alineados-gray-800">
		{description}
	</p>
</div>
