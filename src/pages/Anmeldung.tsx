import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContextType';
import styles from '../Anmeldung.module.css';
import Logo from '../assets/images/Logo.png'; 
import { getUserByEmail } from '../services/api';
import { Typography } from '@mui/material';

const Anmeldung: React.FC = () => {
    const [mail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setIsLoggedIn, setUser } = useAuth(); // Zugriff auf den AuthContext
    const [isAdmin, setIsAdmin] = useState<boolean>(false); // Zustand für den Login-Status
    
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
            const user = await getUserByEmail(mail); // Benutzer aus der API abrufen
            
            console.log(user); // Überprüfe die Struktur der Antwort
    
            if (user) {
                if (user.passwort === password) { // Passwort überprüfen
                    const validUser = {
                        emailAdresse: user.emailAdresse,
                        username: user.username || 'Unbekannter Benutzer',
                        passwort: user.passwort,
                        id: user.id,
                        foto: user.foto || 'default.jpg',
                        flag: user.flag, // Hier den flag-Wert setzen
                    };
                    setUser(validUser);
                    setIsLoggedIn(true);
                    navigate('/');
                } else {
                    setError('Falsches Passwort');
                }
            } else {
                setError('Benutzer nicht gefunden');
            }
        } catch (error) {
            console.error('Fehler beim Abrufen des Benutzers:', error);
            setError('Fehler bei der Anmeldung');
        }
    };
    

    return (
        <div className={styles.anmeldeContainer}>
            <img 
                className={styles.logo} 
                src={Logo} 
                alt="Logo" 
            />
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    {!error ? (
                        <>
                            <p className={styles.errorMessage}>{error}</p>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>E-Mail-Adresse</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    className={styles.inputField}
                                    value={mail}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>Passwort</label>
                                <input 
                                    id="password" 
                                    type="password" 
                                    className={styles.inputField}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <a href="/forgot-password" className={styles.forgotPassword}>Passwort vergessen?</a>
                                
                            </div>
                            <div className={styles.formActions}>
    <button 
        type="submit" 
        className={styles.submitButton}
    >
        Einloggen
    </button>
</div>
<div className={styles.formActions}>
    <Typography>Noch kein Nutzer? Dann</Typography>
    <Link to="/register" className={styles.registerLink}>Jetzt registrieren</Link>
</div>
                        </>
                    ) : (
                        <div className={styles.formActions}>
                            <button 
                                className={styles.submitButton} 
                                onClick={() => navigate("/home")} // Button, der zur Startseite führt
                            >
                                Zur Startseite
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Anmeldung;
