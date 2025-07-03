import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e24aa',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ba68c8',
      contrastText: '#fff',
    },
    background: {
      default: '#f3e5f5',
      paper: '#fff',
    },
    text: {
      primary: '#4a148c',
      secondary: '#8e24aa',
    },
    error: {
      main: '#e53935',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
); 