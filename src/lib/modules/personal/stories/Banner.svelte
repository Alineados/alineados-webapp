<script lang="ts">
	import Upload from '$lib/icons/Upload.svelte';
	import alineadosImage from '$lib/assets/banner.png';
	import { storiesState, storyState } from '$lib/stores';
	let {
		imageURL,
		alt,
		edit
	}: {
		imageURL: string;
		alt: string;
		edit: boolean;
	} = $props();

	let isHovered = $state(false);

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}
</script>

<div class="relative max-w-full">
	<div
		class="relative aspect-[5/1] w-full overflow-hidden rounded-2xl"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		role="img"
		aria-label={alt}
	>
		<img
			src={imageURL === '' && storyState.bannerUrl === ''
				? alineadosImage
				: imageURL === ''
					? storyState.bannerUrl
					: imageURL}
			{alt}
			class="h-full w-full object-cover object-center"
		/>
	</div>

	{#if edit}
		<Upload
			type="story"
			storyType="banner"
			disabledBtn={true}
			changeIcon={true}
			styles="absolute right-2 top-1 transform rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110  focus:ring-1 focus:ring-alineados-green-500 focus:ring-offset-1"
			styleTw="size-6"
			acceptable="image/*"
		/>
	{/if}
</div>
