import React, { useState } from 'react';
import { Card, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';


const Pengaturan: React.FC = () => {
  const [namaKaryawan, setNamaKaryawan] = useState<string>(localStorage.getItem('namaKaryawan') || '');
  const [rate, setRate] = useState<string>(localStorage.getItem('rate') || '');

  const handleChangeNamaKaryawan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamaKaryawan(event.target.value);
  };

  const handleChangeRate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRate(event.target.value);
  };

  const handleCancel = () => {
    localStorage.removeItem('namaKaryawan');
    localStorage.removeItem('rate');
    setNamaKaryawan('');
    setRate('');
  };

  const handleSave = () => {
    localStorage.setItem('namaKaryawan', namaKaryawan);
    localStorage.setItem('rate', rate);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Pengaturan berhasil disimpan',
  });

  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ p: 2, width: '50vh', padding:5, height:'40vh'}}>
      <Typography color={'GrayText'}>
          Nama Karyawan
        </Typography>
        <TextField
          value={namaKaryawan}
          onChange={handleChangeNamaKaryawan}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Typography color={'GrayText'}>
          Rate
        </Typography>
        <TextField
          value={rate}
          onChange={handleChangeRate}
          fullWidth
          variant="outlined"
          InputProps={{ endAdornment: <div style={{ color: 'GrayText' }}>/jam</div> }}
          sx={{ mb: 2 }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button onClick={handleCancel} sx={{ flexBasis: '50%' }}>Batalkan</Button>
          <Button variant="contained" onClick={handleSave} sx={{ flexBasis: '50%' }}>Simpan</Button>
        </div>
      </Card>
    </div>
  );
};

export default Pengaturan;
