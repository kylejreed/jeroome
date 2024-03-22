import { GitHub, OAuth2RequestError, generateState } from "arctic";

import { config } from "@config";
import type { OAuthHandler } from "../oauth";


const github = new GitHub(config.env.GITHUB_CLIENT_ID!, config.env.GITHUB_CLIENT_SECRET!);
type GithubUserQueryResult = { id: number; login: string; avatar_url: string; name: string; email: string; };

export const githubHandler: OAuthHandler = {
    async getRedirectUrl(cb) {
        const state = generateState();
        cb(state);
        const url = await github.createAuthorizationURL(state);
        return url.toString();
    },
    async callback(c, code) {
        try {
            const tokens = await github.validateAuthorizationCode(code);
            const githubUserResponse = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`
                }
            });
            const githubUserResult = await githubUserResponse.json() as GithubUserQueryResult;

            return {
                id: githubUserResult.id.toString(),
                name: githubUserResult.name,
                email: githubUserResult.email,
                picture: githubUserResult.avatar_url,
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
