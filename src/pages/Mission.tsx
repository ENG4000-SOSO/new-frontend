import {
  Box,
  Button,
  ButtonGroup,
  CheckboxCard,
  CheckboxGroup,
  Text,
  Field,
  Heading,
  HStack,
  Input,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Steps,
  Table,
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import { MissionType } from "@customTypes/mission";
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { SatelliteType } from "@customTypes/satellite";
import { GroundStationType } from "@customTypes/ground_station";
import { OrderRequestType, OrderType } from "@customTypes/order";
import { useForm } from "react-hook-form";
import OrderCreationDialog from "@components/OrderCreationDialog";

const Mission = () => {

  const { id } = useParams();

  if (!id) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderRequestType>();

  const [mission, setMission] = useState<MissionType | null>(null);
  const [satellites, setSatellites] = useState<SatelliteType[]>([]);
  const [groundStations, setGroundStations] = useState<GroundStationType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const [selectedSatelliteIDs, setSelectedSatelliteIDs] = useState<number[]>([]);
  const [selectedGroundStationIDs, setSelectedGroundStationIDs] = useState<number[]>([]);
  const [selectedOrderIDs, setSelectedOrderIDs] = useState<number[]>([]);

  const fetchMission = async () => {
    try {
      const res = await api.get<MissionType>(`/mission/${id}`);
      setMission(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch mission", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const fetchSatellites = async () => {
    try {
      const res = await api.get<SatelliteType[]>("/assets/satellites");
      setSatellites(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch satellites", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const fetchGroundStations = async () => {
    try {
      const res = await api.get<GroundStationType[]>("/assets/ground_stations");
      setGroundStations(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch ground stations", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get<OrderType[]>(`/imaging/mission/${id}/orders`);
      setOrders(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch orders", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const createOrder = async (data: OrderRequestType) => {
    try {
      await api.post("/imaging/orders/create", data);
      await fetchOrders();
      toaster.create({ title: "Order Created", type: "success" });
    } catch (e) {
      toaster.create({ title: "Order creation failed", description: String(e), type: "error" });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMission();
    fetchSatellites();
    fetchGroundStations()
    fetchOrders();
  }, []);

  const handleSatelliteSelection = (satellite_id: number, select: boolean) => {
    setSelectedSatelliteIDs((prev) => {
      if (select) {
        return [...prev, satellite_id];
      } else {
        return prev.filter((id) => id != satellite_id);
      }
    });
  };

  const handleGroundStationSelection = (ground_station_id: number, select: boolean) => {
    setSelectedGroundStationIDs((prev) => {
      if (select) {
        return [...prev, ground_station_id];
      } else {
        return prev.filter((id) => id != ground_station_id);
      }
    });
  };

  const handleOrderSelection = (order_id: number, select: boolean) => {
    setSelectedOrderIDs((prev) => {
      if (select) {
        return [...prev, order_id];
      } else {
        return prev.filter((id) => id != order_id);
      }
    });
  };

  if (!mission) {
    return (
      <Box p={6}>
        <Stack gap={2}>
          <HStack width="full">
            <SkeletonCircle size="10" />
            <SkeletonText noOfLines={2} />
          </HStack>
          <Skeleton height="200px" />
        </Stack>
      </Box>
    );
  }

  return (
    <Stack p={6}>
      <Heading size="5xl">{mission.mission_name}</Heading>
      <Heading size="3xl">Past Schedules</Heading>
      <Heading size="3xl">Create Schedule</Heading>
      <Heading size="3xl">Image Orders</Heading>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Longitude</Table.ColumnHeader>
            <Table.ColumnHeader>Latitude</Table.ColumnHeader>
            <Table.ColumnHeader>Start</Table.ColumnHeader>
            <Table.ColumnHeader>End</Table.ColumnHeader>
            <Table.ColumnHeader>Delivery</Table.ColumnHeader>
            <Table.ColumnHeader>Priority</Table.ColumnHeader>
            <Table.ColumnHeader>Resolution</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map((order, index) => (
            <Table.Row key={index}>
            <Table.Cell>{order.image_name}</Table.Cell>
            <Table.Cell>{order.longitude}</Table.Cell>
            <Table.Cell>{order.latitude}</Table.Cell>
            <Table.Cell>{order.image_start_time}</Table.Cell>
            <Table.Cell>{order.image_end_time}</Table.Cell>
            <Table.Cell>{order.delivery_time}</Table.Cell>
            <Table.Cell>{order.priority}</Table.Cell>
            <Table.Cell>{order.image_type}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <OrderCreationDialog missionId={id} fetchOrders={fetchOrders} />
      <Heading size="3xl">Generate Schedule</Heading>
      <Steps.Root orientation="vertical" count={4}>
        <Steps.List>
          <Steps.Item index={0} title="Choose Satellites">
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Choose Satellites</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={1} title="Choose Ground Stations">
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Choose Ground Stations</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={2} title="Create and Choose Image Orders">
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Choose Create and Choose Image Orders</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={3} title="Review Parameters and Generate Schedule">
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>Review Parameters and Generate Schedule</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        </Steps.List>
        <Steps.Content index={0}>
          First, choose which satellites to include in the schedule.
          <CheckboxGroup>
            <Stack gap="5">
              {satellites.map((satellite, index) => (
                <CheckboxCard.Root
                  key={index}
                  value={String(satellite.id)}
                  flexBasis="content"
                  onCheckedChange={
                    ({ checked }) => handleOrderSelection(satellite.id, Boolean(checked))
                  }
                >
                  <CheckboxCard.HiddenInput />
                  <CheckboxCard.Control flexBasis="content">
                    <CheckboxCard.Content flexBasis="content" width="100px">
                      <CheckboxCard.Label>
                        {satellite.satellite_name}
                      </CheckboxCard.Label>
                    </CheckboxCard.Content>
                    <CheckboxCard.Indicator />
                  </CheckboxCard.Control>
                </CheckboxCard.Root>
              ))}
            </Stack>
          </CheckboxGroup>
        </Steps.Content>
        <Steps.Content index={1}>
          Next, choose ground stations.
          <CheckboxGroup>
            <Stack gap="5">
              {groundStations.map((groundStation, index) => (
                <CheckboxCard.Root
                  key={index}
                  value={String(groundStation.id)}
                  width="max-content"
                  onCheckedChange={
                    ({ checked }) => handleGroundStationSelection(groundStation.id, Boolean(checked))
                  }
                >
                  <CheckboxCard.HiddenInput />
                  <CheckboxCard.Control>
                    <CheckboxCard.Content>
                      <CheckboxCard.Label>
                        {groundStation.ground_station_name}
                      </CheckboxCard.Label>
                    </CheckboxCard.Content>
                    <CheckboxCard.Indicator />
                  </CheckboxCard.Control>
                </CheckboxCard.Root>
              ))}
            </Stack>
          </CheckboxGroup>
        </Steps.Content>
        <Steps.Content index={2}>
          <Stack gap="5">
            {orders.map((order, index) => (
              <CheckboxCard.Root
                key={index}
                value={String(order.id)}
                width="max-content"
                onCheckedChange={
                  ({ checked }) => handleSatelliteSelection(order.id, Boolean(checked))
                }
              >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control>
                  <CheckboxCard.Content>
                    <CheckboxCard.Label>
                      {order.image_name}
                    </CheckboxCard.Label>
                  </CheckboxCard.Content>
                  <CheckboxCard.Indicator />
                </CheckboxCard.Control>
              </CheckboxCard.Root>
            ))}
          </Stack>
        </Steps.Content>
        <Steps.Content index={3}>
          <Table.Root></Table.Root>
        </Steps.Content>
        <Steps.CompletedContent>
          All steps are complete!
        </Steps.CompletedContent>
        <ButtonGroup size="sm" variant="outline">
          <Steps.PrevTrigger asChild>
            <Button>Prev</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button>Next</Button>
          </Steps.NextTrigger>
        </ButtonGroup>
      </Steps.Root>
    </Stack>
  );
};

export default Mission;
