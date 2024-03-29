import { json } from "@sveltejs/kit";
import { registerRobot } from "$lib/controllers/robot";

type registerEvent = {
    api: string;
};

export async function POST({ request }) {
    const data: registerEvent = await request.json();
    const registeredRobot = await registerRobot(data.api);

    return json({
        success: registeredRobot,
    });
}
