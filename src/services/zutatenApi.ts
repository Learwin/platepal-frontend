import { User } from "./api";

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
  foto?: string;
  allergene: Allergen[];
}

export interface ZutatEdit {
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
  allergene: Allergen[];
}

interface Rezept {
  id: number;
  anweisungen: string;
  zeit: number;
  schwierigkeit: number;
  defaultPortionen: number;
  foto: string;
  user_Id: User;
  durchschnittlicheBewertung: number;
  name: string;
}



export interface Allergen {
  id: number;
  name: string;
}

export const getDefaultIngredient = (): Zutat => ({
    id: 0,
  name: '',
  kcal: 0,
  fett: 0,
  gesaettigteFettsaeuren: 0,
  kohlenhydrate: 0,
  zucker: 0,
  ballaststoffe: 0,
  eiweiss: 0,
  salz: 0,
  foto: '',
  allergene: [],
});

const API_URL = 'http://localhost:8080'

export const fetchAllergene = async (): Promise<Allergen[]> => {
  try {
    const response = await fetch(`${API_URL}/allergen/list`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Allergene list:', error);
    throw error;
  }
};
  

export const getIngredientById = async (id: number): Promise<Zutat> => {
  const response = await fetch(`/api/zutat/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch ingredient');
  }
  const ingredient = await response.json();
  return ingredient;
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



  export const fetchRezepteByAllergenId = async (allergenId: number): Promise<Rezept[]> => {
    try {
      const response = await fetch(`http://localhost:8080/allergen/${allergenId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Rezepte by Allergen ID:', error);
      throw error;
    }
  };
  
  

export const postZutat = async (zutat: Zutat) => {
  const response = await fetch(`${API_URL}/zutat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...zutat }),
  });
  if (!response.ok) {
    throw new Error('Failed to save ingredient');
  }
  return response.json();
};

export const putZutat = async (zutat: ZutatEdit): Promise<ZutatEdit> => {
    console.log("Zutat zum Aktualisieren:", zutat);  // Hier die Zutat loggen
  const response = await fetch(`${API_URL}/zutat`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...zutat }),
  });

  if (!response.ok) {
    throw new Error('Fehler beim Aktualisieren der Zutat');
  }

  return response.json();
};

export const postAllergen = async (allergen: Allergen) => {
  const response = await fetch(`${API_URL}/allergen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...allergen }),
  });
  if (!response.ok) {
    throw new Error('Failed to save ingredient');
  }
  return response.json();
};


export const uploadZutatImage = async (zutatId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch(`http://localhost:8080/zutat/image/${zutatId}`, {
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

  export const fetchZutatByIdImage = async (id: number): Promise<{ imageUrl: string }> => {
    try {
      // Hier wird die API aufgerufen, um das Bild für die Zutat zu erhalten
      const response = await fetch(`http://localhost:8080/zutat/image/${id}`);
  
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
