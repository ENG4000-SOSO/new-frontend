import { Container } from '@chakra-ui/react';
import { Toaster } from '@components/ui/toaster';
import React from 'react';

import Navbar from './Navbar';

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
