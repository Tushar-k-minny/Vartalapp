import jwt from 'jsonwebtoken'

export const Profile = (req, res) => {
    const token = req.cookies?.jwt



    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
            if (err) throw err;
            res.json(userData)
        })
    }
    else {
        res.json({ "message": "Null token" })
    }
}