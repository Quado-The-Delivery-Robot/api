import { json, type RequestEvent } from "@sveltejs/kit";
import { getRobotByApi } from "$lib/controllers/robot";
import type { Robot } from "$lib/classes/robot";

type registerEvent = {
    api: string;
};

export async function POST({ request }: RequestEvent) {
    const data: registerEvent = await request.json();
    const robot: Robot | null = getRobotByApi(data.api);

    if (robot !== null) {
        robot.destroy();
    }

    return json({
        success: true,
    });
}
