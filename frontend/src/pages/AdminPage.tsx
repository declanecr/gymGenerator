import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllWorkouts } from '../hooks/workouts/useAllWorkouts';
import StartGlobalTemplateModal from '../components/template-workouts/StartGlobalTemplateModal';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';

export default function AdminPage() {
  const { data: workouts } = useAllWorkouts();
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  return (
    <Box p={4}>
      <Link to="/dashboard">Back to dashboard</Link>
      <button onClick={() => setShowTemplateModal(true)}>Create Global Template</button>
      {showTemplateModal && (
        <StartGlobalTemplateModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
      <Typography variant="h5" mt={4} mb={1}>All Workouts</Typography>
      <List>
        {workouts?.map(w => (
          <ListItem key={w.id} disablePadding>
            <ListItemText primary={w.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}