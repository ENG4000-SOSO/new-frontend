import { Box, Button, Flex, Icon, Spacer, Switch } from '@chakra-ui/react';
import { useAuth } from '@context/auth/auth_context';
import { useTheme } from '@context/theme/theme_context';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const { theme, switchTheme } = useTheme();

  return (
    <Box
      shadow="lg"
      backgroundColor={theme === "light" ? "white" : "black"}
      p={4}
      position="fixed"
      width="100%"
      top={0}
      zIndex={1}
    >
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
            <Link to="/groundstations">Ground Stations</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/missions">Missions</Link>
          </Button>
        </Box>
        <Spacer />
        {user ? (
          <Button variant="ghost" onClick={logout} marginRight="3px">Logout</Button>
        ) : (
          <></>
        )}
        <Switch.Root
          colorPalette="white"
          size="lg"
          checked={theme === "dark"}
          onCheckedChange={switchTheme}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
            <Switch.Indicator fallback={<Icon as={FaMoon} color="black" />}>
              <Icon as={FaSun} color="black" />
            </Switch.Indicator>
          </Switch.Control>
        </Switch.Root>
      </Flex>
    </Box>
  );
};

export default Navbar;