import React, { useState } from 'react';

export function TemplateWorkoutInfoEditable({
  name,
  notes,
  onPatch,
}: {
  name: string;
  notes: string | null | undefined;
  onPatch: (update: Partial<{ name: string; notes: string | null | undefined }>) => void;
}) {
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
      <div>
        <strong>Name: </strong>
        {editingField === 'name' ? (
          <>
            <input type="text" aria-label="Name" value={editValue} onChange={e => setEditValue(e.target.value)} />
            <button type="button" onClick={saveEdit}>Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span>{name}</span>
            <button type= "button" aria-label="edit name" onClick={() => startEditing('name')}>Edit</button>
          </>
        )}
      </div>
      <div>
        <strong>Notes: </strong>
        {editingField === 'notes' ? (
          <>
            <input type="text" aria-label="Notes" value={editValue} onChange={e => setEditValue(e.target.value)} />
            <button type="button" onClick={saveEdit}>Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <span>{notes}</span>
            <button type="button" aria-label="edit notes" onClick={() => startEditing('notes')}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}