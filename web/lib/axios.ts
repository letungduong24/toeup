import axios from "axios"

const api = axios.create({
  // Use API URL from env; fallback to 8000 (API) instead of web port 3000
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
})

export default api
