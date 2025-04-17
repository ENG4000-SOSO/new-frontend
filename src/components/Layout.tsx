import { Container, Theme } from '@chakra-ui/react';
import { Toaster } from '@components/ui/toaster';
import React from 'react';

import { useTheme } from '@context/theme/theme_context';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div>
      <Theme appearance={theme}>
        <Navbar />
        <Container maxW="container.lg" pt={20}>
          {children}
        </Container>
        <Footer />
        <Toaster />
      </Theme>
    </div>
  );
};

export default Layout;
