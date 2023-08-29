import productsModel from "../dao/models/products.js";

class ProductService{
    constructor(){
        console.log("Estamos trabajando con bd mongo");
    }

    getLeanProducts = async () => {
        const products = await productsModel.find().lean()
        return products
    }

    getProducts = async (limit, page, filtro, sort) => {
        try {
            const {totalPages, docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(filtro, {limit, page, lean: true})
            
            let products = docs
        
            if(sort == "asc"){
                products = await productsModel.find().sort({price: 1})
            }else if(sort == "desc"){
                products = await productsModel.find().sort({price: -1})
            }
        
            let prevLink
            hasPrevPage? prevLink = prevLink = `http://localhost:8080/products?page=${prevPage}` : null
            
            let nextLink
            hasNextPage? nextLink = nextLink = `http://localhost:8080/products?page=${nextPage}` : null
        
            return ({payload: products, totalPages, page, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink})
        } catch (error) {
            return error
        }
    }

    getProductById = async (id) => {
        const products = await this.getLeanProducts()

        const product = products.find(p => p._id == id)
        return product
    }

    addProduct = async product => {
        const products = await this.getLeanProducts()

        const productoAgregado = products.find(p => p.code == product.code)
        if(productoAgregado) return error

        if(product.stock === 0) product.status = false

        let result = await productsModel.create(product)
        return result
    }

    updateProduct = async (pid, datosActualizados) => {
        const products = await this.getLeanProducts()

        const keys = Object.keys(datosActualizados)
        const values = Object.values(datosActualizados)

        const product = products.find(p => p._id == pid)
        if(!product) return error


        if(keys.includes("id")){
            const indice = keys.indexOf("id")
            keys.splice(indice, 1)
            values.splice(indice, 1)
        }

        if(keys.includes("code")){
            const indice = keys.indexOf("code")
            const existsProduct = products.find(p => p.code == values[indice])
            if(existsProduct) return error
        }

        for(let i = 0; i < keys.length; i++){
            let llave = keys[i]
            let valor = values[i]
            product[llave] = valor
            await productsModel.updateOne({_id: pid}, product);
        }

        return product
    }

    deleteProduct = async pid => {
        const products = await this.getLeanProducts()
        const product = products.find(p => p._id == pid)
        if(!product) return error

        await productsModel.deleteOne({_id: pid})
        return "Producto eliminado"
    }
}

export default new ProductService()