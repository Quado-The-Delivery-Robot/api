import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import type { Session } from "@auth/sveltekit";

export async function GET({ locals }: RequestEvent) {
    return json({
        status: "Functional.",
        session: locals.session,
    });
}
