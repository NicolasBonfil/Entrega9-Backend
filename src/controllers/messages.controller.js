import messageService from "../services/messages.service.js"
import socketServer from "../apps.js"

class MessageController{
    getAllMessages = async () => {
        try {
            const result = await messageService.getAllMessages()
            res.status(200).send({status: "success", payload: result})
        } catch (error) {
            res.status(400).send({"status": error, message: "Error al obtener los mensajes"})
        }
    }

    async saveMessages(req, res){
        const {user, message} = req.body

        try {
            const newMessage = await messageService.saveMessages(user, message)
            socketServer.emit("newMessage", newMessage)
            res.status(200).send(({status: "success", payload: newMessage}))
            
        } catch {
            if(!user || !message) return res.status(400).send({status: "error", error: "Faltan datos"})
        }
    }
}

export default new MessageController()