import { Socket, type Channel } from 'phoenix';
import { getEndpointByVenv } from './endpoints';


export class SocketService {
	private socket: Socket;
	private channel: Channel;
	private api: string = getEndpointByVenv().socket;

	constructor(id: string) {
		this.socket = new Socket(`${this.api}/socket`, {});
		this.socket.connect();
		this.channel = this.connect(id);
	}

	// methods
	connect(id: string): Channel {
		let channel = this.socket.channel(`autosave:${id}`, {});

		channel
			.join()
			.receive('ok', (resp) => {
				console.log('Joined successfully', resp);
			})
			.receive('error', (resp) => {
				console.log('Unable to join', resp);
			});

		channel.on('autosave_success_problem', (resp) => {
			// console.log('Autosave success', resp);
		});

		channel.on('autosave_success_story', (resp) => {
			console.log("Autosave success", resp);
		});

		return channel;
	}

	disconnect() {
		if (this.channel) this.channel.leave();
	}

	push(topic: string, data: string) {
		this.channel.push(topic, { body: data });
	}
}
