import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface für den Benutzer
interface User {
    id: number;
    username: string;
    foto: string; // Base64-String oder URL
    emailAdresse: string;
    passwort: string;
    flag?: number; // Optionales Flag für Admin
}

// Interface für den AuthContext
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
}

// Erstellen des AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider-Komponente, die den AuthContext zur Verfügung stellt
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // Zustand für den Benutzer
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Zustand für den Login-Status
    const [isAdmin, setIsAdmin] = useState<boolean>(false); // Zustand für den Login-Status

    // Benutzer beim Setzen von setUser behandeln
    const handleSetUser = (user: User | null) => {
        if (user) {
            setIsLoggedIn(true);
            if (user.flag === 1) {
                setIsAdmin(true); // Setze Admin-Status
            } else {
                setIsAdmin(false); // Normaler Benutzer
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false); // Abgemeldet = kein Admin
        }
        setUser(user);
    };
    

    return (
        <AuthContext.Provider value={{ user, setUser: handleSetUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook zum Abrufen des AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContextType;
