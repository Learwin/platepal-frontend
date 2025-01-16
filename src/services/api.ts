const API_URL = 'http://localhost:8080';

interface ZutatDerWoche {
  id: number;
  von: string;
  bis: string;
  zutat: {
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
    allergene: Allergen[];
    rezepte: Rezept[];
  };
}


  export interface Zutat {
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
    allergene: Allergen[];
    menge: number;
  einheit: Einheit[];
  }

  
  interface Allergen {
    id: number;
    name: string;
    zutaten?: string[];
  }
  

  export const fetchZutatById = async (id: number): Promise<ZutatDerWoche['zutat']> => {
    try {
      const response = await fetch(`${API_URL}/zutat/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Zutat by ID:', error);
      throw error;
    }
  };

  export const fetchZutatenListe = async (): Promise<Zutat[]> => {
    try {
      const response = await fetch('http://localhost:8080/zutat/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Zutaten list:', error);
      throw error;
    }
  };
  

  export const fetchZutatByIdImage = async (id: number): Promise<{ imageUrl: string }> => {
    try {
      const response = await fetch(`${API_URL}/zutat/image/${id}`, {
        
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`API-URL: ${API_URL}/zutat/image/${id}`);
  
      // Hole den Content-Type vom Server (falls verfügbar)
      const contentType = response.headers.get('Content-Type') || '';
      let mimeType = 'image/jpeg'; // Standard-MIME-Typ
  
      // Überprüfe, ob der Content-Type den Bildtyp enthält
      if (contentType.includes('image/png')) {
        mimeType = 'image/png';
      } else if (contentType.includes('image/jpg')) {
        mimeType = 'image/jpg'; // JPG wird als JPEG behandelt
      } else if (contentType.includes('image/jpeg')) {
        mimeType = 'image/jpeg'; // JPG wird als JPEG behandelt
      }
  
      // Konvertiere den Bitstrom in einen Base64-String
      const arrayBuffer = await response.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
  
      return {
        imageUrl: `data:${mimeType};base64,${base64String}`,
      };
    } catch (error) {
      console.error('Fehler beim Abrufen des Zutat-Bildes:', error);
      throw error;
    }
  };



  export const fetchRezeptByIdImage = async (id: number): Promise<{ imageUrl: string }> => {
    console.log(`Fetching image for Rezept with ID: ${id}`);
    try {
      const response = await fetch(`${API_URL}/rezepte/image/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
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
  
      return {
        imageUrl: `data:${mimeType};base64,${base64String}`,
      };
    } catch (error) {
      console.error('Fehler beim Abrufen des Rezept-Bildes:', error);
      throw error;
    }
  };
  
  
  export const fetchZutatDerWoche = async (): Promise<ZutatDerWoche> => {
    try {
      const response = await fetch(`${API_URL}/zutatderwoche/current`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Zutat der Woche:', error);
      throw error;
    }
  };
  
 
  export const fetchRezeptDetails = async (rezeptId: number) => {
    try {
      const response = await fetch(`${API_URL}/rezepte/${rezeptId}`);
      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Rezeptdetails: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fehler beim Abrufen des Rezepts:', error);
      return null;
    }
  };

  // services/api.ts

// services/api.ts
//const API_URL = 'http://localhost:8080';

export interface User {
  id: number;
  username: string;
  passwort: string;
  emailAdresse: string;
  foto: string
}

export interface Recipe {
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
    foto: string;
  };
  durchschnittlicheBewertung: number;
  flag: number;
  name: string;
  zutaten: {
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
    menge: number;
    einheit: {
      id: number;
      name: string;
      abkuerzung: string;
    };
    allergene: {
      id: number;
      name: string;
      zutaten: string[];
    }[];
    rezepte: string[];
  }[];
}


interface Einheit {
  id: number;
  name: string;
  abkuerzung: string;
}

interface Allergene {
  id: number;
  name: string;
  zutaten: Zutat[];
}

interface ZutatMenge {
  menge: number;
  einheit: Einheit;
  zutat: Zutat;
  allergene: Allergene[];
}

export const fetchEinheiten = async (): Promise<any[]> => {
  try {
    // Hole die gesamte Liste der Einheiten
    const response = await fetch(`${API_URL}/einheit/list`);

    // Überprüfe, ob die Antwort erfolgreich war
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Einheiten');
    }

    // Parsen der JSON-Antwort
    const data = await response.json();

    // Gib die Einheiten zurück
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Einheiten:', error);
    throw error;
  }
};

// src/services/rezeptService.ts

export const fetchFullRezept = async (rezepteId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/rezepte/full/${rezepteId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Antwort als JSON-Objekt zurückgeben
  } catch (error) {
    console.error('Error fetching full recipe:', error);
    throw error;
  }
};



