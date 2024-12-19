import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pfad anpassen
import styles from '../Anmeldung.module.css'; // Anpassen für den richtigen Pfad
import Logo from '../assets/images/Logo.png'; // Ersetzen durch den richtigen Pfad
import { useAuth } from '../context/AuthContextType';

const Register: React.FC = () => {
    const [emailAdresse, setEmail] = useState<string>('');
    const [passwort, setPassword] = useState<string>('');
    const [username, setUser] = useState<string>('');
    const { setIsLoggedIn } = useAuth(); // Zugreifen auf die Funktion, um isLoggedIn zu setzen
    const navigate = useNavigate();

    const handleNavigateToVerwaltung = (): void => {
        navigate("/profil"); // Weiterleitung zur Verwaltungsseite
        console.log("Registrierung erfolgreich - Weiterleitung zur Verwaltungsseite");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailAdresse, passwort, username }),
            });

            if (response.ok) {
                console.log("Registrierung ok");
                setIsLoggedIn(true); // Benutzer als eingeloggt markieren
                handleNavigateToVerwaltung(); // Redirect nach erfolgreicher Anmeldung
            } else {
                console.error('Registrierung fehlgeschlagen');
                // handle error, e.g., show a message to the user
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className={styles.anmeldeContainer}>
            <img className={styles.logo} src={Logo} alt="Logo" />
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>E-Mail-Adresse</label>
                        <input 
                            id="email" 
                            type="email" 
                            className={styles.inputField}
                            value={emailAdresse}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="user" className={styles.user}>Benutzername</label>
                        <input 
                            id="user" 
                            type="text" 
                            value={username}
                            className={styles.inputField}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Passwort</label>
                        <input 
                            id="password" 
                            type="password" 
                            className={styles.inputField}
                            value={passwort}
                            onChange={(e) => setPassword(e.target.value)}
                        /> 
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>Jetzt Registrieren</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
