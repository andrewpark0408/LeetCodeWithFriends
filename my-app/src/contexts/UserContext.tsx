import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserContextType = {
    user: { userId: number, email: string } | null;
    setUser: (user: { userId: number, email: string } | null) => void;
};

const defaultState = {
    user: null,
    setUser: () => {},
};

export const UserContext = createContext<UserContextType>(defaultState);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ userId: number, email: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        console.log("Current User in UserContext:", user);
        console.log("Current User ID in UserContext:", user?.userId);
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
