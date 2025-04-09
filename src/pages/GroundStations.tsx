import { Box, Button, CloseButton, Heading, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

type GroundStationFormData = {
  ground_station_name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  station_mask: number;
  uplink_rate: number;
  downlink_rate: number;
  under_outage: boolean;
};

interface GroundStation {
  id: number;
  ground_station_name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  station_mask: number;
  uplink_rate: number;
  downlink_rate: number;
  under_outage: boolean;
}

const GroundStations = () => {
  // Similar logic as Satellites.tsx
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GroundStationFormData>();
  const [stations, setStations] = useState<GroundStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ground-stations');
      setStations(res.data.ground_stations);
    } catch (error) {
      console.error("Failed to fetch ground stations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const onSubmit = async (data: GroundStationFormData) => {
    try {
      const res = await api.post('/ground-stations', data);
      alert("Ground station created successfully.");
      reset();
      fetchStations();
      setShowForm(false);
    } catch (error) {
      alert("Failed to create ground station.");
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Ground Stations</Heading>
      <Button onClick={() => setShowForm(!showForm)} mb={4} colorScheme="blue">
        {showForm ? "Hide Ground Station Form" : "Add Ground Station"}
      </Button>
      {showForm && (
        <Box mb={8} p={4} borderWidth="1px" borderRadius="md">
          <Heading size="sm" mb={2}>Create Ground Station</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="4" align="flex-start">
              {/* Build input fields similar to the satellite form */}
              <Input {...register("ground_station_name", { required: "Ground station name is required" })} placeholder="Enter ground station name" />
              {/* Add additional inputs for latitude, longitude, etc. */}
              <Button type="submit" colorScheme="blue">Create Ground Station</Button>
            </Stack>
          </form>
          <CloseButton size="sm" mt={2} onClick={() => setShowForm(false)} />
        </Box>
      )}
      {loading ? (
        <Spinner />
      ) : stations.length === 0 ? (
        <Text>No ground stations found.</Text>
      ) : (
        // Display the stations in a table or list format
        <Box mt={4} p={4} borderWidth="1px" borderRadius="md">  
          <Heading size="sm" mb={2}>Ground Stations List</Heading>
          {/* Example table structure */}
          <Box as="thead">
            <Box as="tr">
              <Box as="th">Name</Box>
              <Box as="th">Latitude</Box>
              <Box as="th">Longitude</Box>
              <Box as="th">Elevation</Box>
              <Box as="th">Station Mask</Box>
              <Box as="th">Uplink Rate</Box>
              <Box as="th">Downlink Rate</Box>
              <Box as="th">Under Outage</Box>
            </Box>
          </Box>
          {/* Map through stations to create rows */}
          {stations.map(station => (
            <Box as="tr" key={station.id}>
              <Box as="td">{station.ground_station_name}</Box>
              <Box as="td">{station.latitude}</Box>
              <Box as="td">{station.longitude}</Box>
              <Box as="td">{station.elevation}</Box>
              <Box as="td">{station.station_mask}</Box>
              <Box as="td">{station.uplink_rate}</Box>
              <Box as="td">{station.downlink_rate}</Box>
              <Box as="td">{station.under_outage ? "Yes" : "No"}</Box>
            </Box>
          ))}
          {/* Add a footer or additional rows if needed */}
          <Box as="tfoot">
            <Box as="tr">
              <Box as="td" sx={{ colspan: 8 }}>
                {/* Footer content if needed */}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GroundStations;