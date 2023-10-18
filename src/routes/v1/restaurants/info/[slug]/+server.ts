import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { RequestEvent } from "@sveltejs/kit";

const restaurantsCollection: Collection = getCollection("core", "restaurants");

export async function GET({ params }: RequestEvent) {
    const restaurant: string | undefined = params.slug;
    const result = await restaurantsCollection.findOne({
        nameID: restaurant,
    });

    return json({
        success: true,
        restaurant: result,
    });
}
