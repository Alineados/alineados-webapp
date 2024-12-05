<script lang="ts">
	import { Socket, type Channel } from 'phoenix';
	import { onMount } from 'svelte';

	let socket: Socket;
	let channel: Channel;

	function connect(): Channel {
		let channel = socket.channel(`autosave:1234567`, {});
		channel
			.join()
			.receive('ok', (resp: any) => {
				console.log('Joined successfully', resp);
			})
			.receive('error', (resp: any) => {
				console.error('Unable to join', resp);
			});
		return channel;
	}

	function disconnect() {
		if (channel) {
			channel.leave();
		}
	}

	onMount(() => {
		// channels
		// socket = new Socket('wss://backtest.authworkinglive.com/socket');
		socket = new Socket('ws://localhost:4000/socket');
		socket.connect();
		channel = connect();
		channel.on('autosave_pc_success', (response: any) => {
			console.log('autosave_pc_success', response);
		});
		return () => {
			disconnect();
		};

	});
</script>

<button
	onclick={() => {
		channel.push('autosave_pc', { data: 'Hello' });
	}}
>
	Send data
</button>