export const postRezept = async (newRecipe: Recipe): Promise<Recipe> => {
  try {
    const response = await fetch(`${API_URL}/rezepte`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecipe),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Fehler beim Hinzufügen des Rezepts: ${response.statusText}. Details: ${errorDetails}`);
    }

    return await response.json(); // Gibt das gespeicherte Rezept zurück
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Rezepts:', error);
    throw error;
  }
};

// Funktion zum Bearbeiten eines Rezepts
export const updateRezept = async (recipe: Recipe): Promise<Recipe> => {
  try {
    const response = await fetch(`${API_URL}/rezepte`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe), // Rezept als JSON an den Server senden
    });

    // Überprüfe, ob die Antwort erfolgreich war (Status 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Fehler beim Aktualisieren des Rezepts: ${errorData.message || response.statusText}`);
    }

    const updatedRecipe = await response.json(); // Das aktualisierte Rezept zurückgeben
    return updatedRecipe;
  } catch (error) {
    console.error('Fehler beim Bearbeiten des Rezepts:', error);
    throw error; // Fehler weitergeben, damit er von der aufrufenden Komponente behandelt werden kann
  }
};


export const deleteRezepte = async (rezepteId: number): Promise<void> => {
  if (!rezepteId || rezepteId <= 0) {
    throw new Error('Ungültige Rezept-ID. Kann nicht gelöscht werden.');
  }

  try {
    const response = await fetch(`${API_URL}/rezepte/${rezepteId}`, {
      method: 'DELETE',
    });

    if (response.status === 404) {
      throw new Error(`Rezept mit der ID ${rezepteId} wurde nicht gefunden.`);
    }

    if (!response.ok) {
      throw new Error(`Fehler beim Löschen des Rezepts: ${response.statusText}`);
    }

    console.log(`Rezept mit der ID ${rezepteId} wurde erfolgreich gelöscht.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fehler in deleteRezepte:', error.message);
    } else {
      console.error('Unbekannter Fehler in deleteRezepte:', error);
    }
    throw error; // Fehler weiterleiten
  }
};









export const fetchRezepte = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${API_URL}/rezepte/list`);
    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Rezeptliste: ${response.statusText}`);
    }

    const rezepte: any[] = await response.json();

    return rezepte.map((rezept) => ({
      id: rezept.id,
      name: rezept.name,
      foto: rezept.foto,
      anweisungen: rezept.anweisungen || '',
      zeit: rezept.zeit || 0,
      schwierigkeit: rezept.schwierigkeit || 0,
      defaultPortionen: rezept.defaultPortionen || 0,
      durchschnittlicheBewertung: rezept.durchschnittlicheBewertung || 0,
      flag: rezept.flag || 0,
      zutaten: rezept.zutaten ? rezept.zutaten : [],
      user_Id: rezept.user_Id
        ? {
            id: rezept.user_Id.id ?? 0,
            username: rezept.user_Id.username ?? '',
            passwort: rezept.user_Id.passwort ?? '',
            emailAdresse: rezept.user_Id.emailAdresse ?? '',
            foto: rezept.user_Id.foto ?? '',
          }
        : { id: 0, username: '', passwort: '', emailAdresse: '', foto: '' },  // Sicherstellen, dass user_Id immer existiert
    }));
  } catch (error) {
    console.error('Fehler beim Abrufen der Rezepte:', error);
    throw error;
  }
};



/**
 * Filtert Rezepte basierend auf der Zutat der Woche.
 * @param zutatId - Die ID der Zutat, die gefiltert werden soll.
 * @returns Eine Liste von Rezepten, die die Zutat enthalten.
 */
export const fetchRezepteByZutatDerWoche = async (zutatId: number): Promise<Recipe[]> => {
  try {
    // Rufe die gesamte Rezeptliste ab
    const rezepte = await fetchRezepte();

    // Filtere die Rezepte, die die Zutat enthalten
    const filteredRezepte = rezepte.filter(rezept =>
      rezept.anweisungen.toLowerCase().includes(zutatId.toString()) // Beispiel für eine einfache Prüfung
    );

    return filteredRezepte;
  } catch (error) {
    console.error('Fehler beim Filtern der Rezepte nach Zutat der Woche:', error);
    throw error;
  }
};


//Post Zutat der Woche

interface Rezept {
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
  flag: number;
  name: string;
  zutaten: string[];
}


export const postZutatDerWoche = async (zutatDerWoche: ZutatDerWoche): Promise<ZutatDerWoche> => {
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

export const postZutat = async (zutat: Zutat): Promise<Zutat> => {
  try {
    const response = await fetch(`${API_URL}/zutat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zutat),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Hinzufügen der Zutat: ${response.statusText}`);
    }

    return await response.json(); // Gibt die gespeicherte Zutat zurück
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Zutat:', error);
    throw error;
  }
};

// services/api.ts

// PUT-Methode zum Aktualisieren einer Zutat
export const putZutat = async (zutat: Zutat): Promise<Zutat> => {
  try {
    const response = await fetch(`${API_URL}/zutat`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zutat),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Aktualisieren der Zutat: ${response.statusText}`);
    }

    return await response.json(); // Gibt die aktualisierte Zutat zurück
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Zutat:', error);
    throw error;
  }
};

