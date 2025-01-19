import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { fetchRezeptByIdImage } from '../services/api';

// Interface für Rezept
interface Recipe {
  id: number;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  user_Id: {
    id: number;
    username: string;
    passwort: string;
    emailAdresse: string;
  };
  durchschnittlicheBewertung: number;
  name: string;
  zutaten: Array<{
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
    allergene: Array<{
      id: number;
      name: string;
      zutaten: string[];
    }>;
    rezepte: string[];
  }>;
}

const RezeptCarousel: React.FC<{ rezepte: Recipe[]; zutatDerWocheId: number }> = ({ rezepte, zutatDerWocheId }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState<{ [key: number]: string }>({});

  const handleClick = (rezeptId: number) => {
    navigate(`/rezept/${rezeptId}`);
  };

  const loadImages = useCallback(async () => {
    try {
      const imagePromises = rezepte.map((rezept) =>
        fetchRezeptByIdImage(rezept.id).then((data) => {
          console.log('Geladene URL:', data.imageUrl); // Überprüfe die Bild-URL
          return {
            id: rezept.id,
            imageUrl: data.imageUrl,
          };
        })
      );
  
      const imageResults = await Promise.all(imagePromises);
      const newImages = imageResults.reduce((acc, { id, imageUrl }) => {
        acc[id] = imageUrl;
        return acc;
      }, {} as { [key: number]: string });
  
      setImages(newImages);
    } catch (error) {
      console.error('Fehler beim Laden der Bilder:', error);
    }
  }, [rezepte]); // useCallback stellt sicher, dass die Funktion nur dann neu erstellt wird, wenn sich rezepte ändern.
  
  useEffect(() => {
    if (rezepte.length > 0) {
      loadImages();
    }
  }, [rezepte, loadImages]);
  

  const filteredRezepte = rezepte.filter((rezept) =>
    rezept.zutaten.some((zutat) => zutat.id === zutatDerWocheId)
  );

  return (
    <Carousel
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      dynamicHeight={false}
      interval={3000}
    >
      {filteredRezepte.map((rezept) => (
        <div
          key={rezept.id}
          onClick={() => handleClick(rezept.id)}
          style={{ cursor: 'pointer', padding: '20px' }}
        >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              alt={`Rezept: ${rezept.name}`}
              image={images[rezept.id] || rezept.foto}
              sx={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
              }}
            />
            <CardContent sx={{ flexGrow: 0 }}>
              <Typography variant="h5" component="div" align="center">
                {rezept.name}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Carousel>
  );
};

export default RezeptCarousel;


//Carousel funktioniert auch nicht.
