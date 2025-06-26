import { rest } from 'msw';

export const exampleHandlers = [
  rest.get('/example', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Example' }]));
  }),
];
