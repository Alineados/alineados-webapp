import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

type Hash = {
    iv: string;
    content: string;
    tag?: string;
};

export class Encrypt {
    algorithm: string = 'aes-256-gcm';
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
        const tag = cipher.getAuthTag().toString('hex');

        // For session compatibility, combine content and tag
        const combinedContent = encrypted + tag;

        return {
            iv: this.iv.toString('hex'),
            content: combinedContent
        };
    };

    decrypt = (hash: Hash | null): string => {
        if (!hash) throw Error('encripter.decrypt, hash parameter is null');

        // Split combined content back into ciphertext and tag
        const encrypted = hash.content.slice(0, -32); // GCM tag is 16 bytes (32 hex chars)
        const tag = hash.content.slice(-32);

        const decipher = createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));
        decipher.setAuthTag(Buffer.from(tag, 'hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
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
