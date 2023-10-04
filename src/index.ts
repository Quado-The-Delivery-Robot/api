import * as dotenv from "dotenv";

dotenv.config();

import { getCollection } from "./database";

const restaurantsCollection: any = getCollection("core", "restaurants");

async function GET() {
    const result = restaurantsCollection.find().limit(5);
    const restaurants = await result.toArray();

    console.log({
        success: restaurants.length > 0,
        restaurants: restaurants,
    });
}
GET();
/*import { Next, createServer, Response, Request, Server } from "restify";

function respond(request: Request, response: Response, next: Next) {
  response.send(200, "hello");
}

const server: Server = createServer();
server.get("/hello", respond);

server.listen(8000, function () {
  console.log("server starter");
});
*/
