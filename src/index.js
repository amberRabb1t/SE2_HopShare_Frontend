import { createRoot } from 'react-dom/client';
import App from './App.js';
import './index.css';

const container = document.getElementById('root'); // Assuming there's a div with id 'root' in index.html
const root = createRoot(container); // Create a root.
root.render(<App />); // Initial render using the App component

