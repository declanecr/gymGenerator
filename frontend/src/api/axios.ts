//This file sets the prefix for all requests to `http:localhost:3000/api/v1`

import axios from 'axios'

const api = axios.create({
  baseURL: /*import.meta.env.VITE_API_URL ??*/ 'http://localhost:3000/api/v1', //TODO
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
