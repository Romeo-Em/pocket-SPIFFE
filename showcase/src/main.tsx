import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ShowcasePage } from './ShowcasePage';
import { config } from '../showcases/spiffe-x509/config';

// Grayscale wireframe design tokens (provides var(--z-*) custom properties)
import '@z/ds/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShowcasePage config={config} />
  </StrictMode>,
);
