<script lang="ts">
	import CircleCheck from '$lib/icons/CircleCheck.svelte';
	import { Confetti } from 'svelte-confetti';
	import {
		changeReportProblem,
		problemCard,
		problemReadyToComplete,
		reportProblem,
		problemInfo,
		isCompleteProblem
	} from '$lib/stores';
	import { toast } from 'svelte-sonner';



	// Check if a final decision is selected
    const hasFinalDecision = $derived(!!$problemInfo.final_decision);

	let { disabled = false } = $props();

	// Combine the disabled state with the final decision check
    const isDisabled = $derived(disabled || !hasFinalDecision);

    function handleClick() {
        if (!hasFinalDecision) return;
        changeReportProblem($reportProblem === 2 ? 1 : 2);
    }

	function onChangeReportPage(value: number) {
		if ($problemInfo.action_plan.length === 1 && $problemInfo.action_plan[0].description === '') {
			toast.warning('Por favor, agrega al menos un plan de acción antes de continuar.', {
				duration: 3000
			});

			return;
		}
		changeReportProblem(value);
	}

	let showConfetti = $state(false);

	function onCompleteProblem() {
		showConfetti = true;
		isCompleteProblem(true);
		setTimeout(() => {
			showConfetti = false;
		}, 5000);
	}
</script>

<!-- <a
	href="https://forms.office.com/r/huDFV67VZB"
	target="_blank"
	class="flex flex-row items-center gap-2 rounded-lg border bg-alineados-orange-800 px-4 py-3 text-sm text-white transition duration-300 ease-in-out hover:shadow-lg"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-5"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
		/>
	</svg>

	Reportar incidentes
</a> -->

<!-- <button
	onclick={() => onChangeReportPage(2)}
	disabled={!$problemCard.active}
	class:bg-alineados-blue-500={!$problemCard.active}
	class:bg-alineados-blue-900={$problemCard.active}
	class:hover:bg-alineados-blue-900={$problemCard.active}
	class="focus group flex items-center gap-[6px] rounded-lg px-4 py-3 text-white transition duration-300 ease-in-out hover:shadow-lg"
	aria-label="Rendir Cuentas"
>
	<CircleCheck styleTw="size-4" />
	<p class="text-sm font-medium">
		{#if $reportProblem === 2}
			Regresar
		{:else}
			Rendir Cuentas
		{/if}
	</p>
</button> -->

<button
    onclick={handleClick}
    disabled={isDisabled}
    class:bg-alineados-blue-500={isDisabled}
    class:bg-alineados-blue-900={!isDisabled}
    class:hover:bg-alineados-blue-900={!isDisabled}
    class="focus group relative flex items-center gap-[6px] rounded-lg px-4 py-3 text-white transition duration-300 ease-in-out hover:shadow-lg disabled:cursor-not-allowed"
    aria-label="Rendir Cuentas"
>
    <CircleCheck styleTw="size-4" />
    <p class="text-sm font-medium">
        {#if $reportProblem === 2}
            Regresar
        {:else}
            Rendir Cuentas
        {/if}
    </p>

    {#if !hasFinalDecision}
        <div class="invisible absolute top-full left-1/2 -translate-x-1/2 mt-2 group-hover:visible z-[9999]">
            <div class="whitespace-nowrap rounded-lg bg-gray-600 px-6 py-4 text-sm text-white text-center">
                Debe seleccionar una decisión final antes de rendir cuentas
            </div>
        </div>
    {/if}
</button>

<!-- {#if $reportProblem === 2}
	<button
		onclick={onCompleteProblem}
		disabled={!$problemReadyToComplete}
		class:bg-alineados-green-500={!$problemCard.active}
		class:bg-alineados-green-800={$problemCard.active && $problemReadyToComplete}
		class:bg-alineados-green-600={$problemCard.active && !$problemReadyToComplete}
		class:hover:bg-alineados-green-700={$problemCard.active && $problemReadyToComplete}
		class="focus group flex items-center gap-[6px] rounded-lg px-4 py-3 text-white transition duration-300 ease-in-out hover:shadow-lg disabled:opacity-50"
		aria-label="Confirmar"
	>
		<CircleCheck styleTw="size-4" />
		<p class="text-sm font-medium">Confirmar</p>
	</button>
{/if} -->

<!-- <div
	style="
 position: fixed;
 top: -50px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;"
>
	{#if showConfetti}
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 2000]}
			infinite
			amount={1000}
			fallDistance="100vh"
		/>
	{/if}
</div> -->
