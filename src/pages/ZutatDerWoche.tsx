import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, InputLabel, FormControl, SelectChangeEvent} from '@mui/material';
import styles from '../ZutatDerWoche.module.css';

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

const API_URL = 'http://localhost:8080';

const postZutatDerWoche = async (zutatDerWoche: ZutatDerWocheData): Promise<ZutatDerWocheData> => {
  try {
    const response = await fetch(`${API_URL}/zutatderwoche`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zutatDerWoche),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern der Zutat der Woche: ${response.statusText}`);
    }

    return await response.json(); 
  } catch (error) {
    console.error('Fehler beim Speichern der Zutat der Woche:', error);
    throw error;
  }
};

const ZutatDerWoche: React.FC = () => {
  const [zutaten, setZutaten] = useState<Zutat[]>([]);
  const [selectedZutat, setSelectedZutat] = useState<number | string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [zutatDerWoche, setZutatDerWoche] = useState<Zutat | null>(null);

  useEffect(() => {
    const fetchZutaten = async () => {
      try {
        const response = await fetch('http://localhost:8080/zutat/list');
        if (!response.ok) {
          throw new Error(`Fehler beim Abrufen der Zutaten: ${response.statusText}`);
        }
        const data: Zutat[] = await response.json();
        setZutaten(data);

        // Wenn Zutat der Woche bereits gespeichert ist, lade sie
        const responseZutatDerWoche = await fetch('http://localhost:8080/zutatderwoche/current');
        if (responseZutatDerWoche.ok) {
          const zutatWocheData: ZutatDerWocheData = await responseZutatDerWoche.json();

          // Überprüfen, ob die Zutat der Woche für den aktuellen Zeitraum gültig ist
          const today = new Date().toISOString().split('T')[0];
          if (zutatWocheData.von <= today && zutatWocheData.bis >= today) {
            setZutatDerWoche(zutatWocheData.zutat);
            setSelectedZutat(zutatWocheData.zutat.id); // Zutat der Woche vorab auswählen
            setFromDate(zutatWocheData.von); // Zeitraum setzen
            setToDate(zutatWocheData.bis);   // Zeitraum setzen
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Zutaten:', error);
      }
    };

    fetchZutaten();
  }, []);

  const handleZutatChange = (event: SelectChangeEvent<string | number>) => {
    const selectedId = event.target.value;
    setSelectedZutat(selectedId);

    
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };

  const handleSave = async () => {
    const selectedZutatObj = zutaten.find((z) => z.id === selectedZutat);
    if (!selectedZutatObj) {
      console.error('Zutat nicht gefunden.');
      return;
    }

    const payload: ZutatDerWocheData = {
      id: 0,
      von: fromDate,
      bis: toDate,
      zutat: selectedZutatObj,
    };

    try {
      const savedData = await postZutatDerWoche(payload);
      console.log('Zutat der Woche erfolgreich gespeichert:', savedData);
      setZutatDerWoche(savedData.zutat); // Aktualisiere die Zutat der Woche
    } catch (error) {
      console.error('Fehler beim Speichern der Zutat der Woche:', error);
    }
  };

  /* Hole das Bild für die Zutat der Woche
  const fetchZutatImage = async (id: number): Promise<string> => {
    console.log(`Fetching image for Zutat with ID: ${id}`);
    try {
      const response = await fetch(`${API_URL}/zutat/image/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream', // Erwartet Binärdaten (Bild)
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Hole den Content-Type vom Server (falls verfügbar)
      const contentType = response.headers.get('Content-Type') || '';
      let mimeType = 'image/jpeg'; // Standard-MIME-Typ

      if (contentType.includes('image/png')) {
        mimeType = 'image/png';
      } else if (contentType.includes('image/jpg')) {
        mimeType = 'image/jpeg';
      }

      // Konvertiere den Bitstrom in einen Base64-String
      const arrayBuffer = await response.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      console.error('Fehler beim Abrufen des Zutat-Bildes:', error);
      throw error;
    }
  };*/

  return (
    <div className={styles.container}>
      <Box>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Zutat auswählen</InputLabel>
          <Select
            value={selectedZutat}
            onChange={handleZutatChange}
            label="Zutat auswählen"
          >
            {zutaten.map((zutat) => (
              <MenuItem key={zutat.id} value={zutat.id}>
                {zutat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box style={{ marginBottom: '20px' }}>
          <TextField
            label="Von"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box style={{ marginBottom: '20px' }}>
          <TextField
            label="Bis"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!selectedZutat || !fromDate || !toDate}
        >
          Speichern
        </Button>
      </Box>
    </div>
  );
};

export default ZutatDerWoche;
