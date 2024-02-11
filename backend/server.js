import express from "express";
import cors from "cors"
import authRoutes from './Routes/AuthRoutes.js'
import dotenv from 'dotenv'
import mongoose from "mongoose";
// import { User } from "./Models/UserModel.js";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws"
import jwt from 'jsonwebtoken'
import { Message } from "./Models/MessagesModel.js";
import userRoutes from "./Routes/userRoutes.js";


dotenv.config()

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express.json())

app.use(cookieParser())


mongoose.connect(process.env.MONGO_URL)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.get("/test", (req, res) => {
    res.json("test OK")
})



const server = app.listen(4400, () => console.log('server is listening'))

const wss = new WebSocketServer({ server })

wss.on('connection', (connection, req) => {
    // console.log('connected')
    // connection.send('hello ')


    const cookies = req.headers.cookie
    // console.log(cookies)
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('jwt='))

        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1]
            // console.log(token)

            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
                    if (err) throw err;
                    const { id, username } = userData;
                    // console.log(userData)
                    connection.userId = id;
                    connection.username = username
                })
            }
            else console.log("no token")
        }
    }


    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            {
                online: [...wss.clients].map(el => ({ userId: el.userId, username: el.username }))
            }
        ))
    })

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message)

        const { receiver, text } = messageData
        // console.log(text)

        if (receiver && text) {
            const mssgDoc = await Message.create({
                senderId: connection.userId,
                receiverId: receiver,
                text
            });
            // console.log(mssgDoc);
            [...wss.clients]
                .filter(client => client.userId === receiver)
                .forEach(connect => connect.send(JSON.stringify({ text, id: mssgDoc._id, senderId: connection.userId, receiver })))
        }

    })

})