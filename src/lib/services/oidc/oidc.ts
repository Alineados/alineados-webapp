import type { Config, ClientCredentialsToken } from '../../interfaces';

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

    async logout(id: string, userType: string = 'doctors') {
        const res = await fetch(`${this.config.issuer}/users/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                org: userType
            })
        });
        const data = await res.json();
        return data;
    }



    async sendResetPassword(org: string, clientID: string, email: string) {
        console.log(
            JSON.stringify({
                to: email,
                org: org,
                client_id: clientID
            })
        );
        const res = await fetch(`${this.issuer}/users/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: email,
                org: org,
                client_id: clientID
            })
        });

        if (res.status == 200) {
            const response = await res.json();
            return { response, status: 200 };
        } else {
            // const response = await res.json();
            // console.log(response);
            // console.error(await res.text());
            // return { response: await res.text(), status: 400 };

            return {
                response: JSON.stringify({ message: 'error in send reset passwords' }),
                status: 400
            };
        }
    }

    async changePassword(org: string, uid: string, password: string) {
        const res = await fetch(`${this.issuer}/users/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                org,
                uid,
                password
            })
        });
        if (res.status == 200) {
            const response = await res.json();
            return { response, status: 200 };
        } else {
            console.error(await res.text());
            throw new Error(await res.text());
        }
    }
}
