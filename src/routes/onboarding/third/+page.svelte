<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

	import Check from '$lib/icons/Checkk.svelte';
	import Cross from '$lib/icons/Cross.svelte';

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div class="flex h-full w-full flex-col items-start justify-center px-[152px]">
	<div class="flex w-full flex-col gap-3">
		<h2 class="text-3xl font-semibold text-alineados_gray-900">Creación de Contraseña</h2>
		<hr class="w-full border-spacing-1 border-alineados_gray-200" />
	</div>

	<div class="mt-9 flex w-full flex-col gap-12">
		<div class="w-4/5 space-y-2">
			<Label class="text-lg font-semibold text-black" for="first-name">Contraseña</Label>
			<Input
				class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
				id="first-name"
				placeholder="Ej: José"
				type="first-name"
				autocapitalize="none"
				autocorrect="off"
				disabled={isLoading}
			/>
		</div>
		<div class="w-4/5 space-y-2">
			<Label class="text-lg font-semibold text-black" for="first-name">Confirmar Contraseña</Label>
			<Input
				class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
				id="first-name"
				placeholder="Ej: José"
				type="first-name"
				autocapitalize="none"
				autocorrect="off"
				disabled={isLoading}
			/>
		</div>
	</div>
	<div class="mt-4">
		<ul class="space-y-1">
			<li>
				<div class="flex items-center gap-2">
					<Cross width={18} height={18} />
					<p class="text-sm font-semibold text-alineados_gray-500">
						Fortaleza de la contraseña:
						<span class="text-[#D90D0D]">débil</span>
					</p>
				</div>
			</li>
			<li>
				<div class="flex items-center gap-2">
					<Check width={18} height={18} fill="#7BB026" />
					<p class="text-sm font-semibold text-[#7BB026]">
						No puede contener tu nombre o dirección de correo electrónicos
					</p>
				</div>
			</li>
			<li>
				<div class="flex items-center gap-2">
					<Check width={18} height={18} fill="#7BB026" />
					<p class="text-sm font-semibold text-[#7BB026]">Mínimo 8 caracteres</p>
				</div>
			</li>
			<li>
				<div class="flex items-center gap-2">
					<Check width={18} height={18} fill="#7BB026" />
					<p class="text-sm font-semibold text-[#7BB026]">Contiene un número o símbolo</p>
				</div>
			</li>
		</ul>
	</div>

	<div class="mt-16 flex w-full justify-between">
		<button
			class="flex items-center rounded-2xl border border-alineados_gray-600 px-11 py-4 text-sm font-semibold text-alineados_gray-600"
		>
			<span class="mr-2">&larr;</span> Regresar
		</button>
		<button
			class="flex items-center rounded-2xl bg-[#0FC917] px-11 py-4 text-sm font-semibold text-[#F7F7F7]"
		>
			Siguiente <span class="ml-2">&rarr;</span>
		</button>
	</div>
</div>
