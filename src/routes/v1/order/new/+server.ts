import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { Session } from "@auth/core/types";
import type { RequestEvent } from "@sveltejs/kit";
import type { item } from "$lib/api/types";

const ordersCollection: Collection = getCollection("user", "orders");
let validRestaurants: string[] = [];

type request = {
    restaurant: string;
    order: item[];
};

export async function POST({ request, locals }: RequestEvent) {
    const session: Session = (await locals.getSession()) as Session;
    const { restaurant, order }: request = await request.json();

    // To be replaced with database searching soon.
    if (validRestaurants.includes(restaurant) == false) {
        return json({
            success: false,
            error: "Invalid resturant.",
        });
    }

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
