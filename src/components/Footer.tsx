import React from 'react';
import styles from "../Startseite.module.css";

function Footer(){
    return (
    
        <div className={styles.footer}>
        <div className={styles.frame5}>
          <div className={styles.frame1}>
            <div className={styles.unternehmen}>UNTERNEHMEN </div>
            <div className={styles.kontakt}>Kontakt </div>
            <div className={styles.agb}>AGB </div>
            <div className={styles.presse}>Presse </div>
            <div className={styles.jobs}>Jobs </div>
            <div className={styles.impressum}>Impressum </div>
            <div className={styles.datenschutz}>Datenschutz </div>
            <div className={styles.datenschutzEinstellungen}>
              Datenschutz-Einstellungen{" "}
            </div>
          </div>
          <div className={styles.frame2}>
            <div className={styles.quickLinks}>QUICK LINKS </div>
            <div className={styles.zutatDerWoche}>Zutat der Woche </div>
            <div className={styles.anmelden}>Anmelden </div>
            <div className={styles.registrieren}>Registrieren </div>
            <div className={styles.magazin}>Magazin </div>
            <div className={styles.sponsoring}>Sponsoring </div>
          </div>
          <div className={styles.frame3}>
            <div className={styles.newsletter}>NEWSLETTER </div>
            <div className={styles.zumNewsletterAnmelden}>
              Zum Newsletter anmelden{" "}
            </div>
            <div className={styles.faq}>FAQ </div>
          </div>
          <div className={styles.frame4}>
            <div className={styles.beliebteSuche}>BELIEBTE SUCHE </div>
            <div className={styles.muffinsVegen}>muffins vegen </div>
            <div className={styles.suppen}>suppen </div>
            <div className={styles.dessert}>dessert </div>
            <div className={styles.plTzchen}>plätzchen </div>
            <div className={styles.mango}>mango </div>
          </div>
        </div>
      </div>
    
    );
}

export default Footer;