import React from 'react';
import ReactDOM from 'react-dom/client'; // Hier importierst du die Komponente ohne 'default'
import App from 'App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Das Root-Element mit der ID 'root' wurde nicht gefunden.");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App /> {/* Lade die Startseite */}
  </React.StrictMode>,
);