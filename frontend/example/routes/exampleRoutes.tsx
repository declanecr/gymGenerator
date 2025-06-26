import { RouteObject } from 'react-router-dom';
import { ExamplePage } from '../page/ExamplePage';

export const exampleRoutes: RouteObject[] = [
  {
    path: '/example',
    element: <ExamplePage />,
  },
];
