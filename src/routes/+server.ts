import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import type { Session } from "@auth/sveltekit";

export async function GET({ locals }: RequestEvent) {
    const session: Session = (await locals.getSession()) as Session;

    return json({
        status: "Functional.",
        session: session,
    });
}
