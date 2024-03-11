import { json } from "@sveltejs/kit";

export async function GET() {
    return json({
        success: true,
        tags: ["Burger", "Healthy", "Salad", "Fresh", "Desert", "Fat-free"],
    });
}
