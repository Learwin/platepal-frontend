import React from 'react';
import { Box, IconButton, Typography, Button, Divider, Tooltip, Badge } from '@mui/material';
import { CircleMinus, CirclePlus, CircleX, ShoppingCart } from 'lucide-react'; // Icons
import { useCart } from '../context/CartContext'; // Zugriff auf CartContext
import styles from '../Layout.module.css';

const Cart: React.FC<{ isCartOpen: boolean; setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>; }> = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, addItemToCart, decreaseItemQuantity, clearCart } = useCart();

  const closeCart = (): void => {
    setIsCartOpen(false);
  };

  const handleSubmitToPicnic = () => {
    console.log('Absenden an Picnic', cartItems);
  };

  const handleClearCart = () => {
    clearCart();
    // Optional: Logik hinzufügen, um Checkboxen oder andere UI-Elemente zu deaktivieren
    console.log('Warenkorb geleert. Deaktivierung der relevanten Elemente.');
  };

  return (
    <Box 
      className={`${styles.cartOverlay} ${isCartOpen ? styles.open : ''}`}
      onMouseLeave={closeCart}
    >
      <Box className={styles.cartContent}>
        <Box className={styles.cartHeader}>
          <Typography variant="h6">Einkaufswagen</Typography>
          <IconButton onClick={closeCart} className={styles.closeButton}>
            <CircleX size={20} />
          </IconButton>
        </Box>
        <Box>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <Box key={item.id} className={styles.cartItem}>
                <Typography>Geben Sie nur Stückzahlen an.</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography>{item.name}</Typography>
                  <Typography>{item.quantity}</Typography>
                  <Box className={styles.quantityControls} display="flex" alignItems="center">
                    <IconButton onClick={() => decreaseItemQuantity(item.id)} aria-label="Menge verringern">
                      <CircleMinus size={16} />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton onClick={() => addItemToCart(item)} aria-label="Menge erhöhen">
                      <CirclePlus size={16} />
                    </IconButton>
                  </Box>
                </Box>
                {index < cartItems.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Typography>Der Einkaufswagen ist leer.</Typography>
          )}
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2} className={styles.cartButtons}>
          <Tooltip 
            title='Wenn Sie auf "Jetzt Picnicen" klicken, werden die Zutaten im Einkaufskorb an Picnic gesendet.'
            arrow
          >
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#4caf50', 
                '&:hover': { backgroundColor: '#45a049' }, 
                marginRight: 2, 
                whiteSpace: 'nowrap' 
              }} 
              onClick={handleSubmitToPicnic}
            >
              Jetzt Picnicen
            </Button>
          </Tooltip>
          <Button 
            variant="contained" 
            className={styles.loeschenButton} 
            onClick={handleClearCart}
          >
            Löschen
          </Button>
        </Box>
      </Box>
      {/* Warenkorb-Icon mit Artikelanzahl */}
      <Box className={styles.cartIcon}>
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCart size={24} />
        </Badge>
      </Box>
    </Box>
  );
};

export default Cart;
