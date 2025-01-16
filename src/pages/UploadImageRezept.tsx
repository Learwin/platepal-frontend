import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  recipeId: number;
}

const UploadImageRezept: React.FC<ImageUploadDialogProps> = ({ open, onClose, onUpload, recipeId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Bitte wähle ein Bild aus.');
      return;
    }

    try {
      setLoading(true);
      await onUpload(file); // Bild hochladen
      setLoading(false);
      onClose(); // Modal schließen
    } catch (error) {
      console.error('Fehler beim Bild-Upload:', error);
      setLoading(false);
    }
  };


return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bild hochladen</DialogTitle>
      <DialogContent>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && (
          <div style={{ marginTop: '20px' }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Abbrechen
        </Button>
        <Button onClick={handleUpload} color="primary" disabled={loading}>
          {loading ? 'Lädt...' : 'Hochladen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default UploadImageRezept;