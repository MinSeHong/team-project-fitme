import React from 'react';
import { createRoot } from 'react-dom';

import App from './ChartAppApp.js';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("No element with id 'root' found");
}
