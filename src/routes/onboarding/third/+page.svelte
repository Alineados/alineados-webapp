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

<div class="flex h-full w-full flex-col items-start justify-center">
	<div class="flex w-full flex-col gap-3">
		<h2 class="text-3xl font-semibold text-alineados_gray-900">Creación de Contraseña</h2>
		<hr class="w-full border-spacing-1 border-alineados_gray-200" />
	</div>

	<div class="mt-9 flex w-full flex-col gap-11">
		<div class="w-4/5 space-y-2">
			<Label class="text-lg font-semibold text-black" for="password">Contraseña</Label>
			<Input
				class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 text-base font-normal placeholder:text-alineados_gray-500"
				id="password"
				placeholder="Ingrese su contraseña"
				type="password"
				autocapitalize="none"
				autocorrect="off"
				disabled={isLoading}
			/>
		</div>
		<div class="w-4/5 space-y-2">
			<Label class="text-lg font-semibold text-black" for="confirm-password"
				>Confirmar Contraseña</Label
			>
			<Input
				class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 text-base font-normal placeholder:text-alineados_gray-500"
				id="confirm-password"
				placeholder="Confirme su contraseña"
				type="password"
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
</div>
