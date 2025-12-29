// Backend API base URL
export const API_BASE = process.env.REACT_APP_API_BASE;

// Whether to use basic authentication
export const BASIC_AUTH_ENABLED = String(process.env.REACT_APP_BASIC_AUTH_ENABLED || 'true').toLowerCase() === 'true';

// Key for storing auth info in localStorage
export const STORAGE_KEY = 'hopshare_auth';

// Function to get current timestamp in seconds
export const TIMESTAMP_SECONDS = () => Math.floor(Date.now() / 1000);

// Shows up when a required field is missing in a form and the user tries to submit it
export const REQUIRED_MESSAGE = 'Please fill all mandatory information';

