import { json } from "@sveltejs/kit";
import type { restaurant } from "$lib/types.js";

export async function GET({ fetch, params }) {
    const itemID: number = parseInt(params.itemID);
    const result = await fetch(`/v1/restaurants/info/${params.restaurant}`, {
        credentials: "include",
    });
    const { restaurant: restaurant }: { restaurant: restaurant } = await result.json();

    return json({
        success: result.ok && restaurant.items[itemID] !== null,
        item: restaurant.items[itemID],
    });
}
