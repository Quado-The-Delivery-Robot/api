import { registerRobot as registerRobotLocal, Robot } from "./robot";

const robots: Robot[] = [];

export async function registerRobot(api: string): Promise<boolean> {
    const [success, robot] = await registerRobotLocal(api);
    return success;
}

export function getAvailableRobot() {
    let availableRobot: Robot;

    robots.forEach(function(robot: Robot) {
        
    })
}
