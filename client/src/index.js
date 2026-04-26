import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// The main entry point. Just renders the App inside a BrowserRouter, which is needed for routing to work. Template basically copied from create-react-app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap and render in a router
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
