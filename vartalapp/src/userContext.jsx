import { createContext, useState, useEffect } from 'react'
import axios from 'axios'


export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
    const [loginInfo, setLoginInfo] = useState({
        username: null,
        id: null

    })

    useEffect(() => {
        axios.get('/api/auth/profile').then(response => {

            setLoginInfo({
                username: response.data.username,
                id: response.data.id
            })

        }) 

    }, [])

    return (
        <UserContext.Provider value={{ loginInfo, setLoginInfo }}>
            {children}
        </UserContext.Provider>
    )
}
