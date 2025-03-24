import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/auth_context';

const Navbar = () => {

  const { user, logout } = useAuth();

  return (
    <Box bg="white" shadow="sm" p={4} position="fixed" width="100%" top={0} zIndex={1}>
      <Flex>
        <Box>
          <Button variant="solid" color="white">
            <Link to="/">Home</Link>
          </Button>
          {user ? (
            <Button variant="solid" color="white" onClick={logout}>Logout</Button>
          ) : (
            <></>
          )}
        </Box>
        {/* <Spacer />
        <Box>
          <Button variant="solid" color="white">
            <Link to="/about">About</Link>
          </Button>
        </Box>
        <Box ml={4}>
          <Button variant="solid" color="white">
            <Link to="/contact">Contact</Link>
          </Button>
        </Box> */}
      </Flex>
    </Box>
  );
};

export default Navbar;
