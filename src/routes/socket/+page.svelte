<script lang="ts">
	import { SocketService } from '$lib/services/socket';
	import { Socket, type Channel } from 'phoenix';
	import { onMount } from 'svelte';

	let socket: SocketService;

	onMount(() => {
		// channels
		socket = new SocketService('123456');

		return () => {
			socket.disconnect();
		};
	});
</script>

<button
	onclick={() => {
		socket.push('autosave_pc', '{data:"data"}');
	}}
>
	Send data
</button>
