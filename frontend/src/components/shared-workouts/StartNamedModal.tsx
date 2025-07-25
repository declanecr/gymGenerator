import React, { useState } from 'react';
import Modal from '@mui/material/Modal';

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
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ /* your styles */ }}>
        <h2>{title}</h2>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <label>Notes:</label>
        <input value={notes} onChange={e => setNotes(e.target.value)} />
        <button onClick={onClose} disabled={submitting}>Cancel</button>
        <button type="submit" disabled={submitting}>Start</button>
      </form>
    </Modal>
  );
}
