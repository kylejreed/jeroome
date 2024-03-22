import { Google, OAuth2RequestError, generateState, type GoogleTokens } from "arctic";
import { generateId } from "lucia";

import type { OAuthHandler } from "../oauth";
import { config } from "@config";

const google = new Google(config.env.GOOGLE_CLIENT_ID!, config.env.GOOGLE_CLIENT_SECRET!, config.env.GOOGLE_REDIRECT_URI!);
type GoogleFetchUserResult = { name: string; email: string; picture: string; sub: string; };

const codeVerifier = generateId(10);
export const googleHandler: OAuthHandler = {
    async getRedirectUrl(cb) {
        const state = generateState();
        cb(state);
        const url = await google.createAuthorizationURL(state, codeVerifier, { scopes: ["profile", "email"] });
        return url.toString();
    },
    async callback(c, code) {
        try {
            const tokens: GoogleTokens = await google.validateAuthorizationCode(code, codeVerifier);
            const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`
                }
            });
            const googleUser = await response.json() as GoogleFetchUserResult;
            return {
                id: googleUser.sub,
                name: googleUser.name,
                email: googleUser.email,
                picture: googleUser.picture
            };
        } catch (e) {
            console.log(e);
            if (e instanceof OAuth2RequestError) {
                c.status(400);
                return null;
            }
            c.status(500);
            return null;
        }

    },
};

