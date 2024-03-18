import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { GitHub, OAuth2RequestError, generateState } from "arctic";
import { generateId } from "lucia";
import { and, eq } from "drizzle-orm";

import { config } from "@config";
import type { HonoContext, OAuthProvider } from "@types";
import { schema } from "@db";
import type { User } from "@db/schema/auth";

type OAuthHandler = {
    redirect: (c: Context<HonoContext>) => Promise<Response>;
    callback: (c: Context<HonoContext>, code: string) => Promise<User | null>;
};

const github = new GitHub(config.env.GITHUB_CLIENT_ID!, config.env.GITHUB_CLIENT_SECRET!);

export const oauthProviders: Record<OAuthProvider, OAuthHandler> = {
    "github": {
        async redirect(c) {
            const state = generateState();
            const url = await github.createAuthorizationURL(state);
            setCookie(c, "github_oauth_state", state, {
                httpOnly: true,
                secure: c.var.config.env.NODE_ENV === "production",
                maxAge: 60 * 10, // 10 minutes
                path: "/"
            });
            return c.redirect(url.toString());
        },
        async callback(c, code) {
            const { db } = c.var;
            try {
                const tokens = await github.validateAuthorizationCode(code);
                const githubUserResponse = await fetch("https://api.github.com/user", {
                    headers: {
                        Authorization: `Bearer ${tokens.accessToken}`
                    }
                });
                const githubUserResult = await githubUserResponse.json() as { id: number; login: string; };
                console.log(githubUserResult);

                const [existingUser] = await db
                    .select()
                    .from(schema.users)
                    .where(and(eq(schema.users.oauth_provider, "github"), eq(schema.users.oauth_id, githubUserResult.id.toString())));

                if (existingUser) {
                    return existingUser;
                }

                const userId = generateId(15);
                const [newUser] = await c.var.db.insert(schema.users).values({
                    id: userId,
                    username: githubUserResult.login,
                    role: "user",
                    oauth_provider: "github",
                    oauth_id: githubUserResult.id.toString(),
                }).returning();

                return newUser;
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
    }
};

export type OAuthHandlerMap = typeof oauthProviders;
