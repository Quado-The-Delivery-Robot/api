import { json, type RequestEvent } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }: RequestEvent) => {
    const session = locals.getSession();

    if (!session) {
        return json({
            success: false,
            error: "User not logged in.",
        });
    }
};
