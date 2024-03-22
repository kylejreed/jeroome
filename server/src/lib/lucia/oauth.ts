import type { Context } from "hono";

import type { HonoContext, OAuthProvider } from "@types";
import { githubHandler, googleHandler } from "./providers";

export type OAuthUserInfo = {
    id: string;
    name: string;
    picture: string;
    email: string;
};
export type OAuthHandler = {
    getRedirectUrl: (cb: (state: string) => void) => Promise<string>;
    callback: (c: Context<HonoContext>, code: string) => Promise<OAuthUserInfo | null>;
};

export const oauthProviders: Record<OAuthProvider, OAuthHandler> = {
    "github": githubHandler,
    "google": googleHandler
};

export type OAuthHandlerMap = typeof oauthProviders;
