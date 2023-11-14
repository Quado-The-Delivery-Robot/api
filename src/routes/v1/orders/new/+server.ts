import { json } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid";
import { getCollection } from "$lib/database";
import isValidRestaurant from "$lib/isValidRestaurant";
import { getAvailableRobot } from "$lib/robot";
import type { Collection } from "mongodb";
import type { Session } from "@auth/core/types";
import type { RequestEvent } from "@sveltejs/kit";
import type { order } from "$lib/types";

const ordersCollection: Collection = getCollection("core", "orders");

function taskRobot() {
    
}

export async function POST({ request, locals }: RequestEvent) {
    const session: Session = (await locals.getSession()) as Session;
    const order: order = await request.json();

    if (!isValidRestaurant(order.restaurant)) {
        return json({
            success: false,
            error: "Invalid restaurant.",
        });
    }

    order.id = uuidv4();

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
