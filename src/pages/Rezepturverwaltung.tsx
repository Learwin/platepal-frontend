import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, List, ListItem, ListItemText, Divider, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Chip, Avatar } from '@mui/material';
import { deleteRezepte, fetchRezepte, postRezept, updateRezept, Recipe, fetchEinheiten, fetchZutatenListe, Zutat, uploadImage, fetchRezeptByIdImage, fetchFullRezept } from '../services/api';
import { useAuth } from '../context/AuthContextType'; // AuthContext importieren
import styles from '../Rezepturverwaltung.module.css';
import { CirclePlus } from 'lucide-react';
import UploadImageRezept from './UploadImageRezept';
import { PostRezeptModel } from '../models/PostRezeptModel';
import { PostZutatenModel } from '../models/PostZutatenModel';
import TimerControl from './TimerControl';
import { PostTimerModel } from '../models/PostTimerModel';



const Rezeptverwaltung = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipe, setNewRecipe] = useState<PostRezeptModel>({
    name: '',
    anweisungen: '',
    zeit: 0,
    schwierigkeit: 0,
    defaultPortionen: 0,
    flag: 0,
    user_Id: 0,
    timer: [],
    durchschnittlicheBewertung: 0,
    zutaten: [

    ],});

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [einheiten, setEinheiten] = useState<any[]>([]);  // State für Einheiten
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [zutaten, setZutaten] = useState<Zutat[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [addedChips, setAddedChips] = useState<{ id: number, name: string }[]>([]);
  const [completeZutaten, setCompleteZutaten] = useState<PostZutatenModel[]>([]); // Neuer State für vollständige Zutaten
  const [isZutatFormIsVisible, setIsZutatFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Zustand für den Lade-Status
  const [error, setError] = useState<string>(''); // Zustand für Fehler

  const [editingRecipeId, setEditingRecipeId] = useState<number | null>(null); // ID des Rezepts, das bearbeitet wird
  const [editingRecipe, setEditingRecipe] = useState<PostRezeptModel>({
    name: '',
    anweisungen: '',
    zeit: 0,
    schwierigkeit: 0,
    defaultPortionen: 0,
    flag: 0,
    user_Id: 0,
    timer: [],
    durchschnittlicheBewertung: 0,
    zutaten: [

    ],});

  // Verwende den AuthContext, um den eingeloggten Benutzer abzurufen

  const { user } = useAuth();
  

    useEffect(() => {
      const loadRecipes = async () => {
        if (!user) return; // Wenn kein Benutzer angemeldet, nichts tun
  
        setLoading(true);
        setError('');
        try {
          // Rezepte von der API holen
          const fetchedRecipes = await fetchRezepte(); 
  
          // Nur Rezepte des angemeldeten Benutzers filtern
          const userRecipes = fetchedRecipes.filter((recipe: any) => recipe.user_Id.id === user.id);
          setRecipes(userRecipes); // Rezepte im Zustand speichern
        } catch (error) {
          console.error('Fehler beim Laden der Rezepte:', error);
          setError('Fehler beim Laden der Rezepte.');
        } finally {
          setLoading(false);
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

    const fetchUserRecipes = async () => {
      if (!user) return; // Falls kein User angemeldet ist, nichts tun
  
      try {
          const allRecipes = await fetchRezepte(); // Alle Rezepte abrufen
          console.log("Alle geladenen Rezepte:", allRecipes);
  
          // Wenn user.flag === 1, dann alle Rezepte anzeigen, sonst nur eigene
          const userRecipes = user.flag === 1 
              ? allRecipes 
              : allRecipes.filter((recipe: any) => recipe.user_Id.id === user.id);
  
          console.log("Angezeigte Rezepte:", userRecipes);
  
          // Lade die Bilder für alle angezeigten Rezepte
          const recipesWithImages = await Promise.all(
              userRecipes.map(async (recipe) => {
                  try {
                      const { imageUrl } = await fetchRezeptByIdImage(recipe.id);
                      return { ...recipe, foto: imageUrl };
                  } catch (error) {
                      console.error(`Fehler beim Laden des Bildes für Rezept ${recipe.id}:`, error);
                      return recipe; // Rezept ohne Bild zurückgeben
                  }
              })
          );
  
          setRecipes(recipesWithImages);
      } catch (error) {
          console.error("Fehler beim Laden der Benutzerrezepte:", error);
      }
  };
  

    loadRecipes();
    loadEinheiten();
    loadZutaten();
    fetchUserRecipes();
}, [user]); // Nur von user abhängig

// Funktion zum Setzen von newRecipe beim Bearbeiten
const loadRecipeForEdit = async (id: number) => {
  try {
      const recipe = await fetchFullRezept(id);
      if (recipe) {
          setNewRecipe(recipe);
          setCompleteZutaten(recipe.zutaten);
          setEditingRecipeId(id); // Setze die ID des bearbeiteten Rezepts
          setIsFormVisible(true);
      }
  } catch (error) {
      console.error('Fehler beim Laden des Rezepts:', error);
  }
};

useEffect(() => {
  console.log("newRecipe im useEffect:", newRecipe);
}, [newRecipe]);
  
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof PostRezeptModel) => {
  // Hier wird newRecipe direkt aktualisiert
  setNewRecipe({
    ...newRecipe,
    [field]: event.target.value, // Aktualisiere das Feld basierend auf der Eingabe
  });
};
    
    const handleZutatSelectChange = (
      index: number,
      e: SelectChangeEvent<number>,
      field: string
    ) => {
      const value = e.target.value;
      const updatedZutaten = [...newRecipe.zutaten];
      updatedZutaten[index] = {
        ...updatedZutaten[index],
        [field]: value,  // Aktualisiere das Feld entsprechend
      };
      setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
    };
    
    const handleZutatTextChange = (
      index: number,
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      field: string
    ) => {
      const value = parseFloat(e.target.value); // Falls nötig, Wert als Zahl parsen
      const updatedZutaten = [...newRecipe.zutaten];
      updatedZutaten[index] = {
        ...updatedZutaten[index],
        [field]: value,
      };
      setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
    };
    
    const handleEinheitSelectChange = (index: number, e: SelectChangeEvent<number | string>, field: string) => { // Wichtig: Typ für e anpassen
      const value = Number(e.target.value); // Explizite Typumwandlung
      const updatedZutaten = [...newRecipe.zutaten];
    
      updatedZutaten[index] = {
        ...updatedZutaten[index],
        einheit: { id: value },
      };
    
      setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
    };
  
  

  const handleZutatUpdate = (index: number) => {
    const updatedZutaten = [...newRecipe.zutaten];
    updatedZutaten[index] = {
      ...updatedZutaten[index], // Hier bleiben alle aktuellen Werte, da keine Änderungen an den Textfeldern vorgenommen werden
    };
  
    setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
  
    // Textfelder zurücksetzen
    const resetZutaten = [...newRecipe.zutaten];
    resetZutaten[index] = {
      id: 0,  // ID zurücksetzen, falls notwendig
      menge: 0,  // Menge zurücksetzen
      einheit: { id: 0} // Einheit zurücksetzen
    };
  
    setNewRecipe({ ...newRecipe, zutaten: resetZutaten });
  
    // Chip aktualisieren, anstatt zu löschen
    setAddedChips((prevChips) =>
      prevChips.map((chip) =>
        chip.id === newRecipe.zutaten[index].id
          ? {
              ...chip,
              name: `Zutat: ${zutaten.find((z) => z.id === newRecipe.zutaten[index].id)?.name}`,
            }
          : chip
      )
    );
  };
  
  
  const handleZutatAsChip = (index: number) => {
    const zutat = newRecipe.zutaten[index];
  
    if (zutat.menge > 0 && zutat.einheit && zutat.einheit.id > 0) {
      const foundZutat = zutaten.find(z => z.id === zutat.id);
      const zutatName = foundZutat ? foundZutat.name : 'Unbekannte Zutat';
  
      const newChip = {
        id: zutat.einheit.id,
        name: `Zutat: ${zutatName}`,
      };
  
      setAddedChips((prevChips) => {
        // Überprüfen, ob der Chip mit der gleichen ID und dem gleichen Namen schon vorhanden ist
        if (prevChips.some(chip => chip.id === newChip.id && chip.name === newChip.name)) {
          return prevChips; // Wenn schon vorhanden, keine Änderung
        } else {
          return [...prevChips, newChip]; // Andernfalls neuen Chip hinzufügen
        }
      });
  
      setCompleteZutaten(prevZutaten => {
        const zutatExistiertBereits = prevZutaten.some(
          prevZutat => 
            prevZutat.id === zutat.id &&
            prevZutat.menge === zutat.menge &&
            prevZutat.einheit.id === zutat.einheit.id
        );
        
        if (zutatExistiertBereits) {
          return prevZutaten; // Zutat existiert schon, keine Änderung
        } else {
          return [...prevZutaten, zutat]; // Zutat hinzufügen
        }
      });
    }
  };
  
  
  
  const handleChipClick = (chipId: number) => {
  const selectedChip = addedChips.find((chip) => chip.id === chipId);

  if (selectedChip) {
    const selectedZutat = zutaten.find((zutat) => zutat.id === selectedChip.id);

    if (selectedZutat) {
      const updatedZutaten = [...newRecipe.zutaten];
      const index = updatedZutaten.findIndex((zutat) => zutat.id === 0); // Finde den ersten leeren Platz

      if (index !== -1) {
        updatedZutaten[index] = {
          id: selectedZutat.id,
          menge: 0, // Menge auf 0 setzen, da sie vom Benutzer eingegeben werden soll
          einheit: { id: selectedChip.id }, // Korrektur: Nur die ID der Einheit übernehmen
        };
        setNewRecipe({ ...newRecipe, zutaten: updatedZutaten });
      }
    }
  }
};
  
  
  const handleDeleteChip = (chipId: number) => {
    setAddedChips((prevChips) => prevChips.filter((chip) => chip.id !== chipId));
  };
  
  
  const handleZutatAdd = () => {
    setIsZutatFormVisible(true);
    setNewRecipe((prevRecipe) => {
      const zutaten = Array.isArray(prevRecipe.zutaten) ? prevRecipe.zutaten : [];
      return {
        ...prevRecipe,
        zutaten: [...zutaten, { id: 0, menge: 0, einheit: { id: 0 } }],
      };
    });
  };
  
  const handleSaveRecipe = async () => {
    
    if (!user) return;
  
    const newRecipeData: PostRezeptModel = {
      user_Id: user.id, // Benutzer-ID setzen
      name: newRecipe.name,
      anweisungen: newRecipe.anweisungen,
      zeit: newRecipe.zeit,
      schwierigkeit: newRecipe.schwierigkeit,
      defaultPortionen: newRecipe.defaultPortionen,
      durchschnittlicheBewertung: 0,
      timer: newRecipe.timer,
      zutaten: completeZutaten, // Zutaten setzen
    };
  
    try {
      console.log('Daten vor dem Speichern:', JSON.stringify(newRecipeData, null, 2));
      await postRezept(newRecipeData);
      
      console.log('Rezept erfolgreich gespeichert:', newRecipeData);
  
      console.log('Gespeichertes Rezept (mit Zutaten und User):', newRecipeData);

      const saverecipe = await fetchRezepte(); // Das neue Rezept in die Liste setzen
      setRecipes(saverecipe);

      setAlertMessage('Rezept erfolgreich gespeichert!');
      setOpenSnackbar(true);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Fehler beim Speichern des Rezepts:', error);
    }
  };
  

  const handleDelete = async (id: number) => {
    if (!user) {
      setAlertMessage('Benutzer ist nicht angemeldet!');
      setOpenSnackbar(true);
      return;
    }

    try {
      
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
    loadRecipeForEdit(id); // Diese Funktion aufrufen!
};

  


const handleOpenDialog = (recipeId: number) => {
  setSelectedRecipeId(recipeId);
  setIsDialogOpen(true);
};

const handleCloseDialog = () => {
  setIsDialogOpen(false);
  setSelectedRecipeId(null);
};
const handleTimerChange = (newTimers: PostTimerModel[]) => {
  // Den Timer im Rezeptmodell speichern
  setNewRecipe((prevRezept) => ({
    ...prevRezept,
    timer: newTimers,
  }));
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
          value={newRecipe.name || ""}
          onChange={(e) => handleInputChange(e, 'name')}
          fullWidth
          style={{ marginBottom: 15 }}
          className={styles.textField}
        />
        <TextField
          label="Anweisungen"
          variant="outlined"
          value={newRecipe.anweisungen || ""}
          onChange={(e) => handleInputChange(e, 'anweisungen')}
          fullWidth
          multiline
          rows={4}
          style={{ marginBottom: 15 }}
          className={styles.textField}
        />
        <TextField
          label="Zeit (Minuten)"
          variant="outlined"
          type="number"
          value={newRecipe.zeit}
          onChange={(e) => handleInputChange(e, 'zeit')}
          fullWidth
          style={{ marginBottom: 15 }}
          className={styles.textField}
        />
        <TextField
          label="Schwierigkeit (1-5)"
          variant="outlined"
          type="number"
          value={newRecipe.schwierigkeit}
          onChange={(e) => handleInputChange(e, 'schwierigkeit')}
          fullWidth
          style={{ marginBottom: 15 }}
          className={styles.textField}
        />
        <TextField
          label="Portionen"
          variant="outlined"
          type="number"
          value={newRecipe.defaultPortionen}
          onChange={(e) => handleInputChange(e, 'defaultPortionen')}
          fullWidth
          style={{ marginBottom: 15 }}
          className={styles.textField}
        />

        
        <div className={styles.rezeptContainer}>
      <h3>Zutaten</h3>
      
      
      {Array.isArray(newRecipe.zutaten) &&
        newRecipe.zutaten.map((zutat, index) => (
          <div key={index}>
            <div className={styles.rezeptList}>
              <FormControl fullWidth className={styles.rezeptForm}>
                <InputLabel>Zutat</InputLabel>
                <Select
                  value={zutat.id}
                  className={styles.textField}
                  onChange={(e) => handleZutatSelectChange(index, e, 'id')}
                  disabled={addedChips.some((chip) => chip.id === zutat.id)}
                  
                >
                  {zutaten.map((zutatOption) => (
                    <MenuItem key={zutatOption.id} value={zutatOption.id}>
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
                className={styles.rezeptForm}
              />

              <FormControl fullWidth className={styles.rezeptForm}>
                <InputLabel>Einheit</InputLabel>
                <Select
                   value={zutat.einheit ? zutat.einheit.id : ''} // Korrektur: Direkter Zugriff auf zutat.einheit.id
                   className={styles.textField}
                    onChange={(e) => handleEinheitSelectChange(index, e, 'einheit')}
>
                  {einheiten.map((einheitOption) => (
                    <MenuItem key={einheitOption.id} value={einheitOption.id}>
                      {einheitOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                addedChips.some((chip) => chip.id === newRecipe.zutaten[index].id)
  ? handleZutatUpdate(index)
  : handleZutatAsChip(index)

              }
              className={styles.addZutatButton}
            >
              {addedChips.some((chip) => chip.id === newRecipe.zutaten[index].id)
                ? 'Zutat aktualisieren'
                : 'Zutat bestätigen'}
            </Button>
          </div>
        ))}

      <Box mt={2}>
        <div className={styles.chipContainer}>
          {addedChips.map((chip) => (
            <Chip
              key={`${chip.id}-${chip.name}`}
              label={chip.name}
              onClick={() => handleChipClick(chip.id)}
              onDelete={() => handleDeleteChip(chip.id)}
              className={styles.chip}
            />
          ))}
        </div>
      </Box>

      <Button variant="outlined" onClick={handleZutatAdd} disabled={isZutatFormIsVisible} className={styles.addZutatButton} >
        Zutat Hinzufügen
      </Button>

      <TimerControl onTimerChange={handleTimerChange} />

      <Button
        variant="contained"
        style={{ marginTop: 20 }}
        onClick={handleSaveRecipe}
        className={styles.addZutatButton}
      >
        Rezept Speichern
      </Button>
      
      </div>
        </Box>
       
    )}

    {/* Wenn das Formular nicht sichtbar ist, zeige die Liste der Rezepte */}
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
              <Button onClick={() => handleOpenDialog(recipe.id)}
                className={styles.imageButton}>
                Bild Hochladen
              </Button>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    )}

    {/* Upload Image Dialog */}
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



//Update fehlt
//liste zum User aufrufen
