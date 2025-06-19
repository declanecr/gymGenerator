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
    <div>
      {/* Name */}
      <div>
        <strong>Name: </strong>
        {editingField === 'name' ? (
          <>
            <input value={editValue} onChange={e => setEditValue(e.target.value)} />
            <button onClick={saveEdit}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span>{name}</span>
            <button onClick={() => startEditing('name')}>Edit</button>
          </>
        )}
      </div>
      {/* Notes */}
      <div>
        <strong>Notes: </strong>
        {editingField === 'notes' ? (
          <>
            <input value={editValue} onChange={e => setEditValue(e.target.value)} />
            <button onClick={saveEdit}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span>{notes}</span>
            <button onClick={() => startEditing('notes')}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}
