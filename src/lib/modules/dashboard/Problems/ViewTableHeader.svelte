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
	class="top-0 grid rounded-t-xl border border-alineados-gray-100 bg-alineados-gray-50"
	style="grid-template-columns: 2fr 3fr 3fr;"
>
	<p class="px-6 py-3 text-left text-base font-medium text-alineados-orange-900">
		Nombre Identificativo
	</p>
	<p class="px-6 py-3 text-left text-base font-medium text-alineados-orange-900">
		{firstCriterionLabel}
	</p>
	<p class="px-6 py-3 text-left text-base font-medium text-alineados-orange-900">
		{secondCriterionLabel}
	</p>
</div>
