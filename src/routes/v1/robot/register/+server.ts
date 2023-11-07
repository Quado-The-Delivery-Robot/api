import type { RequestEvent } from "@sveltejs/kit";

type registerEvent = {
    url: string,
}

export async function POST({ request }: RequestEvent) {
    const data: registerEvent = await request.json();
    console.log("Registered robot.", data);
}
