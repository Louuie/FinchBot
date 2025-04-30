import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { BrowserRouter } from 'react-router-dom';  // <-- ADD THIS

const muiCache = createCache({
  key: 'mui',
  prepend: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
  </React.StrictMode>
);
