<script lang="ts">
    let { title = '' }: { title: string } = $props();
</script>

<section class="space-y-4">
    <h2 class="text-2xl font-bold text-alineados-blue-900">{title}</h2>
    <div class="space-y-2">
        <slot />
    </div>
</section>