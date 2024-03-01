import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from 'axios';
import Swal from 'sweetalert2';

interface AddProyekDialogProps {
  open: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
}
const showAlert = () => {
  Swal.fire({
    icon: 'success',
    title: 'Proyek berhasil ditambahkan!',
    showConfirmButton: false,
    timer: 2000 
  });
};


const AddProyekDialog: React.FC<AddProyekDialogProps> = ({
  open,
  handleClose,
}) => {
  const [projectName, setProjectName] = useState("");

  const handleSaveProyek = () => {
    axios.post('http://localhost:3003/projects', { name: projectName })
    .then(() => {
      handleClose();
      setProjectName('')
    })
    .catch(error => {
      console.error('Error saat menyimpan proyek:', error);
    });
    showAlert()
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tambah Proyek</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="proyek-name"
          label="Nama Proyek"
          type="text"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Batal</Button>
        <Button onClick={handleSaveProyek} variant="contained" color="primary">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProyekDialog;
