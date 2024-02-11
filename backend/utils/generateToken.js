import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    //token is created 

    const token = jwt.sign(userId, process.env.JWT_SECRET, {
        expiresIn: '3000000000'
    })

    //cookie is created
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })
}

export default generateToken   