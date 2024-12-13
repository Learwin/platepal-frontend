import Logo from '../assets/images/Logo.png'; 
import styles from '../Anmeldung.module.css';


function Anmeldung() {
    return (
        <div className={styles.anmeldeContainer}>
            <img className={styles.logo} src={Logo} alt="Logo" />
            <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>E-Mail-Adresse</label>
                    <input id="email" type="email" className={styles.inputField} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Passwort</label>
                    <input id="password" type="password" className={styles.inputField} />  
                     <a href="/forgot-password" className={styles.forgotPassword}>Passwort vergessen?</a>
                </div>
                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton}>Einloggen</button>
                 
                </div>
                <div className={styles.registerLink}>
                    <span>Du hast kein Account? </span>
                    <a href="/register" className={styles.registerButton}>Jetzt Registrieren</a>
                </div>
            </div>
        </div>
    );
}

export default Anmeldung;