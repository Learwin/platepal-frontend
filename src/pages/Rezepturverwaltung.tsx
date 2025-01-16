import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, List, ListItem, ListItemText, Divider, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Chip, Stack, Avatar } from '@mui/material';
import { deleteRezepte, fetchRezepte, postRezept, updateRezept, Recipe, fetchEinheiten, fetchZutatenListe, Zutat, uploadImage, fetchRezeptByIdImage } from '../services/api';
import { useAuth } from '../context/AuthContextType'; // AuthContext importieren
import styles from '../Rezepturverwaltung.module.css';
import { CirclePlus } from 'lucide-react';
import UploadImageRezept from './UploadImageRezept';

const Rezeptverwaltung = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: 0,
    name: '',
    anweisungen: '',
    zeit: 0,
    schwierigkeit: 0,
    defaultPortionen: 0,
    foto: '',
    user_Id: {
      id: 0,
      username: '',
      passwort: '',
      emailAdresse: '',
      foto: '',
    },
    durchschnittlicheBewertung: 0,
    flag: 0,
    zutaten: [],
  });
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [einheiten, setEinheiten] = useState<any[]>([]);  // State für Einheiten
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [zutaten, setZutaten] = useState<Zutat[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);


  // Verwende den AuthContext, um den eingeloggten Benutzer abzurufen
  const { user } = useAuth();

  useEffect(() => {
    
    const loadRecipes = async () => {
      try {
        if (!user) return;
        const fetchedRecipes = await fetchRezepte();
        // Nur Rezepte des angemeldeten Benutzers laden
        const userRecipes = fetchedRecipes.filter((recipe) => recipe.user_Id.id === user.id);
        setRecipes(userRecipes);
      } catch (error) {
        console.error('Fehler beim Laden der Rezepte:', error);
      }
    };
  
    const loadEinheiten = async () => {
      try {
        const fetchedEinheiten = await fetchEinheiten();  // Einheiten abrufen
        setEinheiten(fetchedEinheiten);  // Einheiten in den State setzen
      } catch (error) {
        console.error('Fehler beim Laden der Einheiten:', error);
      }
    };
  
    const loadZutaten = async () => {
      try {
        const data = await fetchZutatenListe();
        console.log('Geladene Zutaten:', data);  // Füge dies hinzu, um zu überprüfen, was zurückkommt
        setZutaten(data);
      } catch (error) {
        console.error('Fehler beim Laden der Zutaten:', error);
      }
    };
  
    const fetchRecipeImages = async () => {
      try {
        // Lade Bilder für alle Rezepte, die noch kein Bild haben
        for (const recipe of recipes) {
          if (!recipe.foto) {
            await fetchAndSetRecipeImage(recipe.id);  // Bild für jedes Rezept abrufen
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden der Rezeptbilder:', error);
      }
    };

    
  
    // Laden der Rezepte, Einheiten, Zutaten und Rezeptbilder
    loadRecipes();
    loadEinheiten();
    loadZutaten();
  
    if (newRecipe.id !== 0) {
      console.log("Zutaten des bearbeiteten Rezepts:", newRecipe.zutaten);
    }
  }, [user, newRecipe.id]);  // recipes als Abhängigkeit hinzufügen, um sicherzustellen, dass die Bilder geladen werden, wenn Rezepte gesetzt werden
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Recipe) => {
    setNewRecipe({ ...newRecipe, [field]: event.target.value });
  };

  console.log("New Recipe zutaten:", newRecipe.zutaten); // Debugging

const handleSaveRecipe = async () => {
  if (!user) {
    setAlertMessage('Benutzer ist nicht angemeldet!');
    setOpenSnackbar(true);
    return;
  }

  if (!newRecipe.name || !newRecipe.anweisungen) {
    setAlertMessage('Bitte alle Pflichtfelder ausfüllen');
    setOpenSnackbar(true);
    return;
  }

  try {
    // Stelle sicher, dass das Rezeptfoto gesetzt wird, bevor das Rezept gespeichert wird
    const recipeToSave = {
      ...newRecipe,
      user_Id: user,
      ...(newRecipe.id === 0 && { foto: newRecipe.foto || '' }), // Nur für neue Rezepte das Foto übergeben
    };

    let savedRecipe;
    if (newRecipe.id === 0) {
      // Rezept speichern (neues Rezept)
      savedRecipe = await postRezept(recipeToSave);
      setRecipes([...recipes, savedRecipe]);
    } else {
      // Rezept aktualisieren (Foto wird nicht übergeben)
      const updatedRecipe = await updateRezept(recipeToSave);
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      );
      setRecipes(updatedRecipes);
    }

    // Preserve zutaten when resetting newRecipe after save
    setNewRecipe({
      id: 0,
      name: '',
      anweisungen: '',
      zeit: 0,
      schwierigkeit: 0,
      defaultPortionen: 0,
      foto: '',  // Rücksetzen des Bildes, falls nicht mehr vorhanden
      user_Id: {
        id: 0,
        username: '',
        passwort: '',
        emailAdresse: '',
        foto: '',
      },
      durchschnittlicheBewertung: 0,
      flag: 0,
      zutaten: newRecipe.zutaten, // Ensure zutaten are carried over correctly
    });

    setIsFormVisible(false);
    setAlertMessage('Rezept erfolgreich gespeichert!');
    setOpenSnackbar(true);
  } catch (error) {
    console.error('Fehler beim Speichern des Rezepts:', error);
    setAlertMessage('Fehler beim Speichern des Rezepts. Bitte versuche es erneut.');
    setOpenSnackbar(true);
  }
};


  

  const handleZutatSelectChange = (
    index: number,
    event: SelectChangeEvent<string>,  // Verwende SelectChangeEvent statt ChangeEvent
    field: string
  ) => {
    const newZutaten = [...newRecipe.zutaten];
    const value = event.target.value;
    
    if (field === 'zutat') {
      newZutaten[index].name = value;
    } else if (field === 'einheit') {
      const selectedEinheit = einheiten.find(einheit => einheit.name === value);
      newZutaten[index].einheit = selectedEinheit || { id: 0, name: '', abkuerzung: '' };
    }
    
    setNewRecipe({ ...newRecipe, zutaten: newZutaten });
  };
  
  
  

  const handleZutatTextChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const updatedZutaten = [...newRecipe.zutaten];
    updatedZutaten[index] = {
      ...updatedZutaten[index],
      [field]: e.target.value
    };
    setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
  };

   

  const handleAddZutat = () => {
    setNewRecipe({
      ...newRecipe,
      zutaten: [
        ...newRecipe.zutaten,
        {
          id: 0,  // Platzhalter für die ID
          name: '',  // Leerer Name
          kcal: 0,  // Platzhalter für Kalorien
          fett: 0,  // Platzhalter für Fett
          gesaettigteFettsaeuren: 0,  // Platzhalter für gesättigte Fettsäuren
          kohlenhydrate: 0,  // Platzhalter für Kohlenhydrate
          zucker: 0,  // Platzhalter für Zucker
          ballaststoffe: 0,  // Platzhalter für Ballaststoffe
          eiweiss: 0,  // Platzhalter für Eiweiß
          salz: 0,  // Platzhalter für Salz
          foto: '',  // Platzhalter für das Foto
          menge: 0,  // Platzhalter für die Menge
          einheit: {
            id: 0,  // Platzhalter für die Einheit-ID
            name: '',  // Platzhalter für den Einheiten-Namen
            abkuerzung: ''  // Platzhalter für die Abkürzung der Einheit
          },
          allergene: [],  // Leeres Array für Allergene
          rezepte: []  // Leeres Array für Rezepte
        }
      ]
    });
  };

  const handleRemoveZutat = (index: number) => {
    const updatedZutaten = [...newRecipe.zutaten];
    updatedZutaten.splice(index, 1);
    setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
  };

  const handleDelete = async (id: number) => {
    if (!user) {
      setAlertMessage('Benutzer ist nicht angemeldet!');
      setOpenSnackbar(true);
      return;
    }

    try {
      // Prüfen, ob das Rezept dem Benutzer gehört
      const recipeToDelete = recipes.find((recipe) => recipe.id === id && recipe.user_Id.id === user.id);
      if (!recipeToDelete) {
        setAlertMessage('Keine Berechtigung zum Löschen dieses Rezepts!');
        setOpenSnackbar(true);
        return;
      }

      await deleteRezepte(id);

      setRecipes(recipes.filter((recipe) => recipe.id !== id));
      setAlertMessage('Rezept erfolgreich gelöscht!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Fehler beim Löschen des Rezepts:', error);
      setAlertMessage('Fehler beim Löschen des Rezepts. Bitte versuche es erneut.');
      setOpenSnackbar(true);
    }
  };


