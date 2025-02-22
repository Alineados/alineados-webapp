<script lang="ts">
	interface Props {
		name: string;
		description: string;
		children: any;
		checked: boolean;
	}

	let { children, name, checked = $bindable(), description }: Props = $props();
</script>

<div class="flex w-full items-center justify-between">
	<!-- Label -->
	<div class="flex items-center gap-5 text-stone-500">
		<div class="flex h-fit w-fit items-center justify-center rounded-full bg-stone-100 p-2">
			{@render children()}
		</div>
		<div class="flex flex-col">
			<!-- Label text -->
			<div class="flex items-center gap-1 text-stone-800">
				<label class="text-base font-medium" for="name">{name}</label>
			</div>
			<!-- Description -->
			<p>{description}</p>
		</div>
	</div>

	<!-- Toggle -->
	<label class="relative inline-flex cursor-pointer items-center">
		<input bind:checked type="checkbox" class="peer sr-only" />
		<div
			class="peer h-6 w-11 rounded-full bg-gray-200
             after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full
             after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']
             peer-checked:bg-stone-600 peer-checked:after:translate-x-full peer-checked:after:border-white
             peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300
             dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-stone-800"
		></div>
	</label>
</div>
