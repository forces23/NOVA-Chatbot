import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/mainStyles.scss';
import './styles/newLayoutStyles.scss';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { SharedInfoProvider } from './context/sharedContext';

// Adjust viewport height on load and resize
const setViewportHeightAndWidth = () => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
  document.documentElement.style.setProperty('--viewport-width', `${viewportWidth}px`);
}

window.addEventListener('resize', setViewportHeightAndWidth);
window.addEventListener('load', setViewportHeightAndWidth);


// Call immediately in case the events miss the first render
setViewportHeightAndWidth();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SharedInfoProvider>
      <App />
    </SharedInfoProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
