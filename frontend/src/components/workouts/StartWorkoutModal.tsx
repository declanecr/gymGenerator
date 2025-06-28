import React, { useState } from 'react';
import Modal from '@mui/material/Modal'; // or use your preferred modal
import { useCreateWorkout } from '../../hooks/workouts/useCreateWorkout';
import { useNavigate } from 'react-router-dom';

interface StartWorkoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StartWorkoutModal({ open, onClose }: StartWorkoutModalProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const createWorkout = useCreateWorkout();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createWorkout.mutate(
      { dto: { name, notes } },
      {
        onSuccess: (workout) => {
          onClose();
          navigate(`/workouts/${workout.id}`);
        },
      }
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form
        style={{
          background: ' grey',
          padding: '2em',
          margin: '10% auto',
        }}
        onSubmit={handleSubmit}
      >
        <h2>Start New Workout</h2>
        <div>
          <label>Name:</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Required"
          />
        </div>
        <div>
          <label>Notes:</label>
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div style={{ marginTop: '1em' }}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" style={{ marginLeft: 8 }}>
            Start
          </button>
        </div>
      </form>
    </Modal>
  );
}
