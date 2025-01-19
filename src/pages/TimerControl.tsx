import React, { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import styles from '../Timer.module.css';
import { PostTimerModel } from '../models/PostTimerModel';

interface TimerComponentProps {
  onTimerChange: (newTimers: PostTimerModel[]) => void;  // Callback-Prop zum Weitergeben der Timer
}

const TimerControl: React.FC<TimerComponentProps> = ({ onTimerChange }) => {
  const [timerModels, setTimerModels] = useState<PostTimerModel[]>([]);
  const [newTimer, setNewTimer] = useState<PostTimerModel>({
    timer: { zeit: 5 },
    position: 1,
  });

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const handleZeitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTimer((prevState) => ({
      ...prevState,
      timer: { ...prevState.timer, zeit: parseFloat(e.target.value) },
    }));
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTimer((prevState) => ({
      ...prevState,
      position: parseInt(e.target.value, 10),
    }));
  };

  const handleAddTimer = () => {
    // Timer zum Array hinzufügen
    const updatedTimers = [...timerModels, newTimer];
    setTimerModels(updatedTimers);
    onTimerChange(updatedTimers);  // Den aktualisierten Timer an den Parent weitergeben
    setNewTimer({ timer: { zeit: 5 }, position: 1 });
    setIsFormVisible(false);
  };

  return (
    <div className={styles.rezeptContainer}>
      {!isFormVisible && (
        <Button
          variant="contained"
          className={styles.addRecipeButton}
          onClick={() => setIsFormVisible(true)}
        >
          Timer Hinzufügen
        </Button>
      )}

      {isFormVisible && (
        <Box className={styles.recipeForm}>
          <TextField
            label="Timer Zeit (Minuten)"
            variant="outlined"
            type="number"
            value={newTimer.timer.zeit}
            onChange={handleZeitChange}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="Position im Rezept"
            variant="outlined"
            type="number"
            value={newTimer.position}
            onChange={handlePositionChange}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <Button
            variant="contained"
            className={styles.saveRezeptButton}
            onClick={handleAddTimer}
          >
            Speichern
          </Button>
        </Box>
      )}

      <div className={styles.timerList}>
        <h3>Timer Übersicht</h3>
        {timerModels.length > 0 ? (
          timerModels.map((timer, index) => (
            <div key={index} className={styles.timerItem}>
              <p>Timer {index + 1}: {timer.timer.zeit} Minuten</p>
              <p>Position: {timer.position}</p>
            </div>
          ))
        ) : (
          <p>Keine Timer gesetzt</p>
        )}
      </div>
    </div>
  );
};

export default TimerControl;
