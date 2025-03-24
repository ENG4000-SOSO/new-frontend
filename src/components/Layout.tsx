import React from 'react';
import { Container } from '@chakra-ui/react';
import Navbar from './Navbar';
import { Toaster } from '@components/ui/toaster'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Container maxW="container.lg" mt={20}>
        {children}
      </Container>
      <Toaster />
    </div>
  );
};

export default Layout;
