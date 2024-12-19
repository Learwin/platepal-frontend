import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Anmeldung.module.css';
import Logo from '../assets/images/Logo.png'; // Anpassen für den richtigen Pfad

const Anmeldung = () => {
    const [mail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleNavigateToAddRecipe = () => {
        navigate("/add-recipe"); // Navigiert zur "Rezept hinzufügen" Seite
    };

    const handleNavigateToHome = () => {
        navigate("/home"); // Navigiert zur Startseite
    };

    const handleRegister = () => {
        navigate("/register"); // Navigiert zur Registrierungsseite
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail, password }),
            });

            if (response.ok) {
                console.log("Anmeldung erfolgreich");
                setIsLoggedIn(true); // Benutzer als eingeloggt markieren
            } else {
                console.error('Login fehlgeschlagen');
            }
        } catch (error) {
            console.error('Ein Fehler ist aufgetreten:', error);
        }
    };

    return (
        <div className={styles.anmeldeContainer}>
            <img 
                className={styles.logo} 
                src={Logo} 
                alt="Logo" 
                onClick={handleNavigateToHome} 
            />
            <div className={styles.formContainer}>
                {!isLoggedIn ? (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>E-Mail-Adresse</label>
                            <input 
                                id="email" 
                                type="email" 
                                className={styles.inputField}
                                value={mail}
                                onChange={(e) => setEmail(e.target.value)}
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
                            />
                            <a href="/forgot-password" className={styles.forgotPassword}>Passwort vergessen?</a>
                        </div>
                        <div className={styles.formActions}>
                            <button 
                                type="submit" 
                                className={styles.submitButton} 
                                onClick={handleSubmit}
                            >
                                Einloggen
                            </button>
                        </div>
                        <div className={styles.registerLink}>
                            <span>Du hast kein Account? </span>
                            <button 
                                className={styles.registerButton} 
                                onClick={handleRegister}
                            >
                                Jetzt Registrieren
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.formActions}>
                        <button 
                            className={styles.submitButton} 
                            onClick={handleNavigateToAddRecipe}
                        >
                            Rezept hinzufügen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Anmeldung;
