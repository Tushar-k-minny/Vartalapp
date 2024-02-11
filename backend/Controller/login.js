import { User } from "../Models/UserModel.js"
import { compare } from 'bcrypt'
import generateToken from "../utils/generateToken.js"

export const Login = async (req, res) => {
    const { username, password } = req.body


    const foundUser = await User.findOne({ username })
    // console.log(foundUser)

    if (foundUser) {
        const passOK = await compare(password, foundUser.password)


        if (passOK) {
            generateToken(res, { id: foundUser._id, username: foundUser.username })
            res.status(201).json({
                _id: foundUser._id,
                mssg: "welcome back",
                signal: true,

            })
        }
        else {
            return res.status(201).json({ mssg: "Incorrect Password", signal: false })
        }
    }
    else {
        res.status(201).json({ mssg: "User not found", signal: false })
    }

}