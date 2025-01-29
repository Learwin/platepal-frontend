import React, { createContext, useState, useContext, ReactNode } from 'react';


interface Zutat {
  id: number;
  name: string;
  quantity: number; // Neue Eigenschaft für die Menge
  einheit: string;
  menge: number;
}

interface Einheit {
  id: number;
  name: string;
}

interface CartContextType {
  cartItems: Zutat[];
  addItemToCart: (item: Zutat) => void;
  decreaseItemQuantity: (itemId: number) => void; // Neue Methode zum Reduzieren der Menge
  removeItemFromCart: (itemId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode; // Definiert, dass `children` alles sein kann, was React rendern kann
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<Zutat[]>([]);
  const [checkedZutaten, setCheckedZutaten] = useState<Set<number>>(new Set());

  // Funktion zum Hinzufügen oder Erhöhen der Menge einer Zutat
  const addItemToCart = (item: Zutat) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((existingItem) => existingItem.id === item.id);
      if (existingItem) {
        return prevItems.map((existingItem) =>
          existingItem.id === item.id
            ? { ...existingItem, quantity: existingItem.quantity + 1 }
            : existingItem
        );
      }
      // Initialen Artikel mit korrektem Startwert hinzufügen
      return [...prevItems, { ...item, quantity: 0 }];
    });
  };
  
  
  
  const decreaseItemQuantity = (itemId: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  
  

  // Funktion zum Entfernen einer Zutat aus dem Warenkorb
  const removeItemFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]); // Leert den Warenkorb
    setCheckedZutaten(new Set()); // Setzt alle ausgewählten Zutaten zurück
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItemToCart, decreaseItemQuantity, removeItemFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
