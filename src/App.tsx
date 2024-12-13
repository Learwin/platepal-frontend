import React from 'react';
import './App.css';
import Startseite from './pages/Startseite';
import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Anmeldung from './pages/Anmeldung';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Startseite />} />
      </Route>
      <Route path="/login" element={<Anmeldung />} />
            
    </Routes>

    
  );
}

export default App;
