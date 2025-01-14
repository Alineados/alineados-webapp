import type {
    AuthorizationUrl,
    Config,
    Session,
    SessionError,
    SessionInfoError,
    SessionUserInfo
} from '../../interfaces';
import { Oidc } from './oidc';
// import { Encrypt } from './encript';

export class SessionManager {
    private _session: Session | SessionError | null = null;
    private _cryptedSession: string | null = null;
    private _code: string | null = null;
    private _token: string | null = null;
    private _authURL: AuthorizationUrl | null = null;
    private _sessionInfo: SessionUserInfo | SessionInfoError | null = null;
    onboardingUrl: string | null = null;
    oidc: Oidc;
    // encrypter: Encrypt;
    constructor(config: Config) {
        this.oidc = new Oidc(config);
    }

    get authURL(): AuthorizationUrl {
        this._authURL = this.oidc.generateAuthorizationUrl();
        return this._authURL;
    }

    set code(code: string | null) {
        this._code = code;
    }

    get code(): string | null {
        return this.code;
    }

    decryptedSession(
        crypted: string | undefined,
        decrypt: (hash: { iv: string; content: string }) => any
    ): Session | AuthorizationUrl {
        if (!crypted) return this.oidc.generateAuthorizationUrl();
        const [iv, content] = crypted.split('$');
        try {
            this._session = JSON.parse(decrypt({ iv, content })) as Session;
        } catch (e) {
            console.error('error while decrypting session', e);
            return this.oidc.generateAuthorizationUrl();
        }

        if (!this._session) return this.oidc.generateAuthorizationUrl() as AuthorizationUrl;

        return this._session;
    }

    encryptSession(hash: { iv: string; content: string }): string {
        this._cryptedSession = `${hash.iv}$${hash.content}`;
        return this._cryptedSession;
    }

    async getSession(code: string | null): Promise<Session | AuthorizationUrl | null> {
        if (!code) return this.oidc.generateAuthorizationUrl();

        this._session = await this.oidc.getToken(code);
        if (this._session && 'error' in this._session) {
            console.info('grant code fail, redirect to login please');
            return this.oidc.generateAuthorizationUrl() as AuthorizationUrl;
        }

        return this._session as Session;
    }

    async getSessionInfo(session: Session): Promise<SessionUserInfo | AuthorizationUrl | null> {
        if (session && 'access_token' in session) {
            this._sessionInfo = await this.oidc.getInfo(session.access_token);

            if (this._sessionInfo && 'error' in this._sessionInfo) {
                console.info('session.access_token expired, redirecting to login page');
                return this.oidc.generateAuthorizationUrl() as AuthorizationUrl;
            }

            if (this._sessionInfo && 'sub' in this._sessionInfo && !('profile' in this._sessionInfo)) {
                // @ts-ignore
                // TODO: to correct this problem its necesarry to call close session method on healthuser class
                await this.closeSession(this._sessionInfo.sub);
                console.log("closing session, just the sub was found in authserver response, likely auth server error...")
                return this.oidc.generateAuthorizationUrl() as AuthorizationUrl;
            }
            return this._sessionInfo as SessionUserInfo;
        } else {
            console.info('No  session or session.access_token was found, redirect to login please');
            return this.oidc.generateAuthorizationUrl() as AuthorizationUrl;
        }
    }

    isAuthorizationUrl(url: string | any | null): url is AuthorizationUrl {
        // if (typeof url !== 'string') return false;
        return typeof url === 'string';
        // /^https:\/\/(.+?\.)?\velticare\.com(\/|$)/.test(url);
    }

    isSessionUserInfo(obj: any): obj is SessionUserInfo {
        if (typeof obj === 'string') return false;
        return (
            obj &&
            'sub' in obj &&
            typeof obj.sub === 'string' &&
            'email' in obj &&
            typeof obj.email === 'string' &&
            'profile' in obj
        );
    }
    isSession(obj: any): obj is Session {
        if (typeof obj === 'string') return false;
        return (
            obj &&
            'access_token' in obj &&
            typeof obj.access_token === 'string' &&
            'expires_in' in obj &&
            typeof obj.expires_in === 'number' &&
            'scope' in obj &&
            typeof obj.scope === 'string'
        );
    }
    async closeSession(id: string) {
        await this.oidc.logout(id, 'members');
    }
}
