import axios from 'axios'

// In production the API URL MUST be set at build time (VITE_API_URL).
// localhost is only a dev fallback so a misconfigured deploy fails loudly
// instead of silently calling visitors' own machines.
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')
if (!baseURL && !import.meta.env.DEV) {
  console.error('VITE_API_URL is not set - API calls will fail.')
}

const api = axios.create({ baseURL, timeout: 20000 })

export default api
