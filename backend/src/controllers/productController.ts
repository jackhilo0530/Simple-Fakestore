import {Context} from "hono";
import {fetchProducts, fetchProduct} from "../services/fakestore";

const parseId = (c: Context) => {
    const id = Number(c.req.param("id"));
    if(Number.isNaN(id) || id <= 0){
        throw new Error("invalid id");
    }
    return id;
}

const PRODUCTS_PER_PAGE = 10;

export const ProductController = {
    getProducts: async (c: Context) => {
        try{
            const page = Number(c.req.query("page") || 1);
            const limit = Number(c.req.query("limit") || PRODUCTS_PER_PAGE);
            const skip = (page - 1) * limit;

            const products = await fetchProducts({skip, limit});
            return c.json(products);
        } catch (error) {
            return c.json({message: "internal server error"}, 500)
        }
    },

    getProductById: async (c: Context) => {
        try{
            const id = parseId(c);
            const product = await fetchProduct(id);

            if(!product) {
                return c.json({message: "product not found"}, 404)
            }

            return c.json(product);
        } catch (error) {
            return c.json({message:"internal id"}, 400)
        }
    }
}

