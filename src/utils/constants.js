export const API_BASE = process.env.REACT_APP_API_BASE;
export const BASIC_AUTH_ENABLED = String(process.env.REACT_APP_BASIC_AUTH_ENABLED || 'true').toLowerCase() === 'true';

export const STORAGE_KEY = 'hopshare_auth';
export const TIMESTAMP_SECONDS = () => Math.floor(Date.now() / 1000);

export const REQUIRED_MESSAGE = 'Please fill all mandatory information';

