import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { Session } from "@auth/core/types";
import type { RequestEvent } from "@sveltejs/kit";
import type { order } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");

export async function GET({ locals }: RequestEvent) {
    const session: Session = (await locals.getSession()) as Session;

    return json({
        session,
    });

    const result = ordersCollection.find({
        user: session?.user?.email,
    });
    const orders: order[] = (await result.toArray()) as unknown as any;

    return json({
        success: true,
        orders: orders,
    });
}
