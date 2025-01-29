import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface für den Benutzer
export interface User {
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
    isAdmin: boolean; // Füge isAdmin hier hinzu
}

// Erstellen des AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider-Komponente, die den AuthContext zur Verfügung stellt
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // Zustand für den Benutzer
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Zustand für den Login-Status

    // Benutzer beim Setzen von setUser behandeln
    const handleSetUser = (user: User | null) => {
        setUser(user);
        setIsLoggedIn(!!user);
    };

    // Berechne isAdmin basierend auf dem flag-Wert
    const isAdmin = user?.flag === 1;

    return (
        <AuthContext.Provider value={{ user, setUser: handleSetUser, isLoggedIn, setIsLoggedIn, isAdmin }}>
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
