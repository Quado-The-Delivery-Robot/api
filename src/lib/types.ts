export type orderState = "Picking up order" | "Waiting for order" | "On its way" | "Delivered" | "Not started";

export type userOrderItem = {
    id: number;
    quantity: number;
};

export type orderItem = userOrderItem & {
    price: number;
};

export type robotState = "delivering" | "waiting" | "free";

export type orderBasic = {
    id: string;
    price: number;
    state: orderState;
    restaurant: string;
    items: orderItem[];
};

export type order = orderBasic & {
    code: string;
    data: any;
};

export type restaurant = {
    name: string;
    colors: string[];
    tags: string[];
    image: string;
    nameID: string;
    items: any;
};