// DELETE-Methode zum Löschen einer Zutat
export const deleteZutat = async (zutatId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/zutat/${zutatId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Löschen der Zutat: ${response.statusText}`);
    }
    // Keine Rückgabe erforderlich, wenn die Zutat erfolgreich gelöscht wurde
  } catch (error) {
    console.error('Fehler beim Löschen der Zutat:', error);
    throw error;
  }
};

export const getUserByEmail = async (emailAdresse: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/user/get/withmail?mail=${emailAdresse}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Benutzer nicht gefunden
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userData = await response.json();

    // Unterstützte Bildformate
    const validImageExtensions = ['.png', '.jpg', '.jpeg'];

    // Validierung des Bildes
    const userImage = userData.picture || 'default.jpg'; // Standardbild, falls keines vorhanden
    const isValidImage = validImageExtensions.some(ext => userImage.endsWith(ext));

    return userData.emailAdresse
      ? {
          emailAdresse: userData.emailAdresse,
          username: userData.username || 'Unbekannter Benutzer',
          passwort: userData.passwort,
          id: userData.id,
          foto: isValidImage ? userImage : 'default.jpg', // Fallback auf Standardbild
        }
      : null;
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    throw error;
  }
};


export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Benutzer nicht gefunden
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    throw error;
  }
};
//Backedn verarbeitet die Daten nicht korrekt. Tom Holland wird nicht gespeichert.

/*
export const uploadUserImage = async (base64Image: string, userId: number): Promise<void> => {
  try {
      const response = await fetch(`http://localhost:8080/user/image/${userId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              image: base64Image,
          }),
      });

      if (!response.ok) {
          throw new Error(`Fehler beim Hochladen des Bilds! Status: ${response.status}`);
      }

      console.log("Bild erfolgreich hochgeladen.");
  } catch (error) {
      console.error("Fehler beim Hochladen des Bilds:", error);
  }
};*/

export const getUserImageById = async (id: number): Promise<{ imageUrl: string }> => {
  console.log(`Fetching image for user with ID: ${id}`);
  try {
    const response = await fetch(`${API_URL}/user/image/${id}`, {
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

    return {
      imageUrl: `data:${mimeType};base64,${base64String}`,
    };
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzer-Bildes:', error);
    throw error;
  }
};

export const putUser = async (user: User): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Aktualisieren des Benutzers: ${response.statusText}`);
    }

    return await response.json(); // Gibt die aktualisierten Benutzerdaten zurück
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    throw error;
  }
};

export const updateUser = async (user: User): Promise<{ status: number, statusText: string }> => {
  const response = await fetch(`${API_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return { status: response.status, statusText: response.statusText }; // Rückgabewert hinzufügen
};

// api.ts

export const uploadUserImage = async (userId: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/user/image/${userId}`, {
      method: 'POST',
      body: formData, // Der Content-Type wird automatisch korrekt gesetzt
    });

    // Überprüfen, ob die Anfrage erfolgreich war
    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(`Fehler beim Hochladen des Bildes: ${errorMessage}`);
    }

    // Erfolgreicher Upload, keine Rückgabe notwendig
    console.log('Bild erfolgreich hochgeladen.');

  } catch (error) {
    console.error('Fehler beim Bild-Upload:', error);
    throw error;
  }
};




//REZEPTE
export const uploadImage = async (recipeId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`http://localhost:8080/rezepte/image/${recipeId}`, {
      method: 'POST',
      body: formData,
  });

  if (!response.ok) {
      throw new Error(`Fehler beim Hochladen: ${response.statusText}`);
  }

  const result = await response.text(); // Oder response.json() je nach API
  if (!result) {
      throw new Error('Kein Bildpfad in der API-Antwort gefunden.');
  }

  return result;
};




//Timer

// src/services/timerService.ts
export const fetchTimer = async (zeit: number): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/timer/${zeit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text(); // Antwort als Text zurückgeben
  } catch (error) {
    console.error('Error fetching Timer:', error);
    throw error;
  }
};



