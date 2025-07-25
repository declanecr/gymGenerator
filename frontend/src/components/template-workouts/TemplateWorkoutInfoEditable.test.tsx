import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateWorkoutInfoEditable } from './TemplateWorkoutInfoEditable';

describe('TemplateWorkoutInfoEditable', () => {
  it('allows editing name and notes', async () => {
    const onPatch = jest.fn();
    render(<TemplateWorkoutInfoEditable name="A" notes="B" onPatch={onPatch} />);
    const user = userEvent.setup();
    await act(async()=>{ await user.click(screen.getByRole('button', { name: /edit name/i })); });
    const nameInput = screen.getByLabelText(/name/i);
    await act(async()=>{
        await user.clear(nameInput);
        await user.type(nameInput, 'New');
        await user.click(screen.getByRole('button', { name: /save/i }));
    });
    expect(onPatch).toHaveBeenCalledWith({ name: 'New' });

    await act(async()=>{ await user.click(screen.getByRole('button', { name: /edit notes/i })); });
    const notesInput = screen.getByLabelText(/notes/i);
    await act(async()=>{
        await user.clear(notesInput);
        await user.type(notesInput, 'Note');
        await user.click(screen.getByRole('button', { name: /save/i }));
    });
    expect(onPatch).toHaveBeenCalledWith({ notes: 'Note' });
  });
});