<script lang="ts">
	export let progress = 80;
	export let state: 'default' | 'stable' | 'warning' | 'danger' = 'default';
</script>

<div class="relative w-full rounded-xl bg-alineados-gray-50 py-4">
	<div
		class="absolute left-0 top-0 h-full rounded-lg"
		style="width: {progress}%;"
		class:stable={state === 'stable'}
		class:warning={state === 'warning'}
		class:danger={state === 'danger'}
	></div>
	<p
		class="progress-text relative z-10 text-center text-sm font-semibold"
		style="background: linear-gradient(to right, white 0%, white {progress -
			1}%, #222222 {progress -
			1}%, #222222 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
	>
		{progress}%
	</p>
</div>

<style>
	.stable {
		background-color: #0f172a;
	}
	.warning {
		background-color: #e8a205;
	}
	.danger {
		background-color: #d64545;
	}
</style>
