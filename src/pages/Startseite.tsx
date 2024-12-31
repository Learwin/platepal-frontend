import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import styles from '../Startseite.module.css'; // CSS-Modul
import { fetchRezepte, fetchZutatDerWoche } from '../services/api'; // API-Funktionen
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
  kcal?: number;
  fett?: number;
  gesaettigteFettsaeuren?: number;
  kohlenhydrate?: number;
  zucker?: number;
  ballaststoffe?: number;
  eiweiss?: number;
  salz?: number;
  imgUrl: string;
  allergene?: Allergen[];
}

interface Allergen {
  id: number;
  name: string;
}

const Startseite: React.FC = () => {
  const [zutatDerWoche, setZutatDerWoche] = useState<ZutatProps | null>(null);
  const [rezepte, setRezepte] = useState<Recipe[]>([]);

  // Zutat der Woche laden
  useEffect(() => {
    const fetchZutat = async () => {
      try {
        const data = await fetchZutatDerWoche(); // API-Aufruf für die Zutat der Woche
        setZutatDerWoche({
          id: data.zutat.id,  // Stelle sicher, dass 'id' übergeben wird
          name: data.zutat.name,
          imgUrl: data.zutat.foto,
        });
      } catch (error) {
        console.error('Fehler beim Abrufen der Zutat der Woche:', error);
      }
    };
  
    fetchZutat();
  }, []);

  // Rezepte laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRezepte = await fetchRezepte();
        setRezepte(fetchedRezepte);
      } catch (error) {
        console.error('Fehler beim Abrufen der Rezepte:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Zutat der Woche */}
      <Typography variant="h4" gutterBottom className={styles.zutatBalken}>
        Zutat der Woche
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        {/* Zutat der Woche */}
        <Grid item xs={12} sm={6}>
          {zutatDerWoche ? (
            <Zutat />
          ) : (
            <Typography variant="body1" color="text.secondary">
              Keine Zutat der Woche ausgewählt.
            </Typography>
          )}
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
