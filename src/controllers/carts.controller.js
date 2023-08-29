import cartService from "../services/carts.service.js";

class CartController{
    async getCartProducts(req, res){
        const cid = req.params.cid
        try {
            const products = await cartService.getProducts(cid)
            res.status(200).send({payload: products})
        } catch {
            if(!cid) return res.status(400).send({status: "error", error: "Faltan Datos"})
        
            const existsCart = await cartsModel.findOne({_id: cid})
            if(!existsCart) return res.status(400).send({status: "error", error: "Carrito inexistente"})
        }
    }

    async createCart(req, res){
        try {
            const newCart = await cartService.createCart()
            res.status(200).send({payload: newCart})
        } catch {
            res.status(400).send({status: "error", error: "Error al crear el carrito"})
        }
    }

    async addProductToCart(req, res){
        const cid = req.params.cid
        const pid = req.params.pid

        try {
            const addedProduct = await cartService.addProductToCart(cid, pid)
            res.status(200).send({payload: addedProduct}) 
        } catch {
            if(!cid || !pid) return res.status(400).send({status: "error", error: "Faltan datos"})
        
            const cart = await cartsModel.findOne({_id: cid})
            if(!cart) return res.status(400).send({status: "error", error: "Carrito inexistente"})
        }
    }

    async deleteProductFromCart (req, res){
        const cid = req.params.cid
        const pid = req.params.pid

        try {
            const removedProduct = await cartService.removeProductFromCart(cid, pid)
            res.status(400).send({payload: removedProduct})
        } catch {
            if(!cid || !pid) return res.status(400).send({status: "error", error: "Faltan datos"})

            const cart = await cartsModel.findOne({_id: cid})
            if(!cart) return res.status(400).send({status: "error", error: "Carrito inexistente"})

            const productIndex = cart.productsInCart.findIndex(p => p.product._id == pid);
            if(productIndex === -1) return res.status(400).send({status: "error", error: "Producto no encontrado"})
        }
    }

    async updateCartProducts(req, res){
        const cid = req.params.cid
        const products = req.body

        try {    
            const updatedProducts = await cartService.updateCartProducts(cid, products)
            res.status(200).send({payload: updatedProducts})

        } catch {
            if(!cid) return res.status(400).send({status: "error", error: "Faltan datos"})
        
            products.forEach(p => {
                if(!p.product._id || !p.quantity) return res.status(400).send({status: "error", error: "Faltan datos"})  
            })

            const cart = await cartsModel.findOne({_id: cid})
            if(!cart) return res.status(400).send({status: "error", error: "Carrito inexistente"})
        }
    }

    async updateProductQuantity(req, res){
        const cid = req.params.cid
        const pid = req.params.pid
        const {quantity} = req.body

        try {
            const updatedQuantity = await cartService.updateProductQuantity(cid, pid, quantity);
            res.status(200).send({payload: updatedQuantity});   
        } catch {
            if(!cid || !pid || !quantity) return res.status(400).send({status: "error", error: "Faltan datos"})

            const cart = await cartsModel.findOne({_id: cid})
            if(!cart) return res.status(400).send({status: "error", error: "Carrito inexistente"})

            const productIndex = cart.productsInCart.findIndex(p => p.product._id == pid);
            if(productIndex === -1) return res.status(400).send({status: "error", error: "Producto no encontrado"})

            if (typeof quantity !== "number" || quantity <= 0 || !(Number.isInteger(quantity))) return res.status(400).send({status: "error", error: "La cantidad debe ser un número entero mayor a cero"});
        }
    }

    async deleteCartProducts(req, res){
        const cid = req.params.cid

        try {
            const removedProducts = await cartService.deleteCartProducts(cid)
            res.status(200).send({payload: removedProducts})
        } catch {
            if(!cid) return res.status(400).send({status: "error", error: "Faltan datos"})

            const cart = await cartsModel.findOne({_id: cid})
            if(!cart) return res.status(400).send({status: "error", error: "Carrito inexistente"})
        }
    }
}

export default new CartController()