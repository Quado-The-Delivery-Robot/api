import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
    return json({
        status: "Functional.",
        session: locals.session,
    });
}
