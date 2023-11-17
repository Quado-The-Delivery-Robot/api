import { SvelteKitAuth } from "@auth/sveltekit";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { sequence } from "@sveltejs/kit/hooks";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_SECERT } from "$env/static/private";
import database from "$lib/database";
import type { Handle } from "@sveltejs/kit";

const removeCors: Handle = async ({ resolve, event }) => {
    if (event.request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        });
    }

    const response = await resolve(event);
    response.headers.append("Access-Control-Allow-Origin", `*`);

    return response;
};

export const handle = sequence(
    removeCors,
    SvelteKitAuth({
        providers: [GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_SECERT, redirectProxyUrl: "https://example.com/auth" })],
        adapter: MongoDBAdapter(database, { databaseName: "app" }),
    })
);
