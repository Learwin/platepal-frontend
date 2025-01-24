import React from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, Box, Tooltip } from '@mui/material';
import styles from '../Naehrwert.module.css';

interface Naehrwerte {
  kcal: number;
  fett: number;
  gesaettigteFettsaeuren: number;
  kohlenhydrate: number;
  zucker: number;
  ballaststoffe: number;
  eiweiss: number;
  salz: number;
}

interface NaehrwerteTabelleProps {
  naehrwerte: Naehrwerte | null;
  name?: string;
  pro100g?: boolean;
}

const NaehrwerteTabelle: React.FC<NaehrwerteTabelleProps> = ({ naehrwerte, name, pro100g }) => {
  if (!naehrwerte) {
    return <Typography>Nährwerte werden geladen...</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.header}>
        Nährwerte {name ? `für ${name}` : "Gesamt"} {pro100g ? "(pro 100g)" : ""}
      </Typography>
      <Table className={styles.table} size="small">
        <TableBody>
          {Object.entries(naehrwerte).map(([label, value]) => (
            <TableRow className={styles.row} key={label}>
              <Tooltip
                title={label === 'kcal' ? 'Kilokalorien' : label}
                classes={{ tooltip: styles.tooltip }}
              >
                <TableCell className={`${styles.cell} ${styles.label}`}>
                  {label}
                </TableCell>
              </Tooltip>
              <TableCell className={styles.cell}>
                {typeof value === 'number' ? value : `${value} g`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default NaehrwerteTabelle;