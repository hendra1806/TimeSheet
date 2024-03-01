import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import colors from '@/styles/colors';

interface Props {
}

export default function NavBar(props: Props) {
 
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '8vh' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{backgroundColor:'white'}}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } , color:colors.red, fontWeight:'900'}}
          >
            <div style={{fontSize:'16px'}}>Timesheet</div>
            <div style={{fontSize:'13px'}}>Management</div>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}