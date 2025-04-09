import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import { useAuth } from "@context/auth_context";
import api from "@utils/api";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";

// Define the satellite type
interface Satellite {
  id: number;
  satellite_name: string;
  storage_capacity: number;
  power_capacity: number;
  fov_min: number;
  fov_max: number;
  is_illuminated: boolean;
  under_outage: boolean;
}

// Define the form data type for creating a satellite
interface SatelliteFormData {
  satellite_name: string;
  storage_capacity: number;
  power_capacity: number;
  fov_min: number;
  fov_max: number;
  is_illuminated: boolean;
  under_outage: boolean;
}

// LinkButton to wrap react-router-dom's RouterLink with Chakra UI's Button
interface LinkButtonProps {
  to: string;
  children: React.ReactNode;
  [x: string]: any;
}
const LinkButton: React.FC<LinkButtonProps> = ({ to, children, ...rest }) => (
  <Button as={RouterLink as any} to={to} {...rest}>
    {children}
  </Button>
);

// tooltip styling
const tooltipProps = {
  hasArrow: true,
  bg: "white",
  color: "black",
  fontSize: "sm",
  px: 3,
  py: 2,
  borderRadius: "md",
  boxShadow: "lg",
  border: "1px solid",
  borderColor: "gray.200",
};

const Satellites: React.FC = () => {
  const { user } = useAuth();
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SatelliteFormData>();

  // Fetch satellites (dummy data for now)
  useEffect(() => {
    const fetchSatellites = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with a real API call when available:
        const dummySatellites: Satellite[] = [
          {
            id: 1,
            satellite_name: "Hubble",
            storage_capacity: 500,
            power_capacity: 1200,
            fov_min: 60,
            fov_max: 120,
            is_illuminated: false,
            under_outage: false,
          },
        ];
        setSatellites(dummySatellites);
      } catch (err: any) {
        console.error("Failed to fetch satellites", err);
        setError("Failed to fetch satellites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSatellites();
  }, []);

  // Handle the satellite creation form submission
  const onSubmit = async (data: SatelliteFormData) => {
    try {
      const res = await api.post("/satellites", data);
      setSatellites((prev) => [...prev, res.data]);
      reset();
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create satellite", err);
    }
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Heading mb={4}>Satellites</Heading>

      {user && (user.role === "admin" || user.role === "operator") && (
        <Button mb={4} colorScheme="blue" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add Satellite"}
        </Button>
      )}

      {showForm && (
        <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="white">
          <Heading size="sm" mb={4}>
            Create New Satellite
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
              {/* Satellite Name Field */}
              <FormControl isInvalid={!!errors.satellite_name}>
                <HStack>
                  <FormLabel>Satellite Name</FormLabel>
                  <Tooltip label="Enter a unique name for the satellite" {...tooltipProps}>
                    <span>
                      <Icon as={FiInfo} color="gray.500" />
                    </span>
                  </Tooltip>
                </HStack>
                <Input
                  type="text"
                  placeholder="Enter satellite name"
                  {...register("satellite_name", { required: "Satellite name is required" })}
                />
                <FormErrorMessage>{errors.satellite_name?.message}</FormErrorMessage>
              </FormControl>

              {/* Storage Capacity Field */}
              <FormControl isInvalid={!!errors.storage_capacity}>
                <HStack>
                  <FormLabel>Storage Capacity (GB)</FormLabel>
                  <Tooltip label="Available onboard memory in gigabytes" {...tooltipProps}>
                    <span>
                      <Icon as={FiInfo} color="gray.500" />
                    </span>
                  </Tooltip>
                </HStack>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  {...register("storage_capacity", { required: "Storage capacity is required" })}
                />
                <FormErrorMessage>{errors.storage_capacity?.message}</FormErrorMessage>
              </FormControl>

              {/* Power Capacity Field */}
              <FormControl isInvalid={!!errors.power_capacity}>
                <HStack>
                  <FormLabel>Power Capacity (W)</FormLabel>
                  <Tooltip label="Power capacity in watts" {...tooltipProps}>
                    <span>
                      <Icon as={FiInfo} color="gray.500" />
                    </span>
                  </Tooltip>
                </HStack>
                <Input
                  type="number"
                  placeholder="e.g. 1200"
                  {...register("power_capacity", { required: "Power capacity is required" })}
                />
                <FormErrorMessage>{errors.power_capacity?.message}</FormErrorMessage>
              </FormControl>

              {/* FOV Minimum Field */}
              <FormControl isInvalid={!!errors.fov_min}>
                <HStack>
                  <FormLabel>FOV Minimum</FormLabel>
                  <Tooltip label="Enter the minimum field-of-view angle (in degrees)" {...tooltipProps}>
                    <span>
                      <Icon as={FiInfo} color="gray.500" />
                    </span>
                  </Tooltip>
                </HStack>
                <Input
                  type="number"
                  placeholder="e.g. 60"
                  {...register("fov_min", { required: "Minimum FOV is required" })}
                />
                <FormErrorMessage>{errors.fov_min?.message}</FormErrorMessage>
              </FormControl>

              {/* FOV Maximum Field */}
              <FormControl isInvalid={!!errors.fov_max}>
                <HStack>
                  <FormLabel>FOV Maximum</FormLabel>
                  <Tooltip label="Enter the maximum field-of-view angle (in degrees)" {...tooltipProps}>
                    <span>
                      <Icon as={FiInfo} color="gray.500" />
                    </span>
                  </Tooltip>
                </HStack>
                <Input
                  type="number"
                  placeholder="e.g. 120"
                  {...register("fov_max", { required: "Maximum FOV is required" })}
                />
                <FormErrorMessage>{errors.fov_max?.message}</FormErrorMessage>
              </FormControl>

              {/* Boolean Field: Is Illuminated */}
              <FormControl>
                <HStack>
                  <Checkbox {...register("is_illuminated")} colorScheme="teal">
                    Is currently illuminated
                  </Checkbox>
                  <Tooltip label="Select this if the satellite is currently illuminated" {...tooltipProps}>
                    <span>
                      <Icon as={FiInfo} color="gray.500" />
                    </span>
                  </Tooltip>
                </HStack>
              </FormControl>

              {/* Boolean Field: Under Outage */}
              <FormControl>
                <HStack>
                  <Checkbox {...register("under_outage")} colorScheme="red">
                    Is under outage
                  </Checkbox>
                  <Tooltip label="Select this if the satellite is currently under outage" {...tooltipProps}>
                    <span>
                      <Icon as={FiInfo} color="gray.500" />
                    </span>
                  </Tooltip>
                </HStack>
              </FormControl>

              <Button type="submit" colorScheme="teal">
                Create Satellite
              </Button>
            </Stack>
          </form>
        </Box>
      )}

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
          {satellites.length === 0 ? (
            <Text>No satellites available.</Text>
          ) : (
            <Stack gap={4}>
              {satellites.map((sat) => (
                <Flex
                  key={sat.id}
                  justify="space-between"
                  align="center"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  p={2}
                >
                  <Box>
                    <Heading size="sm">{sat.satellite_name}</Heading>
                    <Text fontSize="xs" color="gray.600">
                      Storage: {sat.storage_capacity} GB • Power: {sat.power_capacity} W<br />
                      FOV: {sat.fov_min}–{sat.fov_max} • Illuminated:{" "}
                      {sat.is_illuminated ? "Yes" : "No"}
                    </Text>
                  </Box>
                  <LinkButton to={`/satellites/${sat.id}`} size="sm" colorScheme="blue">
                    Details
                  </LinkButton>
                </Flex>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Satellites;