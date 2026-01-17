import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { Provider } from 'react-redux';
import configureStore from './store/index';
import './global.css';
import ErrorBoundary from './errorBoundry';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={configureStore} >  
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  </Provider>
);