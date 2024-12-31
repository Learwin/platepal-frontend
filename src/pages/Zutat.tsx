import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { fetchZutatDerWoche, fetchZutatByIdImage } from '../services/api';

interface ZutatProps {
  id?: number;
  name: string;
  imgUrl: string;
}

const Zutat: React.FC = () => {
  const [zutatDerWoche, setZutatDerWoche] = useState<ZutatProps | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Zutat der Woche und Bild laden
  useEffect(() => {
    const fetchZutat = async () => {
      try {
        const data = await fetchZutatDerWoche(); // API-Aufruf für die Zutat der Woche
        setZutatDerWoche({
          id: data.id,
          name: data.zutat.name,
          imgUrl: data.zutat.foto,
        });

        // Lade das Bild der Zutat der Woche
        if (data.id) {
          const imageData = await fetchZutatByIdImage(data.id); // Hole das Bild mit der Zutat-ID
          setImageUrl(imageData.imageUrl); // Setze das Bild-URL
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Zutat der Woche:', error);
      }
    };

    fetchZutat();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {zutatDerWoche ? (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardMedia
            component="img"
            alt={`Zutat der Woche: ${zutatDerWoche.name}`}
            image={imageUrl || zutatDerWoche.imgUrl} // Nutze das Bild, das durch die API geliefert wurde
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '300px', // Höhe des Bildes angepasst
            }}
          />
          <CardContent>
            <Typography variant="h5" component="div" align="center">
              {zutatDerWoche.name}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" align="center">
          Keine Zutat der Woche ausgewählt.
        </Typography>
      )}
    </div>
  );
};

export default Zutat;
