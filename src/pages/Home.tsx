import { Alert, AlertIcon } from "@chakra-ui/alert";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react";
import { useAuth } from "@context/auth/auth_context";
import React, { useEffect, useState } from "react";
import { FaBuilding, FaExclamationTriangle, FaImage, FaSatellite } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

// Interface defining the dashboard data shape
interface DashboardData {
  satellitesCount: number;
  groundStationsCount: number;
  imageOrdersCount: number;
  outageRequestsCount: number;
}

// Divider using a Box component
const DividerComponent: React.FC = () => (
  <Box height="1px" bg="gray.200" my={6} />
);

// LinkButton to wrap react-router-dom's Link with Chakra UI Button
interface LinkButtonProps {
  to: string;
  children: React.ReactNode;
  colorScheme?: string;
}
const LinkButton: React.FC<LinkButtonProps> = ({ to, children, colorScheme = "blue", ...rest }) => (
  <Button as={RouterLink as any} to={to} colorScheme={colorScheme} {...rest}>
    {children}
  </Button>
);

const Home: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    satellitesCount: 0,
    groundStationsCount: 0,
    imageOrdersCount: 0,
    outageRequestsCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy data fetch since the backend for dashboard is not implemented yet
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate a network request
        const dummyData = {
          satellitesCount: 5,
          groundStationsCount: 3,
          imageOrdersCount: 10,
          outageRequestsCount: 2,
        };
        setDashboardData(dummyData);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data", err);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Reusable MetricCard component for summary display
  const MetricCard: React.FC<{ label: string; value: number; icon: React.ElementType; }> = ({ label, value, icon }) => (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
      bg="white"
      _hover={{ boxShadow: "md" }}
    >
      <Flex alignItems="center">
        <Icon as={icon} w={6} h={6} mr={2} color="teal.500" />
        <Heading size="md" mb={2}>
          {value}
        </Heading>
      </Flex>
      <Text fontSize="sm" color="gray.600">
        {label}
      </Text>
    </Box>
  );

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Heading mb={4}>Welcome to SOSO Satellite Operations System</Heading>
      {user && (
        <Text fontSize="lg" mb={6}>
          Hello, {user.username}
        </Text>
      )}

      {/* Loading state */}
      {loading && <Spinner size="xl" />}

      {/* Error state */}
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Render dashboard content only when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Summary Cards using gap instead of spacing */}
          <SimpleGrid columns={[1, 2, 4]} gap={6} mb={8}>
            <MetricCard label="Satellites" value={dashboardData.satellitesCount} icon={FaSatellite} />
            <MetricCard label="Ground Stations" value={dashboardData.groundStationsCount} icon={FaBuilding} />
            <MetricCard label="Image Orders" value={dashboardData.imageOrdersCount} icon={FaImage} />
            <MetricCard label="Outage Requests" value={dashboardData.outageRequestsCount} icon={FaExclamationTriangle} />
          </SimpleGrid>

          <DividerComponent />

          {/* Quick Navigation Buttons using the custom LinkButton */}
          <Stack direction={["column", "row"]} gap={4} mb={8}>
            <LinkButton to="/satellites">Manage Satellites</LinkButton>
            <LinkButton to="/ground-stations">Manage Ground Stations</LinkButton>
            <LinkButton to="/image-orders">View Image Orders</LinkButton>
            <LinkButton to="/outage-requests">View Outage Requests</LinkButton>
            <LinkButton to="/schedule">Schedule</LinkButton>
          </Stack>

          <DividerComponent />

          {/* Recent Activity Section */}
          <Box>
            <Heading size="md" mb={2}>Recent Activity</Heading>
            <Text color="gray.600">
              Display recent system events, alerts, or notifications here...
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;