const API_URL = 'http://localhost:8080';

interface ZutatDerWoche {
    [x: string]: any;
    id: number;
    von: string;
    bis: string;
    zutat: {
        id: number;
        name: string;
        kcal?: number;
        fett?: number;
        gesaettigteFettsaeuren?: number;
        kohlenhydrate?: number;
        zucker?: number;
        ballaststoffe?: number;
        eiweiss?: number;
        salz?: number;
        imageUrl: string;
    }
    
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

  export const fetchZutatByIdImage = async (id: number): Promise<ZutatDerWoche['zutat']> => {
    try {
      const response = await fetch(`${API_URL}/zutat/image/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Konvertiere den Bitstrom in einen Base64-String
      const arrayBuffer = await response.arrayBuffer();
      const base64String = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
  
      return {
        id: id,
        name: '',
        // Den Base64-Bildstrom zur URL hinzufügen
        imageUrl: `data:image/jpeg;base64,${base64String}`,
      };
    } catch (error) {
      console.error('Error fetching Zutat image by ID:', error);
      throw error;
    }
  };
  
  export const fetchZutatDerWoche = async (): Promise<ZutatDerWoche[]> => {
    try {
      const response = await fetch(`${API_URL}/zutatderwoche`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        throw new Error('Expected an array response from /zutatderwoche');
      }
  
      return data; // Rückgabe des Arrays
    } catch (error) {
      console.error('Error fetching Zutat der Woche:', error);
      throw error;
    }
  };
  
export const fetchRezepte = async (): Promise<Array<{ id: number; name: string; imageUrl: string }>> => {
  try {
    const response = await fetch(`${API_URL}/rezepte`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Rezepte:', error);
    throw error;
  }
};
