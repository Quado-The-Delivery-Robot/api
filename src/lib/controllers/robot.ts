import { Robot } from "$lib/classes/robot";

const robots: Robot[] = [];

export async function registerRobot(api: string): Promise<[boolean, Robot]> {
    const robot = new Robot(api);
    const success: boolean = await robot.setup();

    if (success) robots.push(robot);

    return [success, robot];
}

export function getAvailableRobot(): Robot | null {
    let availableRobot: Robot | null = null;

    robots.forEach((robot: Robot) => {
        if (robot.state !== "free") return;

        availableRobot = robot;
    });

    return availableRobot;
}
