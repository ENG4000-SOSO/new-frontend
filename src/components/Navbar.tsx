import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useAuth } from '@context/auth/auth_context';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const { user, logout } = useAuth();

  return (
    <Box bg="white" shadow="sm" p={4} position="fixed" width="100%" top={0} zIndex={1}>
      <Flex>
        <Box>
          <Button asChild variant="ghost">
            <Link to="/">Home</Link>
          </Button>
        </Box>
        <Spacer />
        <Box>
          <Button asChild variant="ghost">
            <Link to="/satellites">Satellites</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/groundstations">Ground Station</Link>
          </Button>
        </Box>
        <Spacer />
        {user ? (
            <Button variant="solid" color="white" onClick={logout}>Logout</Button>
          ) : (
            <></>
          )}
      </Flex>
    </Box>
  );
};

export default Navbar;
