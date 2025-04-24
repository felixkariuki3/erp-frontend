import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
