export interface Config {
    issuer: string;
    clientID?: string;
    clientSecret?: string;
    codeVerifier?: string;
    codeChallenge?: string;
    publicRedirectURI?: string;
}

export type ClientCredentialsToken = {
    access_token: string,
    expires_in: string,
    token_type: string
}

export type Session = {
    access_token: string;
    expires_in: string;
    id_token: string;
    refresh_token: string;
    scope: string;
};
export type SessionError = {
    error: string;
    error_description: string;
};

export type Profile = {
    user: any
};

export type SessionUserInfo = {
    sub: string;
    profile: Profile;
    email: string;
};

export type SessionInfoError = {
    error: string;
    error_description: string;
};

export type AuthorizationUrl = string;
