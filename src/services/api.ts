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
  }
  
  interface Allergen {
    id: number;
    name: string;
    zutaten: string[];
  }
  

  export const fetchZutatById = async (id: number): Promise<ZutatDerWoche['zutat']> => {
    try {
      const response = await fetch(`${API_URL}/zutaten/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Zutat by ID:', error);
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
  
      // Hole den Content-Type vom Server (falls verfügbar)
      const contentType = response.headers.get('Content-Type') || '';
      let mimeType = 'image/jpeg'; // Standard-MIME-Typ
  
      // Überprüfe, ob der Content-Type den Bildtyp enthält
      if (contentType.includes('image/png')) {
        mimeType = 'image/png';
      } else if (contentType.includes('image/jpg')) {
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

interface User {
  id: number;
  username: string;
  passwort: string;
  emailAdresse: string;
}

interface Recipe {
  zutaten: any;
  id: number;
  name: string;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  user_Id: User;
  durchschnittlicheBewertung: number;
  flag: number;
}

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
      throw new Error(`Fehler beim Hinzufügen des Rezepts: ${response.statusText}`);
    }

    return await response.json(); // Gibt das gespeicherte Rezept zurück
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Rezepts:', error);
    throw error;
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
            emailAdresse: rezept.user_Id.emailAdresse ?? ''
          }
        : { id: 0, username: '', passwort: '', emailAdresse: '' },  // Sicherstellen, dass user_Id immer existiert
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