const handleEdit = (id: number) => {
  if (Array.isArray(recipes)) {
    const recipeToEdit = recipes.find((recipe) => recipe.id === id);
    if (recipeToEdit) {
      setNewRecipe({
        ...recipeToEdit,  // Spread the existing recipe data
        zutaten: recipeToEdit.zutaten || [],  // Ensure zutaten is always an array, even if empty
        //foto: recipeToEdit.foto || ''  // Foto auch setzen
      });
      setIsFormVisible(true);
    } else {
      console.error('Rezept nicht gefunden:', id);
    }
  } else {
    console.error('Die Liste der Rezepte ist nicht verfügbar oder ungültig.');
  }
};


const handleDeleteZutat = (index: number) => {
  const updatedZutaten = [...newRecipe.zutaten];
  updatedZutaten.splice(index, 1);
  setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
};

const handleOpenDialog = (recipeId: number) => {
  setSelectedRecipeId(recipeId);
  setIsDialogOpen(true);
};

const handleCloseDialog = () => {
  setIsDialogOpen(false);
  setSelectedRecipeId(null);
};

const fetchAndSetRecipeImage = async (id: number) => {
  try {
    const { imageUrl } = await fetchRezeptByIdImage(id);
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === id ? { ...recipe, foto: imageUrl } : recipe
      )
    );
  } catch (error) {
    console.error('Fehler beim Abrufen des Rezeptbildes:', error);
  }
};

