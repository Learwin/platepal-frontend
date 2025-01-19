
import { PostTimerModel } from "./PostTimerModel";
import { PostZutatenModel } from "./PostZutatenModel";

export interface PostRezeptModel {
  name: string; // Name des Rezepts
  anweisungen: string; // Anleitung oder Beschreibung des Rezepts
  zeit: number; // Zeit in Minuten oder Sekunden
  schwierigkeit: number; // Schwierigkeitsskala von 1 bis 5
  defaultPortionen: number; // Standardanzahl an Portionen
  durchschnittlicheBewertung: number; // Durchschnittliche Bewertung des Rezepts
  flag?: number; // Optionales Flag, z.B. für Status oder Sichtbarkeit
  zutaten: PostZutatenModel[]; // Liste der Zutaten mit Mengenangaben
  user_Id: number; // ID des Benutzers
  timer: PostTimerModel[];
}

