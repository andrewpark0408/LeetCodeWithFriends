import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext(); // Explicitly export UserContext

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};