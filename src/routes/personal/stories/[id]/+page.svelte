<script lang="ts">
	import Banner from '$lib/modules/personal/Banner.svelte';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
</script>

<PersonalHeader simple={true}>
	{#snippet header()}
		<StoryHeader status="see" />
	{/snippet}

	{#snippet statistics()}{/snippet}

	{#snippet filter()}{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col px-4 md:px-8 lg:px-16">
	<!-- Image upload -->
	<Banner
		imageURL="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VARoRKXUzQbegeeDDHADCUHMWzKVe7.png"
		alt="Prueba"
		edit={false}
	/>

	<!-- Form -->
</div>
