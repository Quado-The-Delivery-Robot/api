import { json } from "@sveltejs/kit";
import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";

const restaurantsCollection: Collection = getCollection("core", "restaurants");

export async function GET({ params }) {
    const result = await restaurantsCollection.findOne({
        id: params.restaurant,
    });

    return json({
        success: true,
        restaurant: result,
    });
}
