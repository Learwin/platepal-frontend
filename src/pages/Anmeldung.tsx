import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Anmeldung.module.css'; // Anpassen für den richtigen Pfad
import Logo from '../assets/images/Logo.png'; // Ersetzen durch den richtigen Pfad

const Anmeldung = () => {
    const [mail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleNavigate = (): void => {
        navigate("/home"); // Navigiert zur Anmeldeseite
        console.log("test");
    };

    const handleRegister= (): void => {
        navigate("/register"); // Navigiert zur Anmeldeseite
        console.log("test");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        console.log("Click")
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
                console.log("Anmeldung ok");
                handleNavigate(); // Redirect nach erfolgreicher Anmeldung
            } else {
                console.error('Login fehlgeschlagen');
                // handle error, e.g., show a message to the user
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className={styles.anmeldeContainer}>
            <img className={styles.logo} src={Logo} alt="Logo" onClick={handleNavigate}/>
            <div className={styles.formContainer}>
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
                    <button type="submit" className={styles.submitButton} onClick={handleSubmit}>Einloggen</button>
                </div>
                <div className={styles.registerLink}>
                    <span>Du hast kein Account? </span>
                    <a href="/register" className={styles.registerButton} onClick={handleRegister}>Jetzt Registrieren</a>
                </div>
            </div>
        </div>
    );
}

export default Anmeldung;
