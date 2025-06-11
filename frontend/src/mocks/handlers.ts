// src/mocks/handlers.ts
import { http } from 'msw';


const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const handlers = [
  // CORS preflight for GET /api/v1/workouts/:id
  http.options('http://localhost:3000/api/v1/workouts/:id', async () => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }),

  // Now intercept the real GET
  http.get('http://localhost:3000/api/v1/workouts/:id', async ({ params }) => {
    return new Response(
      JSON.stringify({
        id: params.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workoutTemplateId: null,
        workoutExercises: [],
      }),
      { status: 200, headers: JSON_HEADERS }
    );
  }),

  // (optional) also intercept list
  http.get('http://localhost:3000/api/v1/workouts', async () => {
    return new Response(
      JSON.stringify([
        {
          id: 'A',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workoutTemplateId: null,
          workoutExercises: [],
        },
        {
          id: 'B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          workoutTemplateId: null,
          workoutExercises: [],
        },
      ]),
      { status: 200, headers: JSON_HEADERS }
    );
  }),

  // (optional) CORS for list
  http.options('http://localhost:3000/api/v1/workouts', async () => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }),

  // …and similarly for POST/PATCH/DELETE if you need them…
];