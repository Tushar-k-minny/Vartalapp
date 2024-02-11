

import { Message } from "../Models/MessagesModel.js";
import mongoose from "mongoose";
export const MessageHistory = async (req, res) => {
   try {
     const { id: userId } = req.params;
     var obj = new mongoose.Types.ObjectId(userId.trim())
     const msgs = await Message.find({ senderId: obj })
     res.json(msgs);
   } catch (error) {
    res.status(501).json(
        {
            status:false,
            error:error.message||"Internal Error",
            data:null
        }
    )
   }
}