<script lang="ts">
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalStatistics from '$lib/modules/personal/PersonalStatistics.svelte';
	import StoryHeader from '$lib/modules/personal/stories/StoryHeader.svelte';
	import StoryFilter from '$lib/modules/personal/stories/StoryFilter.svelte';
	import CustomCard from '$lib/components/CustomCard.svelte';
	import StarSolid from '$lib/icons/StarSolid.svelte';
	import ThirdCube from '$lib/icons/ThirdCube.svelte';
	import ThreePeople from '$lib/icons/ThreePeople.svelte';
</script>

<PersonalHeader>
	{#snippet header()}
		<StoryHeader />
	{/snippet}

	{#snippet statistics()}
		<PersonalStatistics />
	{/snippet}

	{#snippet filter()}
		<!-- <StoryFilter /> -->
	{/snippet}
</PersonalHeader>

<div class="flex flex-col gap-12 px-4 md:px-8 lg:px-16">

	<div class="flex flex-col  gap-3">
		<p class="text-xl font-semibold text-alineados-gray-700">Testimonio</p>
	
		<div class="flex flex-row gap-5">
			{#each Array(2) as i}
				<CustomCard
					onClickCard={(e) => console.log(e)}
					isNew={false}
					state="default"
					headerClass="justify-between"
				>
					{#snippet header()}
						<div class="relative h-24 w-full">
							<img
								src=""
								alt="Ocean wave"
								class="h-full w-full rounded-t-lg bg-alineados-blue-300 object-cover"
							/>
							<button
								class="absolute right-1 top-1 rounded-full p-1 transition-colors"
								aria-label="Mark as favorite"
							>
								<StarSolid styleTw="size-5 text-alineados-gray-50 " />
							</button>
						</div>
					{/snippet}
	
					{#snippet content()}
						<div class="flex flex-col gap-4 px-4 pb-3 pt-4">
							<p class="h-14 text-base font-semibold text-alineados-blue-800">
								Nombre del testimonio
							</p>
						</div>
					{/snippet}
	
					{#snippet footer()}
						<div class="flex w-full justify-between px-4 pb-4">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<ThirdCube styleTw="size-4" />
									<span class="text-xs text-alineados-gray-700">Salud física</span>
								</div>
								<div class="flex items-center gap-2">
									<ThreePeople styleTw="size-4" />
									<span class="text-xs text-alineados-gray-700">3 involucrados</span>
								</div>
							</div>
							<span class="self-end text-xs text-alineados-gray-400">Julio 2024</span>
						</div>
					{/snippet}
				</CustomCard>
			{/each}
		</div>
	</div>

	<div class="flex flex-col  gap-3">
		<p class="text-xl font-semibold text-alineados-gray-700">Conversaciones</p>
	
		<div class="flex flex-row gap-5">
			{#each Array(3) as i}
				<CustomCard
					onClickCard={(e) => console.log(e)}
					isNew={false}
					state="default"
					headerClass="justify-between"
				>
					{#snippet header()}
						<div class="relative h-24 w-full">
							<img
								src=""
								alt="Ocean wave"
								class="h-full w-full rounded-t-lg bg-alineados-blue-300 object-cover"
							/>
							<button
								class="absolute right-1 top-1 rounded-full p-1 transition-colors"
								aria-label="Mark as favorite"
							>
								<StarSolid styleTw="size-5 text-alineados-gray-50 " />
							</button>
						</div>
					{/snippet}
	
					{#snippet content()}
						<div class="flex flex-col gap-4 px-4 pb-3 pt-4">
							<p class="h-14 text-base font-semibold text-alineados-blue-800">
								Nombre del testimonio
							</p>
						</div>
					{/snippet}
	
					{#snippet footer()}
						<div class="flex w-full justify-between px-4 pb-4">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<ThirdCube styleTw="size-4" />
									<span class="text-xs text-alineados-gray-700">Salud física</span>
								</div>
								<div class="flex items-center gap-2">
									<ThreePeople styleTw="size-4" />
									<span class="text-xs text-alineados-gray-700">3 involucrados</span>
								</div>
							</div>
							<span class="self-end text-xs text-alineados-gray-400">Julio 2024</span>
						</div>
					{/snippet}
				</CustomCard>
			{/each}
		</div>
	</div>
</div>
