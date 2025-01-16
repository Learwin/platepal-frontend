import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { fetchZutatByIdImage } from '../services/api';

interface ZutatProps {
  id: number;
  name: string;
  imgUrl: string;
}

const Zutat: React.FC<{ zutat: ZutatProps }> = ({ zutat }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
      const fetchImage = async () => {
        try {
          const response = await fetchZutatByIdImage(zutat.id);
          console.log('API Response:', response);
          setImageUrl(response.imageUrl); // Stelle sicher, dass foto gesetzt wird
        } catch (error) {
          console.error('Fehler beim Laden des Bildes:', error);
        }
      };
    
      fetchImage();
    }, [zutat.id]);
    

  return (
    <div style={{ padding: '20px', width: '100%', maxWidth: '350px', margin: '0 auto' }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        {imageUrl && (
         <CardMedia
         component="img"
         alt={`Zutat der Woche: ${zutat.name}`}
         image={imageUrl || 'fallback-image.jpg'}  // fallback-image.jpg als Platzhalter
         style={{
           objectFit: 'cover',
           width: '100%',
           height: '200px', // Setze eine Höhe für das Bild
           borderTopLeftRadius: '8px',
           borderTopRightRadius: '8px',
         }}
       />
        )}
        <CardContent>
          <Typography variant="h5" component="div" align="center">
            {zutat.name}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Zutat;
