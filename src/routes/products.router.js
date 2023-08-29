import { Router } from "express"
import productController from "../controllers/products.controller.js"

class ProductRouter{
    constructor(){
        this.InicioProduct = Router()
        this.InicioProduct.get("/", productController.getProducts)
        this.InicioProduct.get("/:id", productController.getProductById)
        this.InicioProduct.post("/", productController.addProduct)
        this.InicioProduct.put("/:pid", productController.updateProduct)
        this.InicioProduct.delete("/:pid", productController.deleteProduct)
    }

    getRouter(){
        return this.InicioProduct
    }
}

export default new ProductRouter()