import productService from "../services/products.service.js"

class ProductController{
    async getProducts(req, res){
        const {limit = 10} = req.query
        const {page = 1} = req.query

        let filtro = {};

        if(req.query.status == "true"){
            filtro = {status: true}
        }else if(req.query.status == "false"){
            filtro = {status: false}
        }else if(req.query.category){
            filtro = {category: req.query.category}
        }

        const sort = req.query.sort

        try {
            const result = await productService.getProducts(limit, page, filtro, sort)
            res.status(200).send({status: "success", payload: result}) 
        } catch (error) {
            res.status(400).send({status: "error", message: "Error al obtener los productos"})
        }
    }

    async getProductById(req, res){
        const id = req.params.id
        try {
            const product = await productService.getProductById(id)
            res.status(400).send({payload: product})    
        } catch {
            const products = await productService.getLeanProducts()
            const existsProduct = products.find(p => p._id == id)
            if(!existsProduct) return ({status: "error", error: "No existe un producto con ese id"})
        }
    }

    async addProduct(req, res){
        const {title, description, price, code, stock, category, thumbnail} = req.body
        if(!title || !description || !price || !code || !category){
            return res.status(400).send({status: "error", error: "Faltan datoss"})
        }

        try {
            let product = {
                title,
                description,
                price,
                code,
                stock,
                category,
                thumbnail
            }
        
            const newProduct = await productService.addProduct(product)
            res.status(400).send({payload: newProduct})
        } catch {

            const products = await productService.getLeanProducts()
            const productoAgregado = products.find(p => p.code == code)
            if(productoAgregado) res.status(400).send({status: "error", error: "El producto ya esta registrado"})
        }
    }

    async updateProduct(req, res){
        const pid = req.params.pid
        const datosActualizados = req.body
    
        try {
            const productoActualizado = await productService.updateProduct(pid, datosActualizados)
            res.status(200).send({payload: productoActualizado})
        } catch {
            if(!pid) return res.status(400).send({status: "error", error: "Faltan datos"})
    
            const products = await productService.getLeanProducts()
    
            const existsProduct = products.find(p => p.code == datosActualizados.code)
            if(existsProduct) res.status(400).send({status: "error", error: "Ya existe un producto con ese codigo"})
    
            const product = products.find(p => p._id == pid)
            if(!product) return res.status(400).send({status: "error", error: "No existe un producto con ese id"})
        }
    }

    async deleteProduct(req, res){
        const pid = req.params.pid
        try {
            const productoEliminado = await productService.deleteProduct(pid)
            res.status(200).send(productoEliminado)
            
        } catch {
            if(!pid) return res.status(400).send({status: "error", error: "Faltan datos"})
    
            const products = await productService.getLeanProducts()
            const product = products.find(p => p._id == pid)
            if(!product) return res.status(400).send({status: "error", error: "No existe un producto con ese id"})
        }
    }
}

export default new ProductController()