import { handlers } from './handlers';

const base = 'http://localhost:3000/api/v1/workouts';

describe('mock handlers', () => {
  it('returns workout by id', async () => {
    const res = await fetch(`${base}/123`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(
      expect.objectContaining({ id: '123', workoutExercises: [] })
    );
  });

  it('returns list of workouts', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(2);
  });

  it('handles CORS preflight', async () => {
    const res = await fetch(base, { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
  });
  
  it('exports an array of handlers', () => {
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBeGreaterThan(0);
  });
});
