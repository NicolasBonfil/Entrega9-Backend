import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import { Server } from "socket.io"

import __dirname from "./utils.js"

import viewRouter from "./routes/views.router.js"
import sessionRouter from "./routes/sessions.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import messagesRouter from "./routes/messages.router.js"

import initializePassport from "./config/passport.config.js"
import passport from "passport"
import cookieParser from "cookie-parser"
import CONFIG from "./config/config.js"

const app = express()

mongoose.set("strictQuery", false)

const {PORT, MONGO_URL} = CONFIG

const connection = mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ecommerce"
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl:3600
    }),
    secret: "12345abcd",
    resave: false,
    saveUninitialized:false
}))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(cookieParser())
app.use("/api/products", productsRouter.getRouter())
app.use("/api/carts", cartsRouter.getRouter())
app.use("/api/messages", messagesRouter.getRouter())
app.use("/", viewRouter)
app.use("/api/session", sessionRouter)

app.use(passport.initialize())
initializePassport()
app.use(session({
    secret: "SecretCoders"
}))


const httpserver = app.listen(PORT, () => console.log("Server arriba"))
const socketServer = new Server(httpserver)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente");
})

export default socketServer

