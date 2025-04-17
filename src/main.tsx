import './index.css';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AuthProvider } from "@context/auth/auth_provider.tsx";
import { ThemeProvider } from "@context/theme/theme_provider.tsx";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
);
