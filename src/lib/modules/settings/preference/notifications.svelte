<script lang="ts">
	import { infoState } from '$lib/stores';
	import LookAndFeel from './look-and-feel.svelte';
	import NotificationOption from './notification-option.svelte';
	import Message from '$lib/icons/Message.svelte';
	import Whatsapp from '$lib/icons/Whatsapp.svelte';
	import Email from '$lib/icons/Email.svelte';
	let theme = ['claro', 'oscuro'];
	let language = ['spanish', 'english'];
</script>

<div class="flex flex-col gap-20">
	<div class="flex w-full flex-col gap-3 text-stone-500">
		<!-- avatar -->
		<div class="flex w-full flex-col gap-3">
			<!-- user information -->
			<h2 class="text-xl text-stone-800">Notificaciones</h2>
			<div class="border-b-100 border"></div>
		</div>

		<div class="flex w-full flex-col gap-4">
			{#each infoState.notification as notification}
				<NotificationOption
					bind:checked={notification.checked}
					description={notification.description}
					name={notification.label}
				>
					{#if notification.label === 'SMS'}
						<Message />
					{:else if notification.label === 'Whatsapp'}
						<Whatsapp />
					{:else if notification.label === 'Email'}
						<Email />
					{/if}
				</NotificationOption>
			{/each}
		</div>
	</div>

	<div class="flex w-full flex-col gap-3 text-stone-500">
		<!-- avatar -->
		<div class="flex w-full flex-col gap-3">
			<!-- user information -->
			<h2 class="text-xl text-stone-800">Visualización</h2>
			<div class="border-b-100 border"></div>
		</div>

		<div class="flex w-full flex-col gap-6">
			<LookAndFeel name="Apariencia" options={theme} bind:selected={infoState.theme} />
			<LookAndFeel name="Idioma" options={language} bind:selected={infoState.language} />
		</div>
	</div>
</div>
