<script lang="ts">
	import DirectoryUpload from "$lib/icons/DirectoryUpload.svelte";

	const uploadedFiles = [
		{ name: 'assets.docx', size: '5.3MB' },
		{ name: 'assets.docx', size: '5.3MB' },
		{ name: 'theprojetks-design-tokens.pdf', size: '5.3MB' }
	];
</script>

<div class="w-full py-2 px-6">
	<!-- Drop Zone -->
	<div class="rounded-lg border-2 border-dashed border-alineados-gray-300 p-8 text-center">
		<div class="flex flex-col items-center gap-4">
			<!-- Upload Icon -->
			<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-alineados-green-100">
                <DirectoryUpload />
			</div>

			<!-- Upload Text -->
			<p class="text-alineados-gray-600 text-sm font-medium">Arrastra tus archivos aca para inciar</p>

			<!-- Divider -->
			<div class="flex w-full max-w-xs items-center gap-4">
				<div class="h-[1px] flex-1 bg-alineados-gray-200"></div>
				<span class="text-xl text-alineados-gray-400">o</span>
				<div class="h-[1px] flex-1 bg-alineados-gray-200"></div>
			</div>

			<!-- Browse Button -->
			<button
				class="rounded-xl border-2 border-alineados-green-500 px-6 py-2 font-bold  text-alineados-green-500 transition-colors hover:bg-alineados-green-50"
			>
				Explorar archivos
			</button>
		</div>
	</div>

	<!-- Uploaded Files Section -->
	<div class="mt-8">
		<h2 class="mb-2 text-xl font-semibold">Archivos subidos</h2>
		<p class="mb-4 text-sm text-alineados-gray-500">Archivos compatibles jpg, png, pdf, docx, xlsx, pptx</p>

		<!-- File List -->
		<div class="space-y-3">
			{#each uploadedFiles as file}
				<div
					class="flex items-center justify-between rounded-xl border border-alineados-gray-100 bg-white p-4"
				>
					<div class="flex items-center gap-3">
						<div class="relative">
							<!-- File Icon -->
							<div class="flex h-10 w-10 items-center justify-center rounded bg-blue-50">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-blue-500"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
									<polyline points="13 2 13 9 20 9" />
								</svg>
							</div>
							<!-- ZIP Badge -->
							<span
								class="absolute -bottom-1 -right-1 rounded bg-blue-500 px-1 text-[10px] text-white"
							>
								ZIP
							</span>
						</div>
						<div>
							<p class="font-medium">{file.name}</p>
							<p class="text-sm text-alineados-gray-500">{file.size}</p>
						</div>
					</div>

					<!-- Remove Button -->
					<button
						class="rounded-full p-2 text-alineados-gray-400 transition-colors hover:bg-alineados-gray-100 hover:text-alineados-gray-600"
						aria-label="Remove file"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>
