import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LogoBild from '../assets/images/Logo.png';
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, Badge } from '@mui/material';
import { ShoppingCart } from 'lucide-react';
import { useCheckedContext } from '../context/CheckedContext';
import { useAuth } from '../context/AuthContextType'; // AuthContext importieren
import styles from "../Startseite.module.css";
import Cart from '../pages/Cart';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth(); // Zustand aus dem AuthContext verwenden
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { checkedCount } = useCheckedContext();
  const { cartItems } = useCart();


  // State für das Menu (ob es geöffnet oder geschlossen ist)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = (): void => {
    setIsLoggedIn(false); // isLoggedIn im AuthContext zurücksetzen
    setUser(null); // Benutzerdaten im AuthContext zurücksetzen
    navigate("/home");
    setAnchorEl(null); // Menu nach dem Logout schließen
  };

  const handleClick = (): void => {
    navigate("/login");
    setAnchorEl(null); // Menu nach dem Login schließen
  };

  const handleProfileClick = (): void => {
    navigate("/profil");
    setAnchorEl(null); // Menu nach dem Profilaufruf schließen
  };

  const handleCartClick = (): void => {
    setIsCartOpen(!isCartOpen);
  };

  const handleLogoClick = () => {
    navigate("/home", { state: { isLoggedIn } });
  };

  const settings = isLoggedIn ? ['Profil', 'Logout'] : ['Login'];

  // Funktion zum Öffnen des Menüs beim Klick auf das Avatar
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Funktion zum Schließen des Menüs
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="absolute" className={styles.appBar}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
          <img 
  src={LogoBild} 
  alt="Logo" 
  className={styles.logo} 
  onClick={handleLogoClick} 
  style={{ cursor: 'pointer' }} 
/>

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button className={styles.navButton} onClick={() => navigate('/magazin')}>Magazin</Button>
              <Button className={styles.navButton} onClick={() => navigate('/blog')}>Blog</Button>
              <Button className={styles.navButton} onClick={() => navigate('/ueber-uns')}>Über Uns</Button>
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {isLoggedIn && (
                <IconButton onClick={handleCartClick} sx={{ color: 'inherit', marginRight: 2 }}>
                  <Badge badgeContent={cartItems.length} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              )}

              <Tooltip title="Open settings">
                <IconButton sx={{ p: 0 }} onClick={handleMenuClick}>
                  <Avatar alt="User Avatar" src={user?.foto || "/static/images/avatar/2.jpg"} />
                </IconButton>
              </Tooltip>

              {/* Das Menü wird jetzt basierend auf anchorEl geöffnet */}
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={
                      setting === 'Login'
                        ? handleClick
                        : setting === 'Logout'
                        ? handleLogout
                        : handleProfileClick
                    }
                  >
                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  );
};

export default Navbar;



//NAvbar kontrollieren