const handleUploadImage = async (file: File) => {
  if (selectedRecipeId === null) {
    return;
  }

  try {
    // Bild hochladen
    const uploadedFilePath = await uploadImage(selectedRecipeId, file);
    console.log('Uploaded file path:', uploadedFilePath);

    // Nach dem Upload das Rezeptbild aktualisieren
    await fetchAndSetRecipeImage(selectedRecipeId);  // Hier das Bild für das Rezept aktualisieren

    console.log('Bild erfolgreich hochgeladen.');
  } catch (error) {
    console.error('Fehler beim Bild-Upload:', error);
  }
};


return (
  <div className={styles.rezeptContainer}>
    {!isFormVisible && (
      <Button
        variant="contained"
        className={styles.addRecipeButton}
        onClick={() => setIsFormVisible(true)}
        startIcon={<CirclePlus />}
      >
        Rezept Hinzufügen
      </Button>
    )}

    {isFormVisible && (
      <Box className={styles.recipeForm}>
        <TextField
          label="Rezept Name"
          variant="outlined"
          value={newRecipe.name}
          onChange={(e) => handleInputChange(e, 'name')}
          fullWidth
          style={{ marginBottom: 15 }}
        />
        <TextField
          label="Anweisungen"
          variant="outlined"
          value={newRecipe.anweisungen}
          onChange={(e) => handleInputChange(e, 'anweisungen')}
          fullWidth
          multiline
          rows={4}
          style={{ marginBottom: 15 }}
        />
        <TextField
          label="Zeit (Minuten)"
          variant="outlined"
          type="number"
          value={newRecipe.zeit}
          onChange={(e) => handleInputChange(e, 'zeit')}
          fullWidth
          style={{ marginBottom: 15 }}
        />
        <TextField
          label="Schwierigkeit (1-5)"
          variant="outlined"
          type="number"
          value={newRecipe.schwierigkeit}
          onChange={(e) => handleInputChange(e, 'schwierigkeit')}
          fullWidth
          style={{ marginBottom: 15 }}
        />
        <TextField
          label="Portionen"
          variant="outlined"
          type="number"
          value={newRecipe.defaultPortionen}
          onChange={(e) => handleInputChange(e, 'defaultPortionen')}
          fullWidth
          style={{ marginBottom: 15 }}
        />

        <Box>
          <h3>Zutaten</h3>
          {Array.isArray(newRecipe.zutaten) &&
            newRecipe.zutaten.map((zutat, index) => (
              <Box key={index} mb={2}>
                <FormControl fullWidth style={{ marginBottom: 5 }}>
                  <InputLabel>Zutat</InputLabel>
                  <Select
                    value={zutat.name || ''}
                    onChange={(e) => handleZutatSelectChange(index, e, 'zutat')}
                  >
                    {zutaten.map((zutatOption) => (
                      <MenuItem key={zutatOption.id} value={zutatOption.name}>
                        {zutatOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Menge"
                  variant="outlined"
                  type="number"
                  value={zutat.menge}
                  onChange={(e) => handleZutatTextChange(index, e, 'menge')}
                  fullWidth
                  style={{ marginBottom: 5 }}
                />
                <FormControl fullWidth style={{ marginBottom: 5 }}>
                  <InputLabel>Einheit</InputLabel>
                  <Select
                    value={zutat.einheit?.name || ''}
                    onChange={(e) => handleZutatSelectChange(index, e, 'einheit')}
                  >
                    <MenuItem value="">
                      <em>Keine Einheit</em>
                    </MenuItem>
                    {einheiten.map((einheit) => (
                      <MenuItem key={einheit.id} value={einheit.name}>
                        {einheit.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {zutat.name && (
                  <Chip
                    label={zutat.name}
                    onDelete={() => handleRemoveZutat(index)}
                    color="primary"
                    style={{ marginTop: 10 }}
                  />
                )}
              </Box>
            ))}
          <Button variant="outlined" onClick={handleAddZutat}>
            Zutat Hinzufügen
          </Button>
        </Box>

        

        {/* Button zum Speichern des Rezepts */}
        <Button
          variant="contained"
          onClick={handleSaveRecipe}
          style={{ marginTop: 20 }}
        >
          Rezept Speichern
        </Button>
      </Box>
    )}

    {!isFormVisible && (

     
<List>
{recipes.map((recipe) => (
  <div key={recipe.id}>
    <ListItem>
      {/* Bild neben dem Rezeptnamen */}
      {recipe.foto && (
        <Avatar
          alt={recipe.name}
          src={recipe.foto}
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
      )}

      <ListItemText
        primary={recipe.name}
        secondary={`Dauer: ${recipe.zeit} Minuten`}
      />
      
      {/* Bearbeiten und Löschen Buttons */}
      <Button
        className={styles.editRezeptButton}
        onClick={() => handleEdit(recipe.id)}
      >
        Bearbeiten
      </Button>
      <Button
        className={styles.deleteRezeptButton}
        onClick={() => handleDelete(recipe.id)}
      >
        Löschen
      </Button>

      {/* Bild hochladen Button */}
      <Button onClick={() => handleOpenDialog(recipe.id)}>
        Bild Hochladen
      </Button>
    </ListItem>
    <Divider />
  </div>
))}
</List>
     
    )}

    {selectedRecipeId && (
      <UploadImageRezept
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onUpload={handleUploadImage}
        recipeId={selectedRecipeId}
      />
    )}

    {/* Snackbar für Benachrichtigungen */}
    <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={() => setOpenSnackbar(false)}
    >
      <Alert onClose={() => setOpenSnackbar(false)} severity="success">
        {alertMessage}
      </Alert>
    </Snackbar>
  </div>
);
}

export default Rezeptverwaltung;