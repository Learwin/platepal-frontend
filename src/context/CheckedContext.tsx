import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface für den CheckedContext
interface CheckedContextType {
  checkedCount: number;
  setCheckedCount: React.Dispatch<React.SetStateAction<number>>;
}

// Initialisieren des Contexts
const CheckedContext = createContext<CheckedContextType | undefined>(undefined);

interface CheckedProviderProps {
  children: ReactNode; // Typisierung des children-Props
}

export const CheckedProvider: React.FC<CheckedProviderProps> = ({ children }) => {
  const [checkedCount, setCheckedCount] = useState<number>(0);

  return (
    <CheckedContext.Provider value={{ checkedCount, setCheckedCount }}>
      {children} {/* Der children-Prop wird hier korrekt verwendet */}
    </CheckedContext.Provider>
  );
};

// Custom Hook, um den Context zu verwenden
export const useCheckedContext = () => {
  const context = useContext(CheckedContext);
  if (!context) {
    throw new Error('useCheckedContext muss innerhalb von CheckedProvider verwendet werden');
  }
  return context;
};
