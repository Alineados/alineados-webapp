
import { Socket, type Channel } from 'phoenix';


export class Phx {
	socket: Socket;
	channel: Channel | null;
	url: string
	constructor() {
		this.url = "ws://localhost:4000/socket"
		this.socket = new Socket(this.url)
		this.socket.connect()
		this.channel = null
	}
	joint(room: string, key?: string | null): Channel {
		this.channel = this.socket.channel(room, { apikey: key })
		this.channel
			.join()
			.receive('ok', (resp) => {
				// console.log('joining', resp);
			})
			.receive('error', (resp) => {
				// console.error('Unable to join', resp);
			});
		return this.channel;
	}

}


