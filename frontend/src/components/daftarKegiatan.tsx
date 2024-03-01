import { Box, Button, Card, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import KegiatanTable from "./tabelKegiatan";
import FilterListIcon from '@mui/icons-material/FilterList';
import styles from '../styles/styles.module.css';
import { SelectChangeEvent } from '@mui/material';
import AddProyekDialog from "./addProyek";
import colors from "@/styles/colors";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddActivityDialog from "./addActivity";

interface Kegiatan {
  id: number;
  activityname: string;
  projectid: number;
  startdate: string;
  enddate: string;
  starttime: string;
  endtime: string;
  projectname: string;
  [key: string]: string | number;
}

const KegiatanList: React.FC = () => {
  const [dataKegiatan, setDataKegiatan] = useState<Kegiatan[]>([]);
  const [namaKaryawan, setNamaKaryawan] = useState<string>("Belum Terdaftar");
  const [rate, setRate] = useState<number>(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [openAddActivity, setOpenAddActivity] = useState(false);
  const [sortedData, setSortedData] = useState<Kegiatan[]>([]);

  

  const fetchProjects = () => {
    fetch("http://localhost:3003/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  };

  useEffect(() => {
    fetch("http://localhost:3003/activity-list")
      .then((response) => response.json())
      .then((data) => {
        if(sortedData.length===0){
          setSortedData(data)
        }
        setDataKegiatan(data)
      })
      .catch((error) => console.error("Error fetching data:", error));

      const storedNamaKaryawan = localStorage.getItem("namaKaryawan");
    const storedRate = localStorage.getItem("rate");

    if (storedNamaKaryawan) {
      setNamaKaryawan(storedNamaKaryawan);
    }
    if (storedRate) {
      setRate(Number(storedRate));
    }
    fetchProjects()
    
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCancelFilter = () => {
    setSelectedProjects([])
setSortedData(dataKegiatan);
    setOpenFilter(false);
  };
  const handleCloseFilter = () => {
    setSelectedProjects([])
setSortedData(dataKegiatan);
    setOpenFilter(false);
  };

  const handleSaveFilter = () => {
    const filteredData = selectedProjects.length > 0 
  ? dataKegiatan.filter((kegiatan) => selectedProjects.includes(kegiatan.projectid))
  : dataKegiatan;
setSortedData(filteredData);
    setOpenFilter(false);
  };

  const handleChange = (event: SelectChangeEvent<any[]>) => {
    setSelectedProjects(event.target.value as number[]);
  };

  if(!sortedData){
    setSortedData(dataKegiatan)
  }

  const handleAddProject = () => {
    setOpenFilter(false)
    setOpenAddProject(true)
  };
  const closeAddProjectHandler = () => {
    setOpenAddProject(false)
  };

  const handleAddActivity = () => {
    setOpenAddActivity(true)
  };
  const closeAddActivity = () => {
    console.log('hit')
    setOpenAddActivity(false)
  };

  function idrFormat(rate: number): string {
    const idr = rate.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });

    return `${idr}/jam`
}

  return (
    <Card style={{minHeight:'80vh', borderRadius: 10 ,}}>
       <div className={styles.container}>
      <div className={styles.column}>
        <span>Nama Karyawan</span>
        <span>{namaKaryawan}</span>
      </div>
      <div className={styles.column}>
        <span>Rate</span>
        <span>{idrFormat(rate)}</span>
      </div>
    </div>
      <Divider style={{ marginBottom: 10 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginRight: '10px' }}>
    Daftar kegiatan
  </Typography>
  <Button startIcon={<AddCircleOutlineIcon/>} color="primary" size="small" onClick={handleAddActivity} sx={{borderRadius:2, backgroundColor:colors.lightBlue, color:colors.blue, fontWeight:'bold'}}>
    Tambah kegiatan
  </Button>
</Box>

  <Box display="flex" alignItems="center">
    <TextField
      variant="outlined"
      placeholder="Cari kegiatan"
      size="small"
      margin="dense"
    />
    <IconButton onClick={handleOpenFilter}>
        <FilterListIcon />
      </IconButton>
  </Box>
</Box>

      <KegiatanTable data={sortedData} rate={rate} />
      <Dialog open={openFilter} onClose={handleCloseFilter} sx={{ width: 1500 }} >
        <DialogTitle>Pilih Proyek</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="project-filter-label">Proyek</InputLabel>
            <Select
              labelId="project-filter-label"
              id="project-filter"
              multiple
              value={selectedProjects}
              onChange={handleChange}
              label="Proyek"
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelFilter}>Hapus Filter</Button>
          <Button onClick={handleSaveFilter} variant="contained" color="secondary">
            Terapkan
          </Button>
        </DialogActions>
      </Dialog>
      <AddProyekDialog
      open={openAddProject}
      handleClose={closeAddProjectHandler}>
      </AddProyekDialog>
      <AddActivityDialog open={openAddActivity} onClose={closeAddActivity} projects={projects} handleAddProject={handleAddProject}/>
    </Card>
  );
};

export default KegiatanList;
