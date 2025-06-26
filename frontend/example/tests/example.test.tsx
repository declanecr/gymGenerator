import { render } from '@testing-library/react';
import { ExamplePage } from '../page/ExamplePage';

describe('ExamplePage', () => {
  it('renders without crashing', () => {
    render(<ExamplePage />);
  });
});
