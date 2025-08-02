import { Box, Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';

// Type for prop. Adjust as needed!
export function WorkoutInfoEditable({
  name,
  notes,
  onPatch,
}: {
  name: string;
  notes: string | null| undefined;
  onPatch: (update: Partial<{ name: string; notes: string |null |undefined }>) => void;
}) {
  // Which field is being edited?
  const [editingField, setEditingField] = useState<'name' | 'notes' | null>(null);
  const [editValue, setEditValue] = useState('');

  function startEditing(field: 'name' | 'notes') {
    setEditingField(field);
    setEditValue(field === 'name' ? name : notes || '');
  }

  function saveEdit() {
    if (editingField) {
      onPatch({ [editingField]: editValue });
      setEditingField(null);
    }
  }

  function cancelEdit() {
    setEditingField(null);
    setEditValue('');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/*Name*/}
      <Grid container spacing={1} alignItems="center">
        <Grid>
          <strong>Name:</strong>
        </Grid>
        <Grid size={{xs:6}}>
          {editingField === 'name' ? (
            <TextField
              size="small"
              label="Name"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
            />
          ) : (
            <span>{name}</span>
          )}
        </Grid>
        <Grid>
          {editingField === 'name' ? (
            <>
              <Button size="small" onClick={saveEdit}>Save</Button>
              <Button size="small" onClick={cancelEdit}>Cancel</Button>
            </>
          ) : (
            <Button size="small" onClick={() => startEditing('name')}>Edit</Button>
          )}
        </Grid>
      </Grid>
      {/* Notes */}
       <Grid container spacing={1} alignItems="center">
        <Grid>
          <strong>Notes:</strong>
        </Grid>
        <Grid size={{xs:6}}>
          {editingField === 'notes' ? (
            <TextField
              size="small"
              label="Notes"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
            />
          ) : (
            <span>{notes}</span>
          )}
        </Grid>
        <Grid>
          {editingField === 'notes' ? (
            <>
              <Button size="small" onClick={saveEdit}>Save</Button>
              <Button size="small" onClick={cancelEdit}>Cancel</Button>
            </>
          ) : (
            <Button size="small" onClick={() => startEditing('notes')}>Edit</Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
