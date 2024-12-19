import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import Zutat from './Zutat';
import RezepteCarousel from './RezepteCarousel';
import { fetchZutatByIdImage, fetchZutatDerWoche } from '../services/api';

interface ZutatDerWoche {
    id: number;
    von: string;
    bis: string;
    zutat: {
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
      imageUrl?: string
    };
  }

  const Startseite: React.FC = () => {
    const [zutat, setZutat] = useState<{ name: string; imageUrl: string } | null>(null);
    const [rezepte, setRezepte] = useState<Array<{ id: number; name: string; imageUrl: string }>>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const zutatDerWocheArray = await fetchZutatDerWoche();
  
          if (!zutatDerWocheArray || zutatDerWocheArray.length === 0) {
            console.error('Zutat der Woche Array ist leer oder undefined');
            return;
          }
  
          const ersteZutat = zutatDerWocheArray[0]; // Wählen Sie die erste Zutat aus dem Array

          const zutatData = await fetchZutatByIdImage(ersteZutat.zutat.id);

          setZutat({
              
              name: ersteZutat.zutat.name,
              imageUrl: zutatData.imageUrl // Bild-URL aus der `fetchZutatByIdImage` Funktion
          });
      } catch (error) {
          console.error('Error fetching Zutat der Woche:', error);
      }
  };

  fetchData();
}, []);

return (
  <Container>
      <Grid container spacing={3}>
          {/* Zutat der Woche */}
          <Grid item xs={12} sm={6}>
              {zutat ? (
                  <Zutat name={zutat.name} imageUrl={zutat.imageUrl} />
              ) : (
                  <p>Lade Zutat der Woche...</p>
              )}
          </Grid>

          {/* Rezepte Carousel */}
          <Grid item xs={12} sm={6}>
              <RezepteCarousel rezepte={rezepte} />
          </Grid>
      </Grid>
  </Container>
);
};

export default Startseite;