import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { fetchRezepte, fetchZutatDerWoche, Recipe } from '../services/api'; // Beispiel für API-Funktionen
import styles from '../Startseite.module.css'; // Beispiel für CSS-Modul
import Zutat from './Zutat'; // Zutat-Komponente importieren
import RezepteCarousel from './RezepteCarousel';

// Schnittstellen für Zutat und Zutat der Woche
interface Zutat {
  id: number;
  name: string;
  kcal: number;
  fett: number;
  gesaettigteFettsaeuren: number;
  kohlenhydrate: number;
  zucker: number;
  ballaststoffe: number;
  eiweiss: number;
  salz: number;
  foto: string;
}

interface ZutatDerWocheData {
  id: number;
  von: string;
  bis: string;
  zutat: Zutat;
}

interface ZutatDerWoche {
  id: number;
  name: string;
  imgUrl: string;
  von: string;
  bis: string;
  zutat: Zutat;
}

const API_URL = 'http://localhost:8080';

const Startseite: React.FC = () => {
  const [zutatDerWoche, setZutatDerWoche] = useState<ZutatDerWoche | null>(null);
  const [rezepte, setRezepte] = useState<Recipe[]>([]);

  // Zutat der Woche und Rezepte laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lade Zutat der Woche
        const zutatData = await fetchZutatDerWoche();
        setZutatDerWoche({
          id: zutatData.id,
          name: zutatData.zutat.name,
          imgUrl: zutatData.zutat.foto,
          von: zutatData.von,
          bis: zutatData.bis,
          zutat: zutatData.zutat, // Stellt sicher, dass die Zutat korrekt übergeben wird
        });

        // Lade Rezepte
        const fetchedRezepte = await fetchRezepte();
        setRezepte(fetchedRezepte);
      } catch (error) {
        console.error('Fehler beim Abrufen der Zutat der Woche und Rezepte:', error);
      }
    };

    fetchData();
  }, []);

  if (!zutatDerWoche) {
    return <Typography variant="h6" align="center">Lade Zutat der Woche...</Typography>; // Ladeanzeige bis Zutat verfügbar
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Zutat der Woche */}
      <Typography variant="h4" gutterBottom className={styles.zutatBalken}>
        Zutat der Woche
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        {/* Zutat der Woche */}
        <Grid item xs={12} sm={6}>
          <Zutat zutat={zutatDerWoche} />
        </Grid>

        {/* Rezept Carousel */}
        <Grid item xs={12} sm={6}>
          <RezepteCarousel
            rezepte={rezepte}
            zutatDerWoche={zutatDerWoche} // Übergabe der vollständigen Zutat
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Startseite;
