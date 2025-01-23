import type { Config, ClientCredentialsToken } from '../../interfaces';
import { AuthService } from '../auth';

export class Oidc {
    config: Config;
    issuer: string;
    clientID: string;
    clientSecret: string;
    codeVerifier: string;
    codeChallenge: string;
    publicRedirectURI: string;

    constructor(config: Config) {
        this.config = config;
        this.issuer = config.issuer;
        this.clientID = config.clientID ?? '';
        this.clientSecret = config.clientSecret ?? '';
        this.codeVerifier = config.codeVerifier ?? '';
        this.codeChallenge = config.codeChallenge ?? '';
        this.publicRedirectURI = config.publicRedirectURI ?? '';
    }

    setConfig(config: Config) {
        this.config = config;
        this.issuer = config.issuer;
        this.clientID = config.clientID ?? '';
        this.clientSecret = config.clientSecret ?? '';
        this.codeVerifier = config.codeVerifier ?? '';
        this.codeChallenge = config.codeChallenge ?? '';
        this.publicRedirectURI = config.publicRedirectURI ?? '';
    }

    generateAuthorizationUrl() {
        if (!this.config.clientID) throw Error('clientID was not set in config');
        if (!this.config.codeChallenge) throw Error('codeChallenge was not set in con fig');
        if (!this.config.publicRedirectURI) throw Error('publicRedirectURI was not set in con fig');

        const url = new URL(this.config.issuer + '/auth');
        url.searchParams.append('client_id', this.config.clientID);
        url.searchParams.append('redirect_uri', this.config.publicRedirectURI);
        url.searchParams.append('scope', 'openid profile email');
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('response_mode', 'query');
        url.searchParams.append('code_challenge_method', 'S256');
        url.searchParams.append('code_challenge', this.config.codeChallenge);
        url.searchParams.append('state', 'og0k5bbdac');
        url.searchParams.append('nonce', 'i6imyhvo0bm');
        return url.toString();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getToken(code: string) {
        if (!this.config.clientID) throw Error('clientID was not set in config');
        if (!this.config.clientSecret) throw Error('clientSecret was not set in config');
        if (!this.config.codeVerifier) throw Error('codeVerifier was not set in config');

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', this.config.issuer);
        const urlencoded = new URLSearchParams();
        urlencoded.append('code', code);
        urlencoded.append('client_id', this.config.clientID);
        urlencoded.append('client_secret', this.config.clientSecret);
        urlencoded.append('grant_type', 'authorization_code');
        if (this.config.publicRedirectURI !== undefined) {
            urlencoded.append('redirect_uri', this.config.publicRedirectURI);
        }

        urlencoded.append('code_verifier', this.config.codeVerifier);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                // "Access-Control-Allow-Origin": issuer,
            },
            body: urlencoded.toString()
        };
        const tokenRes = await fetch(this.config.issuer + '/token', requestOptions);
        const tokenPayload = await tokenRes.json();

        return tokenPayload;
    }

    async getClientCredentialsToken(apikey: string): Promise<ClientCredentialsToken | null> {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${apikey}`
            },
            body: 'grant_type=client_credentials&scope=read'
        };

        const res = await fetch(`${this.issuer}/token`, options);

        if (res.status == 200) {
            return res.json();
        } else {
            return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getInfo(token: string) {
        const userInfoRes = await fetch(this.config.issuer + '/me', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*'
            }
        });

        if (userInfoRes.status == 401) {
            return await userInfoRes.json();
        }

        if (userInfoRes.status == 200) {
            return await userInfoRes.json();
        } else {
            return null;
        }
    }

    async logout(id: string) {
        let authService: AuthService = AuthService.getInstance('');

        const result = await authService.logout(id);

        return result;
    }



    async sendResetPassword(org: string, clientID: string, email: string) {

    }

    async changePassword(org: string, uid: string, password: string) {

    }
}
