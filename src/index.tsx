import React from 'react';
import ReactDOM from 'react-dom';
import { Startseite } from './components/Startseite'; // Hier importierst du die Komponente ohne 'default'

ReactDOM.render(
  <React.StrictMode>
    <Startseite /> {/* Lade die Startseite */}
  </React.StrictMode>,
  document.getElementById('root') // Verweise auf das HTML-Element, in dem die App gerendert wird
);
