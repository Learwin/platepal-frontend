import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Tooltip, Typography, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // "i"-Icon
import { fetchRezepte, fetchZutatDerWoche, Recipe, User } from '../services/api'; // Beispiel für API-Funktionen
import styles from '../Startseite.module.css'; // Beispiel für CSS-Modul
import RezepteCarousel from './RezepteCarousel';
import NaehrwerteTabelle from './Naehrwerte';
import Zutat from './Zutat';

// Schnittstellen für Zutat und Zutat der Woche


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

interface Rezept {
  id: number;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  user_Id: User;
  durchschnittlicheBewertung: number;
  name: string;
}



const Startseite: React.FC =() => {
  const [recipes, setRecipes] = useState<Rezept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zutatDerWoche, setZutatDerWoche] = useState<ZutatDerWoche | null>(null);


  // Zutat der Woche und Rezepte laden
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const fetchedRezepte = await fetchRezepte(); // Rezepte *mit* Bildern laden
            setRecipes(fetchedRezepte);
            const zutatData = await fetchZutatDerWoche();
            setZutatDerWoche({
                id: zutatData.id,
                name: zutatData.zutat.name,
                imgUrl: zutatData.zutat.foto,
                von: zutatData.von,
                bis: zutatData.bis,
                zutat: zutatData.zutat
              });
        } catch (error) {
            console.error('Fehler beim Abrufen der Zutat der Woche und Rezepte:', error);
            setError("Fehler beim Laden der Daten");
        } finally {
            setLoading(false);
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
        {/* Zutat der Woche als Card */}
        <Grid item xs={12} sm={6}>
          <Zutat />
            
            
        </Grid>

        {/* Rezept Carousel */}
        <Grid item xs={12} sm={6}>
          <RezepteCarousel
            rezepte={recipes}
            zutatDerWoche={zutatDerWoche} // Übergabe der vollständigen Zutat
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Startseite;
