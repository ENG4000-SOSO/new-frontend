import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { useAuth } from "@context/auth_context";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Hide the Navbar if user is not logged in or if the current page is /login or /register.
  if (!user || location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <Box 
      bg="white" 
      boxShadow="sm" 
      p={4} 
      position="fixed" 
      top={0} 
      width="100%" 
      zIndex={10}
    >
      <Flex alignItems="center">
        {/* Navigation Buttons */}
        <Button as={Link} to="/" variant="ghost" mr={4}>
          Home
        </Button>
        <Button as={Link} to="/satellites" variant="ghost" mr={4}>
          Satellites
        </Button>
        <Button as={Link} to="/groundstations" variant="ghost" mr={4}>
          Ground Stations
        </Button>
        <Button as={Link} to="/image-orders" variant="ghost" mr={4}>
          Image Orders
        </Button>
        <Button as={Link} to="/outage-requests" variant="ghost" mr={4}>
          Outage Requests
        </Button>
        <Button as={Link} to="/schedule" variant="ghost" mr={4}>
          Schedule
        </Button>
        <Spacer />
        <Box mr={4}>Role: {user.role}</Box>
        <Button variant="solid" onClick={logout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;