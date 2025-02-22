import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

type Hash = {
	iv: string;
	content: string;
};

export class Encrypt {
	algorithm: string = 'aes-256-cbc';
	secretKey: Buffer;
	iv: Buffer = randomBytes(16);

	constructor(secretKey: string) {
		this.secretKey = Buffer.from(secretKey, 'hex');
	}

	encrypt = (text: string | null) => {
		if (!text) throw Error('error in Encrypt.encrypt, no text parameter was provided');
		const cipher = createCipheriv(this.algorithm, this.secretKey, this.iv);
		let encrypted = cipher.update(text, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		return {
			iv: this.iv.toString('hex'),
			content: encrypted
		};
	};

	decrypt = (hash: Hash | null): string => {
		if (!hash) throw Error('encripter.decrypt, hash parameter is null');
		const decipher = createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));
		let decrypted = decipher.update(hash.content, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	};

	getHashFromCookie(cookie: string | undefined): Hash | null {
		if (cookie?.split('$')) {
			const [iv, content] = cookie?.split('$');
			return { iv, content };
		} else return null;
	}
}
