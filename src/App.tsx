import React from 'react';
import './App.css';
import Startseite from './pages/Startseite';
import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Anmeldung from './pages/Anmeldung';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Startseite />} />
      </Route>
      <Route path="/login" element={<Anmeldung />} />
      <Route path="/register" element={<Register />} />
        
    </Routes>

    
  );
}

export default App;
