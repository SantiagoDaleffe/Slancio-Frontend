export const API_BASE_URL = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')

export const ENDPOINTS = {
    SAVE_RULES: `${API_BASE_URL}/config/rules`,
}