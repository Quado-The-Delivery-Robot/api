import { Order } from "$lib/classes/order";
import { getAvailableRobot } from "./robot";
import type { order } from "$lib/types";
import type { Robot } from "$lib/classes/robot";

let orders: Order[] = [];

function startOrder(robot: Robot, order: Order) {
    orders = orders.filter((orderToRemove: Order) => orderToRemove.id !== order.id);
    robot.startOrder(order);
}

export async function createOrder(user: string, data: order): Promise<boolean> {
    const order: Order = new Order(user, data);
    const success: boolean = await order.setup();

    if (success) {
        orders.push(order);

        const availableRobot: Robot | null = getAvailableRobot();

        if (availableRobot !== null) robotFree(availableRobot);
    }

    return success;
}

export function robotFree(robot: Robot) {
    if (orders.length === 0) return;

    startOrder(robot, orders[0]);
}
