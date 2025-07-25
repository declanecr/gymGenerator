import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StartNamedModal } from './StartNamedModal';

describe('StartNamedModal', () => {
  it('submits form and navigates', async () => {
    const createFn = jest.fn().mockResolvedValue({ id: 1 });
    const getPath = jest.fn().mockReturnValue('/workouts/1');
    const onNavigate = jest.fn();
    const onClose = jest.fn();
    render(
      <StartNamedModal
        open
        onClose={onClose}
        title="Start"
        createFn={createFn}
        getSuccessPath={getPath}
        onNavigate={onNavigate}
      />
    );
    const user = userEvent.setup();
    const inputs = screen.getAllByRole('textbox');
    await act(async()=>{
        await user.type(inputs[0], 'A');
        await user.type(inputs[1], 'B');
        await user.click(screen.getByRole('button', { name: /start/i }));
    });
    expect(createFn).toHaveBeenCalledWith({ name: 'A', notes: 'B' });
    await screen.findByRole('button', { name: /start/i });
    expect(onClose).toHaveBeenCalled();
    expect(onNavigate).toHaveBeenCalledWith('/workouts/1');
  });
  
  it('cancels without calling createFn', async () => {
    const createFn = jest.fn();
    const onClose = jest.fn();
    const onNavigate = jest.fn();
    render(
      <StartNamedModal
        open={true}
        onClose={onClose}
        title="New"
        createFn={createFn}
        getSuccessPath={() => '/'}
        onNavigate={onNavigate}
      />
    );
    const user = userEvent.setup();
    await act(async()=>{await user.click(screen.getByRole('button', { name: /cancel/i })); });
    expect(onClose).toHaveBeenCalled();
    expect(createFn).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });
});