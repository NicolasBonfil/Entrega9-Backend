import messagesModel from "../dao/models/messages.js";

class MessageService{
    constructor(){
        console.log("Estamos trabajando con bd mongo");
    }

    getAllMessages = () => {
        let messages = messagesModel.find().lean();
        if(!messages){
            messages = []
        }
        return messages
    }

    saveMessages = async (user, message) => {
        let result = await messagesModel.create({user, message})
        return result
    }
}

export default new MessageService()