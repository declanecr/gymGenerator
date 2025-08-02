import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Fab } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import StartWorkoutModal from '../workouts/StartWorkoutModal';
import StartTemplateModal from '../template-workouts/StartTemplateModal';

export default function MobileNavBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showWorkout, setShowWorkout] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <IconButton color="inherit" onClick={() => navigate('/dashboard')}>\
          <HomeIcon />\
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate('/progress')}>\
          <BarChartIcon />\
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Fab
          color="secondary"
          aria-label="add"
          onClick={e => setAnchorEl(e.currentTarget)}
          sx={{ position: 'absolute', right: 16, top: -30 }}
        >
          <AddIcon />
        </Fab>
        <IconButton color="inherit" onClick={() => navigate('/user')}>\
          <PersonIcon />\
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { setAnchorEl(null); setShowTemplate(true); }}>Template</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); setShowWorkout(true); }}>Workout</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/create-exercise'); }}>Exercise</MenuItem>
        </Menu>
        <StartTemplateModal open={showTemplate} onClose={() => setShowTemplate(false)} />
        <StartWorkoutModal open={showWorkout} onClose={() => setShowWorkout(false)} />
      </Toolbar>
    </AppBar>
  );
}