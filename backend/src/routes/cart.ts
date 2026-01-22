import {Hono} from "hono";
import { CartController } from "../controllers/cartController";

const cart = new Hono();

cart.get("/", CartController.getCart);

cart.post("/items", CartController.addItemToCart);

cart.patch("/items/:productId", CartController.addQuantity);

cart.delete("/items/:productId", CartController.deleteItem);

export default cart;