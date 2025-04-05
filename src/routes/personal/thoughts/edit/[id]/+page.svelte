<script lang="ts">
    import { beforeNavigate } from '$app/navigation';
    import AlertDialog from '$lib/components/AlertDialog.svelte';
	import PersonalHeader from '$lib/modules/personal/PersonalHeader.svelte';
	import PersonalSelect from '$lib/modules/personal/PersonalSelect.svelte';
	import { Pillars } from '$lib/interfaces/data';
	import MultiEditable from '$lib/modules/personal/MultiEditable.svelte';
	import ThoughtHeader from '$lib/modules/personal/thoughts/ThoughtHeader.svelte';
	import type { PageProps } from './$types';
	import type { DataPillar, Thought } from '$lib/interfaces';
	import { thoughtState, pillarState, purposesState } from '$lib/stores';
	import Toggle from '$lib/components/Toggle.svelte';
	import { onMount } from 'svelte';
	import { SocketService } from '$lib/services/socket';
	import { browser } from '$app/environment';

	let { data }: PageProps = $props();

	const { thought }: { thought: Thought } = data;

	// init thought state
	thoughtState.init(thought);

	// Autosalve
	let socket: SocketService;
	// onmout
	onMount(() => {
		if (browser) {
			socket = new SocketService(thoughtState.id);
		}

		return () => {
			socket.disconnect();
		};
	});

	let timeout: ReturnType<typeof setTimeout>;
	let autosave: boolean = $state(false);

	// autosave
	$effect(() => {
		if (thoughtState.thoughtChanged) {
			clearTimeout(timeout);
			autosave = true;
			thoughtState.autosave = true;
			timeout = setTimeout(() => {
				socket.push('autosave_thought', thoughtState.thoughtChanged as string);

				autosave = false;
				thoughtState.autosave = false;
			}, 2000);
		}
	});

	// Add thought type determination using $state
	let thoughtType = $state('');

	// Update thoughtType when quality_time changes
	$effect(() => {
		if (thoughtState.quality_time.text) {
			thoughtType = 'text';
		} else if (thoughtState.quality_time.audio) {
			thoughtType = 'audio';
		} else if (thoughtState.quality_time.documents?.length > 0) {
			thoughtType = 'document';
		} else {
			thoughtType = '';
		}
	});

	// Functions
	function handlePillars(value: string) {
		const [pillar_name] = value.split('-');

		const pillar: DataPillar = pillarState[pillar_name as keyof typeof Pillars];

		thoughtState.setPillar(pillar);
	}

	function handlePurposes(value: string) {
		const [purpose_name] = value.split('-');
		const purpose = purposesState.getPurposeByName(purpose_name);
		if (purpose) {
			thoughtState.setPurpose(purpose);
		}
	}

    // Add new state variables
    let showAlert = $state(false);
    let pendingNavigation = $state<any>(null);

    // Add navigation guard
    beforeNavigate(async (navigation) => {
        // Skip warning if it's a page refresh
        if (navigation.type === 'leave') return;

        // Check required fields
        if (!thoughtState.pillar_name || 
            !thoughtState.purpose_name || 
            (!thoughtState.quality_time.text && 
             !thoughtState.quality_time.audio && 
             !thoughtState.quality_time.documents?.length)) {
            showAlert = true;
            pendingNavigation = navigation;
            navigation.cancel();
            return;
        }
    });

    // Add beforeunload handler in onMount
    onMount(() => {
        if (browser) {
            socket = new SocketService(thoughtState.id);
        }

        // Add beforeunload handler
        window.addEventListener('beforeunload', (event) => {
            if (!thoughtState.pillar_name || 
                !thoughtState.purpose_name || 
                (!thoughtState.quality_time.text && 
                 !thoughtState.quality_time.audio && 
                 !thoughtState.quality_time.documents?.length)) {
                event.preventDefault();
                event.returnValue = 'Debe completar los campos requeridos para poder salir';
                return event.returnValue;
            }
        });

        return () => {
            socket.disconnect();
            window.removeEventListener('beforeunload', () => {});
        };
    });
</script>

<PersonalHeader simple={true}>
	{#snippet header()}
		<ThoughtHeader status="edit" />
	{/snippet}

	{#snippet statistics()}{/snippet}

	{#snippet filter()}{/snippet}
</PersonalHeader>

<!-- Content scrollable in Y -->
<div class="flex flex-col px-4 md:px-8 lg:px-16">
	<!-- Form -->
	<div class="mb-10 flex w-full flex-col gap-8 pt-4">
		<!-- Selects -->
		<div class="flex w-5/12 flex-col gap-6">
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Pilar</p>
				<PersonalSelect
					handleSelect={(value: string) => handlePillars(value)}
					subCategory={false}
					alreadyValue={thoughtState.pillar_name}
					list={[
						{ ...pillarState.health },
						{ ...pillarState.relational },
						{ ...pillarState.vocational },
						{ ...pillarState.spiritual }
					]}
				/>
			</div>
			<div class="flex flex-row items-center justify-between">
				<p class="text-base font-bold text-alineados-gray-900">Fin</p>
				<PersonalSelect
					subCategory={false}
					alreadyValue={thoughtState.purpose_name}
					list={purposesState.purposes}
					handleSelect={handlePurposes}
				/>
			</div>
		</div>

		<Toggle
			description="Destacar"
			bind:checked={thoughtState.is_important}
			titleStyle="text-base font-bold text-alineados-gray-900"
		/>

		<!-- Quality time -->
		<div class="flex flex-col gap-6 pb-9">
			<p class="text-base font-bold text-alineados-gray-900">Pensamiento</p>
			<MultiEditable
				type="thought"
				{thoughtType}
				bind:files={thoughtState.quality_timeDocuments}
				bind:richValue={thoughtState.quality_timeText}
				bind:titleAudio={thoughtState.quality_timeAudio.file_name}
				bind:contentAudio={thoughtState.quality_timeAudio.content!}
			/>
		</div>
	</div>
</div>

<!-- Add AlertDialog at the end of the template -->
<AlertDialog
    bind:open={showAlert}
    title="Atención"
    description="Debe completar los campos Pilar, Fin y Pensamiento antes de salir."
    cancel="Aceptar"
    action=""
    handleAction={() => {}}
    handleCancel={() => showAlert = false}
/>
