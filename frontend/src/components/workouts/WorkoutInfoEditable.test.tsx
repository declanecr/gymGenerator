import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutInfoEditable } from './WorkoutInfoEditable';

describe('WorkoutInfoEditable', () => {
  it('allows editing name and notes', async () => {
    const onPatch = jest.fn();
    render(<WorkoutInfoEditable name="A" notes="B" onPatch={onPatch} />);
    const user = userEvent.setup();
    await act(async()=>{ await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);});
    const nameInput = screen.getByRole('textbox');
    await act(async()=>{
        await user.clear(nameInput);
        await user.type(nameInput, 'New');
        await user.click(screen.getByRole('button', { name: /save/i }));
    });
    expect(onPatch).toHaveBeenCalledWith({ name: 'New' });

    await act(async()=>{ await user.click(screen.getAllByRole('button', { name: /edit/i })[1]); });
    const notesInput = screen.getByRole('textbox');
    await act(async()=>{
        await user.clear(notesInput);
        await user.type(notesInput, 'Note');
        await user.click(screen.getByRole('button', { name: /save/i }));
    });
    expect(onPatch).toHaveBeenCalledWith({ notes: 'Note' });
  });
});