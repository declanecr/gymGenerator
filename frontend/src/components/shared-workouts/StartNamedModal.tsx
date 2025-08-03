import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export interface StartNamedModalProps<E> {
  open: boolean;
  onClose: () => void;
  title: string;
  /** called with { name, notes }, should return the created entity */
  createFn: (dto: { name: string; notes: string }) => Promise<E>;
  /** given the created entity, return the path to navigate to */
  getSuccessPath: (entity: E) => string;
  onNavigate: (path: string) => void;
}

export function StartNamedModal<E>({
  open,
  onClose,
  title,
  createFn,
  getSuccessPath,
  onNavigate,
}: StartNamedModalProps<E>) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const entity = await createFn({ name, notes });
      onClose();
      onNavigate(getSuccessPath(entity));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box component={"form"} onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type='submit' variant='contained' disabled={submitting}>
            Start
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
