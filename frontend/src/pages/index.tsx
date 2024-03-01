import React, { useState } from 'react';
import { Paper, Tab, Tabs } from '@mui/material';
import KegiatanList from '../components/daftarKegiatan';
import Pengaturan from '../components/pengaturan';
import Layout from '@/components/layout';
import colors from '@/styles/colors';



const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Layout>
        <Paper elevation={1}>
      <h1 style={{margin:10}}>HH Timesheet</h1>
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="Daftar Kegiatan" />
        <Tab label="Pengaturan" />
      </Tabs>
      </Paper>
      <Paper style={{ backgroundColor: colors.backgroundPage, marginTop: '2vh', width: '199vh', alignItems:'center' }}>
      {currentTab === 0 && <KegiatanList/>}
      {currentTab === 1 && <Pengaturan/>}
      </Paper >
    </Layout>
  );
};

export default Home;
