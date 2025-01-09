<script lang="ts">
	import Play from '$lib/icons/Play.svelte';
	import Stop from '$lib/icons/Stop.svelte';
	import Upload from '$lib/icons/Upload.svelte';

	let audioUrl = $state('aa');
	let isPlaying = $state(false);
</script>

<div class="w-full py-4">
	<!-- Info -->
	<div class="mb-3 flex items-center justify-between">
		<button
			class="rounded-xl bg-alineados-green-900 px-6 py-2 text-white transition-colors hover:bg-alineados-green-800"
		>
			Grabar
		</button>

		<div class="flex flex-row gap-4">
			<span
				class="bg- self-center rounded-2xl bg-alineados-blue-50 px-4 py-2 text-sm font-medium text-alineados-gray-900"
				>Audio.mp4</span
			>
			<Upload
				styles=""
				changeIcon={false}
				styleTw="size-6 text-alineados-alineados-gray-600 hover:text-alineados-alineados-gray-900"
			/>
		</div>
	</div>
	<!-- Transcription -->

	<div class="rounded-lg border border-alineados-gray-200 bg-white p-6 shadow-sm">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-2xl font-bold text-alineados-gray-800">Transcripción</h2>
			{#if audioUrl}
				<button class="rounded-lg p-2 transition-colors hover:bg-alineados-gray-100">
					{#if isPlaying}
						<Stop styleTw="size-6" />
					{:else}
						<Play styleTw="size-6" />
					{/if}
				</button>
			{/if}
		</div>

		<p class="leading-relaxed font-normal text-base text-alineados-gray-800">
            Era una mañana fría y despejada cuando el grupo de excursionistas comenzó su ascenso al volcán Acatenango. El guía les advirtió que el terreno se volvería resbaladizo cerca de la cima, pero la emoción del grupo era palpable. A mitad del ascenso, las nubes comenzaron a cerrarse, y una fina llovizna transformó el suelo en un lodo traicionero.
Juan, uno de los más entusiastas, decidió adelantarse para alcanzar la cima antes que el resto. Aunque el guía le pidió que no lo hiciera, su emoción lo cegó. Mientras avanzaba por una pendiente empinada, su pie resbaló en una roca húmeda. Intentó recuperar el equilibrio, pero fue inútil. Cayó varios metros, chocando contra piedras y ramas en el camino.
El grito alertó al grupo, que corrió hacia él. Cuando lo encontraron, Juan estaba consciente pero claramente herido: tenía cortes profundos en la pierna y un brazo fracturado. El guía actuó rápidamente, inmovilizando su brazo con ramas y su camisa como cabestrillo. Comunicaron el incidente al equipo de rescate local a través de un radio.
La tormenta empeoró, dificultando la llegada de ayuda. Mientras esperaban, el grupo trabajó para mantener a Juan caliente, usando mantas y asegurándose de que permaneciera consciente. Después de horas tensas, los rescatistas lograron llegar y trasladaron a Juan en una camilla improvisada hasta un punto donde un vehículo podía recogerlo.
Aunque la experiencia dejó una marca en todos, especialmente en Juan, también les enseñó una valiosa lección: la naturaleza es hermosa pero impredecible, y siempre se debe respetar.
        </p>
	</div>
</div>
