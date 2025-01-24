import { Button } from '@mui/material';
import { Microwave } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import styles from '../Timer.module.css'; // Importiere die CSS-Modul-Datei

interface TimerProps {
  initialTime: number; // Zeit in Minuten
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [remainingTime, setRemainingTime] = useState<number>(initialTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000); // Countdown jede Sekunde
    } else if (remainingTime <= 0) {
      setIsRunning(false); // Stoppen des Timers, wenn Zeit abgelaufen ist
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingTime]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev); // Toggle zwischen Start und Pause
  };

  // Berechne Stunden, Minuten und Sekunden
  const hours = Math.floor(remainingTime / 3600); // 1 Stunde = 3600 Sekunden
  const minutes = Math.floor((remainingTime % 3600) / 60); // Restliche Minuten
  const seconds = remainingTime % 60; // Restliche Sekunden

  // Formatierte Zeit im hh:mm:ss Format
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div>
      <Button
        className={`${styles.timerButton} ${isRunning ? styles.running : ''}`} // Dynamische Klassen, je nach Timer-Status
        variant="contained"
        onClick={handleStartPause}
      >
        <Microwave size={20} style={{ marginRight: 8 }} />
        {isRunning ? 'Pause' : 'Kochzeit'}: {formattedTime}
      </Button>
    </div>
  );
};

export default Timer;
