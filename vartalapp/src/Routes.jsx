import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useContext } from 'react'
// import { UserContextProvider } from
import Register from './Register.jsx'
import Login from './Login.jsx'
import { UserContext } from './userContext.jsx'
import Chat from './Chat.jsx'

export const ClientRoutes = () => {
    const { loginInfo } = useContext(UserContext);
    console.log(loginInfo.username)
    if (loginInfo.username) {
        return (<Chat />)
    }



    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="/setAvatar" element={<SetAvatar />} /> */}
                {/* <Route path="/" element={<Chat />} /> */}
            </Routes>
        </BrowserRouter>

    )
}

