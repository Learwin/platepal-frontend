import React from 'react';
import styles from "./Startseite.module.css";
import HintergrundBild from '../assets/images/Hintergrund.png';
import BroccoliBild from '../assets/images/Broccoli.png';
import BroccoliRezept from '../assets/images/BroccoliRezept.png';
import Banane from '../assets/images/Banane.png';
import Mango from '../assets/images/Mango.png';
import Milch from '../assets/images/Milch.png';
import LogoBild from '../assets/images/Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import für Bootstrap CSS


export default function Startseite () {
  return (
    <div className={styles.desktop1}>
      <img className={styles.hintergrund} src={HintergrundBild} alt="Hintergrundbild" />
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
      <div className={styles.sucheUndSlider}>
        <img className={styles.rectangle2} src="../assets/images/rectangle-20.svg" alt="erg" />
        <div className={styles.frame8}>
          <div className={styles.frame7}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame82}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame10}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame11}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame12}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame13}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame14}>
            <div className={styles.ellipse12}></div>
          </div>
          <div className={styles.frame15}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame16}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame17}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame18}>
            <div className={styles.ellipse12}></div>
          </div>
          <div className={styles.frame19}>
            <div className={styles.ellipse12}></div>
          </div>
          <div className={styles.frame20}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame21}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame22}>
            <div className={styles.ellipse12}></div>
          </div>
          <div className={styles.frame23}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame24}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame25}>
            <div className={styles.ellipse1}></div>
          </div>
          <div className={styles.frame26}>
            <div className={styles.ellipse1}></div>
          </div>
        </div>
      </div>
      <div className={styles.zutatderWoche}>
        <div className={styles.frame30}>
          <div className={styles.group3}>
            <div className={styles.rectangle9}></div>
            <img className={styles.group2} src={BroccoliBild} alt="rgeag"/>
          </div>
          <div className={styles.group4}>
            <div className={styles.rectangle92}></div>
            <img className={styles.group2} src={BroccoliRezept} alt="rgeag"/>
          </div>
        </div>
        <div className={styles.frame32}>
          <div className={styles.frame37}>
            <div className={styles.zutatDerWoche2}>Zutat der Woche </div>
          </div>
        </div>
      </div>
      <div className={styles.textVergangeneZutaten}>
        <div className={styles.frame372}>
          <div className={styles.vergangeneZutatenDerWoche}>
            Vergangene Zutaten der Woche{" "}
          </div>
        </div>
      </div>
      <div className={styles.boxVergangeneZutaten}>
        <div className={styles.rectangle93}></div>
        <div className={styles.frame54}>
          <div className={styles.group32}>
            <div className={styles.rectangle94}></div>
            <img className={styles.group23} src={Milch} alt="regrg"/>
          </div>
          <img className={styles.group24} src={Mango}alt="reagre"/>
          <div className={styles.group32}>
            <div className={styles.rectangle95}></div>
            <img className={styles.group25} src={Banane} alt="rgeg"/>
          </div>
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.rectangle5}></div>
        <div className={styles.frame29}>
          <div className={styles.sponsoring2}>Sponsoring </div>
          <div className={styles.magazin2}>Magazin </div>
          <div className={styles.berUns}>Über Uns </div>
          <div className={styles.anmeldeButton}>
            <div className={styles.anmelden2}>Anmelden </div>
          </div>
        </div>
        <img className={styles.logo} src={LogoBild} alt="Logobild"/>
      </div>
    </div>
  );
};