import {Hono} from "hono";
import { CheckoutController } from "../controllers/checkoutController";

const checkout = new Hono();

checkout.post("/", CheckoutController);

export default checkout;