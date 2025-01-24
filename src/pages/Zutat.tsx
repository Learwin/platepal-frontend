import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { fetchZutatByIdImage, fetchZutatDerWoche } from '../services/api';
import NaehrwerteTabelle from './Naehrwerte';

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

interface ZutatDerWoche {
  id: number;
  name: string;
  imgUrl: string;
  von: string;
  bis: string;
  zutat: Zutat;
}

const Zutat: React.FC = () => {
  const [zutat, setZutat] = useState<Zutat | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [zutatDerWoche, setZutatDerWoche] = useState<ZutatDerWoche | null>(null);

  // Zutat der Woche laden
  useEffect(() => {
    const fetchZutatDerWocheData = async () => {
      try {
        const response = await fetchZutatDerWoche();
        const zutatData: ZutatDerWoche = {
          id: response.id,
          name: response.zutat.name || 'Unbekannte Zutat', // Fallback, falls name fehlt
          imgUrl: response.foto || 'fallback-image.jpg', // Fallback für Bild
          von: response.von,
          bis: response.bis,
          zutat: response.zutat,
        };

        setZutatDerWoche(zutatData);
        setZutat(zutatData.zutat);

        // Bild laden
        const imageResponse = await fetchZutatByIdImage(zutatData.zutat.id);
        setImageUrl(imageResponse.imageUrl);
      } catch (error) {
        console.error('Fehler beim Laden der Zutat der Woche:', error);
      }
    };

    fetchZutatDerWocheData();
  }, []);

  if (!zutat || !zutatDerWoche) {
    return <Typography variant="h6" align="center">Lade Zutat der Woche...</Typography>; // Ladeanzeige
  }

  return (
    <div
      style={{
        padding: '20px',
        width: '100%',
        maxWidth: '350px',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
      }}
    >
      <Card
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        {imageUrl && (
          <CardMedia
            component="img"
            alt={`Zutat der Woche: ${zutat.name}`}
            image={imageUrl || 'fallback-image.jpg'} // fallback-image.jpg als Platzhalter
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '200px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            }}
          />
        )}
        <CardContent sx={{ textAlign: 'center', padding: '16px' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {zutatDerWoche.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Verfügbar vom {zutatDerWoche.von} bis {zutatDerWoche.bis}
          </Typography>
        </CardContent>
      </Card>
  
      {/* Tooltip mit Nährwerten */}
      <Tooltip
        title={<NaehrwerteTabelle zutat={zutat} />}
        arrow
        placement="top"
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10,
            borderRadius: '50%',
            padding: '8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
export default Zutat;  