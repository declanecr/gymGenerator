import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Box, Typography, Grid, Button } from '@mui/material';
import StartGlobalTemplateModal from '../../components/template-workouts/StartGlobalTemplateModal';
import AdminPageLayout from '../../layouts/AdminPageLayout';
import type { Workout } from '../../api/workouts';

interface Props {
  workouts: Workout[] | undefined;
  showTemplateModal: boolean;
  setShowTemplateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminPageTablet({ workouts, showTemplateModal, setShowTemplateModal }: Props) {
  return (
    <AdminPageLayout>
      <Box p={4}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid>
            <Link to="/dashboard">Back to dashboard</Link>
          </Grid>
          <Grid>
            <Button variant="contained" onClick={() => setShowTemplateModal(true)}>
              Create Global Template
            </Button>
          </Grid>
          <Grid>
            <Link to="/create-exercise">Create Default Exercise</Link>
          </Grid>
        </Grid>
        {showTemplateModal && (
          <StartGlobalTemplateModal open={showTemplateModal} onClose={() => setShowTemplateModal(false)} />
        )}
        <Typography variant="h5" mt={4} mb={1}>
          All Workouts
        </Typography>
        <List>
          {workouts?.map(w => (
            <ListItem key={w.id} disablePadding>
              <ListItemText primary={w.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </AdminPageLayout>
  );
}