import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { postZutat } from '../services/api';

interface Allergen {
  id: number;
  name: string;
  zutaten: string[];
}

interface Ingredient {
  id: number;
  name: string;
  menge: number;
  einheit: string;
  foto: string;
  kcal: number;
  fett: number;
  gesaettigteFettsaeuren: number;
  kohlenhydrate: number;
  zucker: number;
  ballaststoffe: number;
  eiweiss: number;
  salz: number;
  allergene: Allergen[];
}

const Zutatenverwaltung = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    id: 0,
    name: '',
    menge: 0,
    einheit: '',
    foto: './images/ingredient/zucker.png',
    kcal: 0,
    fett: 0,
    gesaettigteFettsaeuren: 0,
    kohlenhydrate: 0,
    zucker: 0,
    ballaststoffe: 0,
    eiweiss: 0,
    salz: 0,
    allergene: [],
  });
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Ingredient
  ) => {
    setNewIngredient({ ...newIngredient, [field]: event.target.value });
  };

  const handleSaveIngredient = async () => {
    if (!newIngredient.name || newIngredient.menge <= 0 || !newIngredient.einheit) {
      alert('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    try {
      const savedIngredient = await postZutat(newIngredient); // Post the ingredient to the backend
      setIngredients([...ingredients, savedIngredient]); // Update the state with the saved ingredient
      setNewIngredient({
        id: 0,
        name: '',
        menge: 0,
        einheit: '',
        foto: './images/ingredient/zucker.png',
        kcal: 0,
        fett: 0,
        gesaettigteFettsaeuren: 0,
        kohlenhydrate: 0,
        zucker: 0,
        ballaststoffe: 0,
        eiweiss: 0,
        salz: 0,
        allergene: [],
      });
      setIsFormVisible(false); // Hide the form
    } catch (error) {
      console.error('Fehler beim Speichern der Zutat:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setNewIngredient({ ...newIngredient, foto: fileUrl });
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsFormVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Zutat Hinzufügen
      </Button>

      {isFormVisible && (
        <Box>
          <TextField
            label="Zutat Name"
            variant="outlined"
            value={newIngredient.name}
            onChange={(e) => handleInputChange(e, 'name')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Menge"
            variant="outlined"
            type="number"
            value={newIngredient.menge}
            onChange={(e) => handleInputChange(e, 'menge')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Einheit"
            variant="outlined"
            value={newIngredient.einheit}
            onChange={(e) => handleInputChange(e, 'einheit')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Kalorien (kcal)"
            variant="outlined"
            type="number"
            value={newIngredient.kcal}
            onChange={(e) => handleInputChange(e, 'kcal')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Fett (g)"
            variant="outlined"
            type="number"
            value={newIngredient.fett}
            onChange={(e) => handleInputChange(e, 'fett')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Gesättigte Fettsäuren (g)"
            variant="outlined"
            type="number"
            value={newIngredient.gesaettigteFettsaeuren}
            onChange={(e) => handleInputChange(e, 'gesaettigteFettsaeuren')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Kohlenhydrate (g)"
            variant="outlined"
            type="number"
            value={newIngredient.kohlenhydrate}
            onChange={(e) => handleInputChange(e, 'kohlenhydrate')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Zucker (g)"
            variant="outlined"
            type="number"
            value={newIngredient.zucker}
            onChange={(e) => handleInputChange(e, 'zucker')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Ballaststoffe (g)"
            variant="outlined"
            type="number"
            value={newIngredient.ballaststoffe}
            onChange={(e) => handleInputChange(e, 'ballaststoffe')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Eiweiß (g)"
            variant="outlined"
            type="number"
            value={newIngredient.eiweiss}
            onChange={(e) => handleInputChange(e, 'eiweiss')}
            fullWidth
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Salz (g)"
            variant="outlined"
            type="number"
            value={newIngredient.salz}
            onChange={(e) => handleInputChange(e, 'salz')}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="Allergene (kommagetrennt)"
            variant="outlined"
            value={newIngredient.allergene.join(', ')}
            onChange={(e) => {
              const allergens = e.target.value.split(',').map(item => item.trim());
              setNewIngredient({ ...newIngredient, allergene: allergens });
            }}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Foto auswählen
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {newIngredient.foto && (
            <Box mt={2}>
              <img
                src={newIngredient.foto}
                alt="Zutat Foto"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveIngredient}
            style={{ marginTop: 20 }}
          >
            Speichern
          </Button>
        </Box>
      )}

      <div>
        <h3>Zutatenliste</h3>
        {ingredients.length === 0 ? (
          <p>Keine Zutaten hinzugefügt.</p>
        ) : (
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.name} - {ingredient.menge} {ingredient.einheit}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Zutatenverwaltung;
