import { getCollection } from "$lib/database";
import type { Collection } from "mongodb";

const ordersCollection: Collection = getCollection("core", "orders");

export async function POST() {}
