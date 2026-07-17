import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children, auth }) {

    const [user, setUser] = useState(auth?.user ?? null);

    const updateUser = (newUser) => {
        setUser(newUser);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser: updateUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}