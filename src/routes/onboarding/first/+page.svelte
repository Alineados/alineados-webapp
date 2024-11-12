<script lang="ts">
	import { Input } from '$lib/shared/ui/input/index';
	import { Label } from '$lib/shared/ui/label/index';

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
		<h2 class="text-3xl font-semibold text-alineados_gray-900">Datos Personales</h2>
		<hr class="w-full border-spacing-1 border-alineados_gray-200" />
	</div>

	<div class="mt-9 flex w-full flex-col gap-11">
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="first-name">Nombre</Label>
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
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Apellido</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">País de Residencia</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">País de nacimiento</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Correo electrónico</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Fecha de Nacimiento</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
		<div class="flex gap-5">
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">Celular (Opcional)</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<div class="w-1/2 space-y-2">
				<Label class="text-lg font-semibold text-black" for="last-name">WhatsApp (Opcional)</Label>
				<Input
					class="rounded-lg border-alineados_gray-100  bg-alineados_gray-50 placeholder:text-alineados_gray-500"
					id="last-name"
					placeholder="Ej: Penados"
					type="last-name"
					autocapitalize="none"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
		</div>
	</div>
	<div class="mt-16 flex w-full justify-end">
		<button class="rounded-2xl bg-[#0FC917] px-11 py-4 text-sm font-semibold text-[#F7F7F7]"
			>Siguiente -></button
		>
	</div>
</div>
