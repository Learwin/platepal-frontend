import React from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box, Tooltip } from '@mui/material';
import styles from '../Naehrwert.module.css';

interface Zutat {
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
}

interface NaehrwerteTabelleProps {
  zutat: Zutat;
}

const NaehrwerteTabelle: React.FC<NaehrwerteTabelleProps> = ({ zutat }) => {
  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.header}>
        Nährwerte für {zutat.name} (pro 100g)
      </Typography>
      <Table className={styles.table} size="small">
        <TableBody>
          {[
            { label: 'Kcal', value: zutat.kcal },
            { label: 'Fett', value: `${zutat.fett} g` },
            { label: 'Gesättigte Fettsäuren', value: `${zutat.gesaettigteFettsaeuren} g` },
            { label: 'Kohlenhydrate', value: `${zutat.kohlenhydrate} g` },
            { label: 'Zucker', value: `${zutat.zucker} g` },
            { label: 'Ballaststoffe', value: `${zutat.ballaststoffe} g` },
            { label: 'Eiweiß', value: `${zutat.eiweiss} g` },
            { label: 'Salz', value: `${zutat.salz} g` },
          ].map((row) => (
            <TableRow className={styles.row} key={row.label}>
              <Tooltip
                title={row.label === 'Kcal' ? 'Kilokalorien' : row.label}
                classes={{ tooltip: styles.tooltip }} // Hier wird das benutzerdefinierte CSS angewendet
              >
                <TableCell className={`${styles.cell} ${styles.label}`}>
                  {row.label}
                </TableCell>
              </Tooltip>
              <TableCell className={styles.cell}>
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default NaehrwerteTabelle;
