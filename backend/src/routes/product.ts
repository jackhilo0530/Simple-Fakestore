import {Hono} from "hono";
import { ProductController } from "../controllers/productController";

const product = new Hono();

product.get("/", ProductController.getProducts);

product.get("/:id", ProductController.getProductById);

export default product;