import { model, Schema } from "mongoose";


const MessageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User'

        },
        text: String,

    }, { timestamps: true }
)

export const Message = model('message', MessageSchema)