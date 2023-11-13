import { json, type RequestEvent } from "@sveltejs/kit";
import { registerRobot } from "$lib/robotController";

type registerEvent = {
    api: string;
};

export async function POST({ request }: RequestEvent) {
    const data: registerEvent = await request.json();
    const registeredRobot: boolean = await registerRobot(data.api);

    return json({
        success: registeredRobot,
    });
}
