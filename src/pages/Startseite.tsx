import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import styles from '../Startseite.module.css'; // CSS-Modul
import {  fetchRezepte, fetchZutatDerWoche } from '../services/api'; // API-Funktionen
import RezeptCarousel from './RezepteCarousel';
import Zutat from './Zutat'; // Zutat-Komponente importieren

// Interface für Rezept
interface Recipe {
  id: number;
  name: string;
  foto: string;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  durchschnittlicheBewertung: number;
  flag: number;
  user_Id: {
    id: number;
    username: string;
    passwort: string;
    emailAdresse: string;
    foto?: string;
  };
  zutaten: {
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
    allergene: {
      id: number;
      name: string;
      zutaten: string[];
    }[];
    rezepte: string[];
  }[];
}

// Interface für Zutat
interface ZutatProps {
  id: number;
  name: string;
  imgUrl: string;
}

const Startseite: React.FC = () => {
  const [zutatDerWoche, setZutatDerWoche] = useState<ZutatProps | null>(null);
  const [rezepte, setRezepte] = useState<Recipe[]>([]);

  // Zutat der Woche und Rezepte laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lade Zutat der Woche
        const zutatData = await fetchZutatDerWoche();
        setZutatDerWoche({
          id: zutatData.zutat.id,
          name: zutatData.zutat.name,
          imgUrl: zutatData.zutat.foto,
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
          <RezeptCarousel
            rezepte={rezepte}
            zutatDerWocheId={zutatDerWoche?.id ?? 0}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Startseite;
