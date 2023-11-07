import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";
import type { RequestEvent } from "@sveltejs/kit";

const restaurantsCollection: Collection = getCollection("core", "restaurants");

type registerEvent = {
    url: string,
}

export async function POST({ request }: RequestEvent) {
    const data: registerEvent = await request.json();
    console.log("Registered robot.", data);
}
