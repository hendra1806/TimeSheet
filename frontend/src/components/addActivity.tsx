import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';


interface AddActivityDialogProps {
  open: boolean;
  onClose: () => void;
  projects: any;
  handleAddProject: () => void;
}

const AddActivityDialog: React.FC<AddActivityDialogProps> = ({ open, onClose, projects, handleAddProject }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [activityName, setActivityName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3003/activity-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityName,
          projectId: selectedProject,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          startTime: dayjs(`1970-01-01T${startTime}`).format('HH:mm:ss'),
          endTime: dayjs(`1970-01-01T${endTime}`).format('HH:mm:ss')
        })
    });
    
    console.log(startTime)
    console.log(endTime)
      if (response.ok) {
        const data = await response.json();
        console.log('Data saved successfully:', data);
        onClose();
      } else {
        console.error('Failed to save data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 5, marginBottom: 5 }}>
          <TextField
            label="Tanggal Mulai"
            type="date"
            fullWidth
            value={startDate?.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 1, width: '25%', mt: 1 }}
          />
          <TextField
            label="Tanggal Berakhir"
            type="date"
            fullWidth
            value={endDate?.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 1, width: '25%', mt: 1 }}
          />
          <TextField
            label="Jam Mulai"
            type="time"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            sx={{ mb: 1, width: '25%', mt: 1 }}
          />
          <TextField
            label="Jam Berakhir"
            type="time"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            sx={{ mb: 1, width: '25%', mt: 1 }}
          />
        </Box>
        <Typography color={'GrayText'}>
          Judul kegiatan
        </Typography>
        <TextField
          fullWidth
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Typography color={'GrayText'}>
          Nama Proyek
        </Typography>
        <TextField
          select
          fullWidth
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          sx={{ mb: 1 }}
        >
          <MenuItem onClick={handleAddProject} sx={{ color: 'red' }}> + Tambah Proyek</MenuItem>
          {projects.map((project: any) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'red' }}>Kembali</Button>
        <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: 'red' }}>Simpan</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityDialog;
