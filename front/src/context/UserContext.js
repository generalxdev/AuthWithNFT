import React, { useState } from 'react'
import { useContext } from 'react';

const UserContext = React.createContext({})

export const UserProvider = ({ children }) => {

    const T_KEY = 'user';
    const getInitialUser = () => {
        return localStorage.getItem(T_KEY) ?? '';
    }
    const [user, setUser] = useState(getInitialUser);

    const handleUser = (value) => {
        localStorage.setItem(T_KEY, value);
        setUser(value);
    }

    return (
        <UserContext.Provider
            value={{
                user,
                setUser: handleUser,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);