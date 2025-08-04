import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, TextField, Autocomplete } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../../hooks/users/useGetMe';
import { useDebounce } from '../../hooks/useDebounce';
import { useFilteredExercises } from '../../hooks/catalog/useFilteredExercise';
import StartWorkoutModal from '../workouts/StartWorkoutModal';
import StartTemplateModal from '../template-workouts/StartTemplateModal';
import BarChartIcon from '@mui/icons-material/BarChart';
import { ExerciseCatalogItem } from '../../api/exerciseCatalog';
import { ExerciseInfoModal } from '../exercises/ExerciseInfoModal';


export default function NavBar() {
  const navigate = useNavigate();
  const { data: me } = useGetMe();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);
  const { filtered } = useFilteredExercises(debounced);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showWorkout, setShowWorkout] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [detailEx, setDetailEx] = useState<ExerciseCatalogItem | null>(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={() => navigate('/dashboard')}>
          <HomeIcon />
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate('/progress')}>
          <BarChartIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, mx: 2 }}>
          <Autocomplete
            freeSolo
            options={filtered}
            getOptionLabel={o => typeof o ==='string' ? o: o.name}
            inputValue={query}
            onInputChange={(_, v) => setQuery(v)}
            onChange={(_, value)=> {
              if (value && typeof value === 'object'){
                setDetailEx(value as ExerciseCatalogItem);
              }
            }}
            renderInput={params => (
              <TextField {...params} variant="outlined" size="small" placeholder="Search exercises..." />
            )}
          />
        </Box>
        {me && <Typography sx={{ mr: 2 }}>{me.name || me.email}</Typography>}
        <IconButton color="inherit" onClick={e => setAnchorEl(e.currentTarget)} aria-label="add">
          <AddIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { setAnchorEl(null); setShowTemplate(true); }}>Template</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); setShowWorkout(true); }}>Workout</MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/create-exercise'); }}>Exercise</MenuItem>
        </Menu>
        <StartTemplateModal open={showTemplate} onClose={() => setShowTemplate(false)} />
        <StartWorkoutModal open={showWorkout} onClose={() => setShowWorkout(false)} />
        <ExerciseInfoModal
          open={!!detailEx}
          exercise={detailEx}
          onClose={()=> setDetailEx(null)}
        />
      </Toolbar>
    </AppBar>
  );
}