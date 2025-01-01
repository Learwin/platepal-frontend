import React, { useState } from 'react';
import { Button, TextField, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { postZutat, Zutat } from '../services/api';
import styles from '../Zutatenverwaltung.module.css';
import { CirclePlus } from 'lucide-react';



const Zutatenverwaltung = () => {
  const [ingredients, setIngredients] = useState<Zutat[]>([]);
  const [newIngredient, setNewIngredient] = useState<Zutat>({
    id: 0,
    name: '',
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
    field: keyof Zutat
  ) => {
    if (field === 'allergene') {
      setNewIngredient({
        ...newIngredient,
        allergene: event.target.value.split(',').map((allergen, index) => ({
          id: index + 1, // Temporäre ID
          name: allergen.trim(),
        })),
      });
    } else {
      setNewIngredient({ ...newIngredient, [field]: event.target.value });
    }
  };

  const handleSaveIngredient = async () => {
    if (!newIngredient.name) {
      alert('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    try {
      const savedIngredient = await postZutat(newIngredient); // Post the ingredient to the backend
      setIngredients([...ingredients, savedIngredient]); // Update the state with the saved ingredient
      setNewIngredient({
        id: 0,
        name: '',
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

  const handleEdit = (id: number) => {
    console.log(`Edit ingredient with id: ${id}`);
    // Edit logic here
  };

  const handleDelete = (id: number) => {
    console.log(`Delete ingredient with id: ${id}`);
    // Delete logic here
  };

  return (
    <div className={styles.zutatenContainer}>
       {!isFormVisible && (
      <Button
        variant="contained"
        className={styles.addIngredientButton}
        onClick={() => setIsFormVisible(true)}
        startIcon={<CirclePlus />} 
      >
        Zutat Hinzufügen
      </Button>
        )}

      {isFormVisible && (
        <Box className={styles.zutatForm}>
            <TextField
              label="Zutat Name"
              variant="outlined"
              value={newIngredient.name}
              onChange={(e) => handleInputChange(e, 'name')}
              fullWidth
              style={{ marginBottom: 15 }}
            />
            <TextField
              label="Kalorien (kcal)"
              variant="outlined"
              type="number"
              value={newIngredient.kcal}
              onChange={(e) => handleInputChange(e, 'kcal')}
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
              className={styles.inputField}
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
              label="Allergene (durch Komma getrennt)"
              variant="outlined"
              value={newIngredient.allergene.map((allergen) => allergen.name).join(', ')}
              onChange={(e) => handleInputChange(e, 'allergene')}
              fullWidth
              style={{ marginBottom: 15 }}
            />

            <Button
              variant="contained"
              component="label"
              className={styles.uploadButton}
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
                <img src={newIngredient.foto} alt="Zutat Foto" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              </Box>
            )}

            <Button
              variant="contained"
              className={styles.saveButton}
              onClick={handleSaveIngredient}
            >
              Speichern
            </Button>
            </Box>
      )}

      {!isFormVisible && (
        <List>
          {ingredients.map((ingredient) => (
            <div key={ingredient.id}>
              <ListItem>
                <ListItemText
                  primary={ingredient.name}
                  secondary={`Kalorien: ${ingredient.kcal} kcal`}
                />
                <Button
                  className={styles.editZutatButton}
                  onClick={() => handleEdit(ingredient.id)}
                  style={{ marginRight: 10 }}
                >
                  Bearbeiten
                </Button>
                <Button
                  className={styles.deleteZutatButton}
                  onClick={() => handleDelete(ingredient.id)}
                >
                  Löschen
                </Button>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
    </div>
  );
};

export default Zutatenverwaltung;
