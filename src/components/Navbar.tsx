// src/components/Navbar.tsx

import {
  Box,
  Button,
  Flex,
  Icon,
  Spacer,
  Switch
} from "@chakra-ui/react";
import { useAuth } from "@context/auth/auth_context";
import { useTheme } from "@context/theme/theme_context";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, switchTheme } = useTheme();
  const location = useLocation();

  // Don’t render on login/register or if not authed
  if (!user || ["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  // Choose background based on your theme context
  const bg = theme === "light" ? "white" : "gray.900";

  return (
    <Box
      bg={bg}
      shadow="lg"
      px={6}
      py={4}
      position="fixed"
      top={0}
      width="100%"
      zIndex={10}
    >
      <Flex align="center">
        {/* Primary nav links */}
        {[
          { to: "/", label: "Home" },
          { to: "/satellites", label: "Satellites" },
          { to: "/ground-stations", label: "Ground Stations" },
          { to: "/image-orders", label: "Image Orders" },
          { to: "/outage-requests", label: "Outage Requests" },
          { to: "/schedule", label: "Schedule" },
        ].map((item) => (
          <Button
            key={item.to}
            as={Link}
            to={item.to}
            variant="ghost"
            mr={4}
          >
            {item.label}
          </Button>
        ))}

        <Spacer />

        {/* Theme toggle */}
        <Switch.Root
          colorPalette="white"
          size="lg"
          checked={theme === "dark"}
          onCheckedChange={switchTheme}
          paddingInline={10}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
            <Switch.Indicator fallback={<Icon as={FaMoon} color="black" />}>
              <Icon as={FaSun} color="black" />
            </Switch.Indicator>
          </Switch.Control>
        </Switch.Root>

        {/* Logout */}
        <Button colorScheme="teal" onClick={logout}>
          Logout
        </Button>

      </Flex>
    </Box>
  );
};

export default Navbar;