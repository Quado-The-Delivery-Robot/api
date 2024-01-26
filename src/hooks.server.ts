import { sequence } from "@sveltejs/kit/hooks";
import { SvelteKitAuth } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_SECERT } from "$env/static/private";
import database from "$lib/database";
import type { Handle } from "@sveltejs/kit";
import type { Session } from "@auth/sveltekit";

const addLocalsSession: Handle = async ({ event, resolve }) => {
    const session: Session = (await event.locals.getSession()) as Session;
    event.locals.session = session;

    return resolve(event);
};

export const handle: Handle = sequence(
    SvelteKitAuth({
        providers: [GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_SECERT, redirectProxyUrl: "https://www.quadoapp.com/auth" })],
        adapter: MongoDBAdapter(database, { databaseName: "app" }),
        pages: {
            signIn: "/login",
        },
        cookies: {
            sessionToken: {
                name: "authjs.session-token",
                options: {
                    httpOnly: true,
                    sameSite: "lax",
                    path: "/",
                    domain: ".quadoapp.com",
                },
            },
        },
    }),
    addLocalsSession
);
