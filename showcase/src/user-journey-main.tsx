import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ShowcasePage } from './ShowcasePage';
import { config, allSections } from '../showcases/spiffe-x509/config';

import '@z/ds/index.css';

const journeySections = allSections.filter((s) => !s.id.startsWith('uc'));

const backHref = import.meta.env.DEV ? '/' : `./${config.outputName}.html`;

const journeyConfig = {
  ...config,
  sections: journeySections,
  preamble: undefined,
  preambleNav: [],
  backLink: { href: backHref, label: 'Back to overview' },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShowcasePage config={journeyConfig} />
  </StrictMode>,
);
