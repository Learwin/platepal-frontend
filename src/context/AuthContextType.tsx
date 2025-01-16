import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface für den Benutzer
interface User {
    id: number;
    username: string;
    foto: string; // Base64-String oder URL
    emailAdresse: string; // Optional, falls benötigt
    passwort: string
    // Weitere Felder je nach Bedarf
}

// Interface für den AuthContext
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
}
   
// Erstellen des AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider-Komponente, die den AuthContext zur Verfügung stellt
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // Zustand für den Benutzer
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Zustand für den Login-Status

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
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
