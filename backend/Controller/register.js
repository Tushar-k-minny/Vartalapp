import { User } from "../Models/UserModel.js"
import generateToken from "../utils/generateToken.js";
import { hashSync, genSaltSync } from "bcrypt";

export const register = async (req, res) => {

    const { username, password, email } = req.body


    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('Already registerd User')
    }
    else {
        const salt = genSaltSync(10)
        const hashPassword = hashSync(password, salt)
        const createdUser = await User.create({ username, email, password: hashPassword });


        if (createdUser) {

            generateToken(res, { id: createdUser._id, username: createdUser.username });

            res.status(201).json({
                _id: createdUser._id,
                username: createdUser.username,
                email: createdUser.email

            })

        }
        else {
            res.status(401)
            throw new Error('Invalid User')
        }
    }



}