<script lang="ts">
	import Document from '$lib/icons/Document.svelte';
	import Microphone from '$lib/icons/Microphone.svelte';

	import EditableButton from './EditableButton.svelte';

	import DocumentText from '$lib/icons/DocumentText.svelte';

	let editType = $state<{
		text: boolean;
		audio: boolean;
		document: boolean;
	}>({
		text: true,
		audio: false,
		document: false
	});

	function handleOnChange(type: keyof typeof editType) {
		console.log(type);

		editType.text = false;
		editType.audio = false;
		editType.document = false;

		editType[type] = true;
	}
</script>

<div class="flex w-full flex-col gap-3">
	<!-- Editable options -->
	<div class="flex flex-row gap-3">
		<EditableButton
			onClick={() => handleOnChange('text')}
			title="Texto"
			bind:isActive={editType.text}
		>
			<DocumentText
				styleTw={`size-6 ${editType.text ? 'text-alineados-green-900' : 'text-alineados-gray-900'} `}
			/>
		</EditableButton>
		<EditableButton
			onClick={() => handleOnChange('audio')}
			title="Audio"
			bind:isActive={editType.audio}
		>
			<Microphone
				styleTw={`size-6 ${editType.audio ? 'text-alineados-green-900' : 'text-alineados-gray-900'} `}
			/>
		</EditableButton>
		<EditableButton
			onClick={() => handleOnChange('document')}
			title="Documento"
			bind:isActive={editType.document}
		>
			<Document
				styleTw={`size-6 ${editType.document ? 'text-alineados-green-900' : 'text-alineados-gray-900'} `}
			/>
		</EditableButton>
	</div>
	<!-- Content -->
</div>
