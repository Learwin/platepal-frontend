import React from 'react';
import { Box, IconButton, Typography, Button, Divider, Tooltip } from '@mui/material';
import { CircleMinus, CirclePlus, CircleX } from 'lucide-react'; // Icons für + und -
import { useCart } from '../context/CartContext'; // Zugriff auf CartContext
import styles from '../Layout.module.css';

const Cart: React.FC<{ isCartOpen: boolean; setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>; }> = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, addItemToCart, decreaseItemQuantity, clearCart } = useCart(); // Zugriff auf CartContext

  const closeCart = (): void => {
    setIsCartOpen(false);
  };

  const handleSubmitToPicnic = () => {
    // Logik zum Absenden an Picnic hier einfügen
    console.log('Absenden an Picnic', cartItems);
  };

  return (
    <Box 
      className={`${styles.cartOverlay} ${isCartOpen ? styles.open : ''}`}
      onMouseLeave={closeCart} // Schließt den Warenkorb, wenn der Mauszeiger den Bereich verlässt
    >
      <Box className={styles.cartContent}>
        <Box className={styles.cartHeader}>
          <Typography variant="h6">Einkaufswagen</Typography>
          <IconButton onClick={closeCart} className={styles.closeButton}>
            <CircleX size={20} /> {/* Icon für Schließen */}
          </IconButton>
        </Box>
        <Box>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <Box key={item.id} className={styles.cartItem}>
                <Typography>Geben Sie nur Stückzahlen an.</Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography>{item.name}</Typography>
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
                {index < cartItems.length - 1 && <Divider />} {/* Divider zwischen den Zutaten */}
              </Box>
            ))
          ) : (
            <Typography>Der Einkaufswagen ist leer.</Typography>
          )}
        </Box>
    
        <Box display="flex" justifyContent="space-between" mt={2} className={styles.cartButtons}>
        <Tooltip 
    title='Wenn Sie auf "Jetzt Picnicen" klicken, werden die Zutaten im Einkaufskorb an Picnic gesendet.'
    arrow // Optionale Pfeilspitze für das Tooltip
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
  onClick={clearCart}
>
  Löschen
</Button>

        </Box>
      </Box>
    </Box>
  );
};

export default Cart;


//Warenkorb löschen funktiniert. Nur müssen die checkboxen deaktiviert werden. das Icon Warenkorb
// muss eine Anzahl von den im Warenkorb befindlichen Zutaten aufweisen.