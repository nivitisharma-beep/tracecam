import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import styles from './styles.css?inline';

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
// Keep the app shell to one generated asset. This also makes static hosting more resilient
// when a CDN has a transient problem serving a separate stylesheet.
const styleTag = document.createElement('style');
styleTag.textContent = styles;
document.head.append(styleTag);
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
