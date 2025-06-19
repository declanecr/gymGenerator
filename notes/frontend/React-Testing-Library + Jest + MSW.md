#frontend #testing #API 

# OUTLINE OF USING JEST FOR E2E TESTING
%% Uses Workouts model for example %%


## 1. Install dependencies

```bash
# In your frontend folder
npm install --save-dev jest ts-jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom msw
```

---

## 2. Directory structure

```
frontend/
├─ src/
│  ├─ api/
│  │  └─ __tests__/
│  │     └─ workouts.test.ts
│  ├─ components/
│  │  └─ __tests__/
│  │     └─ WorkoutsPage.test.tsx
│  ├─ mocks/                    ← for MSW handlers if using integration tests
│  │  ├─ handlers.ts
│  │  └─ server.ts
│  ├─ index.tsx
│  └─ …
├─ jest.config.js               ← Jest config
├─ jest.setup.ts                ← global setup (e.g. jest-dom, MSW)
└─ package.json                 ← add “test” script
```

---

## 3. `package.json` script

```jsonc
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch"
  }
}
```

---

## 4. `jest.config.js`

```js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};
```

---

## 5. `jest.setup.ts`

```ts
// import custom matchers, start MSW server, etc.
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Start MSW before all tests, reset handlers, then close
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 6. Example unit test skeleton

```ts
// src/api/__tests__/workouts.test.ts
import api from '../axios';
import { fetchWorkout } from '../workouts';

jest.mock('../axios', () => ({
  __esModule: true,
  default: { 
	  get: jest.fn() 
	  //add post, put, patch, etc. here as needed
  },
}));
const mockedApi = api as jest.Mocked<typeof api>;

describe('fetchWorkout', () => {
  it('GETs /workouts/:id and returns data', async () => {
    // Arrange -- prepare fake data to return
    const fake = { data: { id: '1', /*…*/ } };
    // Stub api.get
    mockedApi.get.mockResolvedValueOnce(fake);

    // Act -- call fetchWorkout with a specific input
    const result = await fetchWorkout('1');

    // Assert that api.get was called with the correct URL... (correct endpoint)
    expect(mockedApi.get).toHaveBeenCalledWith('/workouts/1');
    // ...and that the correct payload is returned
    expect(result).toEqual(fake.data);
  });
});
```

---

## 7. Example integration test skeleton (with MSW)

```tsx
// src/components/__tests__/WorkoutsPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WorkoutsPage from '../WorkoutsPage';
import { rest } from 'msw';
import { server } from '../../mocks/server';

describe('WorkoutsPage', () => {
  it('renders list of workouts', async () => {
    // 1️⃣ Override MSW handler for this test only
    server.use(
      rest.get('/api/workouts', (req, res, ctx) =>
        res(ctx.json([{ id: '1', name: 'Leg Day' }]))
      )
    );

    // 2️⃣ Create a fresh React Query client per test
    const qc = new QueryClient();

    // 3️⃣ Render the component under test,
    //    wrapped with QueryClientProvider so useQuery() works
    render(
      <QueryClientProvider client={qc}>
        <WorkoutsPage />
      </QueryClientProvider>
    );

    // 4️⃣ Assert the “loading” state shows up immediately
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // 5️⃣ Wait for the mocked data to be fetched & rendered
    await waitFor(() => {
      expect(screen.getByText('Leg Day')).toBeInTheDocument();
    });
  });
});

```

---

### Breakdown of each part

1. **Imports**
    
    - `render`, `screen`, `waitFor` from React Testing Library for DOM queries and async assertions.
        
    - `QueryClient` & `QueryClientProvider` so that any `useQuery` calls inside your component have context.
        
    - `rest` and `server` from MSW to stub HTTP responses.
        
2. **`describe` / `it`**  
    Groups tests for the `WorkoutsPage` component and gives a human-readable test name.
    
3. **`server.use(...)`**  
    Overrides your global MSW handler just for this test. Here you stub `GET /api/workouts` to return a known array.
    
4. **`new QueryClient()`**  
    Creates an isolated cache for React Query per test, preventing cross-test pollution.
    
5. **`render(<QueryClientProvider>…)`**  
    Mounts `WorkoutsPage` within the necessary provider so its hooks work normally.
    
6. **Initial loading assertion**  
    Confirms your component shows a loading indicator before data arrives, verifying state management.
    
7. **`waitFor` + final assertion**  
    Pauses until React Query resolves the fetch, then checks that the mocked workout name (“Leg Day”) appears in the DOM.
    

---

This pattern ensures your integration test:

- Runs against realistic fetch logic (your component and React Query code remain unchanged).
    
- Uses MSW’s service-worker-style interception to simulate backend responses.
    
- Verifies both loading and loaded states.