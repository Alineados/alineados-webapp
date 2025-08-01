<script lang="ts">
	let {
		firstCriterionLabel,
		secondCriterionLabel
	}: {
		firstCriterionLabel: string;
		secondCriterionLabel: string;
	} = $props();
</script>

<div
	class="top-0 grid rounded-t-xl border border-alineados-orange-900 bg-alineados-orange-600"
	style="grid-template-columns: 2fr 3fr 3fr;"
>
	<p class="px-6 py-3 text-left text-base font-bold">
		Nombre Identificativo
	</p>
	<p class="px-6 py-3 text-left text-base font-bold">
		{firstCriterionLabel}
	</p>
	<p class="px-6 py-3 text-left text-base font-bold">
		{secondCriterionLabel}
	</p>
</div>
