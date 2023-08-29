import { Router } from "express"
import messageController from "../controllers/messages.controller.js"

class MessageRouter{
    constructor(){
        this.InicioMessage = Router()
        this.InicioMessage.post("/", messageController.saveMessages)
    }

    getRouter(){
        return this.InicioMessage
    }
}

export default new MessageRouter()