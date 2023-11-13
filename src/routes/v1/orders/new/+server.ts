import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import isValidRestaurant from "$lib/isValidRestaurant";
import type { Collection } from "mongodb";
import type { Session } from "@auth/core/types";
import type { RequestEvent } from "@sveltejs/kit";
import type { orderItem } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");

export async function POST({ request, locals }: RequestEvent) {
    const session: Session = (await locals.getSession()) as Session;
    const order: orderItem[] = await request.json();


    const result = await ordersCollection.updateOne(
        {
            user: session?.user?.email,
        },
        {
            $push: {
                orders: order,
            },
        },
        {
            upsert: true,
        }
    );

    return json({
        success: result.acknowledged,
    });
}
