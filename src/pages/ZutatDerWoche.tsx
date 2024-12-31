import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
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

    return await response.json(); // Gibt die gespeicherte Zutat der Woche zurück
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

  useEffect(() => {
    const fetchZutaten = async () => {
      try {
        const response = await fetch('http://localhost:8080/zutat/list');
        if (!response.ok) {
          throw new Error(`Fehler beim Abrufen der Zutaten: ${response.statusText}`);
        }
        const data: Zutat[] = await response.json();
        setZutaten(data);
      } catch (error) {
        console.error('Fehler beim Laden der Zutaten:', error);
      }
    };

    fetchZutaten();
  }, []);

  const handleZutatChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedZutat(event.target.value);
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
    } catch (error) {
      console.error('Fehler beim Speichern der Zutat der Woche:', error);
    }
  };

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
