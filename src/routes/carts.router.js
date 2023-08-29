import { Router } from "express"
import cartController from "../controllers/carts.controller.js"

class CartRouter{
    constructor(){
        this.InicioCart = Router()
        this.InicioCart.get("/cid", cartController.getCartProducts)
        this.InicioCart.post("/", cartController.createCart)
        this.InicioCart.post("/:cid/products/:pid", cartController.addProductToCart)
        this.InicioCart.delete("/:cid/products/:pid", cartController.deleteProductFromCart)
        this.InicioCart.put("/:cid", cartController.updateCartProducts)
        this.InicioCart.put("/:cid/products/:pid", cartController.updateProductQuantity)
        this.InicioCart.delete("/:cid", cartController.deleteCartProducts)
    }

    getRouter(){
        return this.InicioCart
    }
}

export default new CartRouter()