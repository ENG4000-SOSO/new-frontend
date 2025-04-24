import {
  Box,
  Button,
  ButtonGroup,
  Text,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Steps,
  StepsChangeDetails,
  Spinner,
  Link,
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import { MissionType } from "@customTypes/mission";
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { SatelliteType } from "@customTypes/satellite";
import { GroundStationType } from "@customTypes/ground_station";
import { OrderType } from "@customTypes/order";
import OrderCreationDialog from "@components/OrderCreationDialog";
import SatelliteTable from "@components/SatelliteTable";
import OrderTable from "@components/OrderTable";
import GroundStationTable from "@components/GroundStationTable";
import { ScheduleRequestType, GenerateScheduleRequestType, GenerateScheduleResponseType } from "@customTypes/schedule";

const Mission = () => {

  const { id } = useParams();

  if (!id) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  const [mission, setMission] = useState<MissionType | null>(null);
  const [satellites, setSatellites] = useState<SatelliteType[]>([]);
  const [groundStations, setGroundStations] = useState<GroundStationType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const [schedules, setSchedules] = useState<ScheduleRequestType[]>([]);
  const [newSchedule, setNewSchedule] = useState<ScheduleRequestType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedSatelliteIDs, setSelectedSatelliteIDs] = useState<number[]>([]);
  const [selectedGroundStationIDs, setSelectedGroundStationIDs] = useState<number[]>([]);
  const [selectedOrderIDs, setSelectedOrderIDs] = useState<number[]>([]);

  const [step, setStep] = useState<number>(0);
  const numberOfSteps = 4;

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

  const fetchSchedulesByIds = async (ids: string[]) => {
    if (ids.length == 0) {
      return[];
    }

    const schedule_requests = await Promise.all(
      ids.map(id =>
        api.get<ScheduleRequestType>(`/schedule/${id}`)
          .then(res => res.data)
          .catch(err => {
            console.error(`Failed to fetch schedule ${id}: ${err}`);
            return null;
          })
      )
    );

    return schedule_requests
      .filter(schedule_request => schedule_request != null)
      .filter(schedule_request =>
        !schedule_request.status
        || schedule_request.status.toLowerCase() != 'completed');
  };

  const fetchSchedules = async () => {
    try {
      const res = await api.get<ScheduleRequestType[]>(`/schedule/mission/${id}`);
      const schedule_requests = res.data;

      const completed_schedule_requests = schedule_requests
        .filter(schedule_request =>
          !schedule_request.status
          || schedule_request.status.toLowerCase() == 'completed');

      const incomplete_schedule_request_ids = schedule_requests
        .filter(schedule_request =>
          !schedule_request.status
          || schedule_request.status.toLowerCase() != 'completed')
        .map(schedule_request => schedule_request.id);

      const just_completed_schedule_requests = await fetchSchedulesByIds(incomplete_schedule_request_ids);

      setSchedules(completed_schedule_requests.concat(just_completed_schedule_requests));
    } catch (e) {
      toaster.create({ title: "Failed to fetch orders", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const startPollingForScheduleCompletion = async (jobId: string) => {
    console.log(`Starting polling for ${jobId}`);

    const delay = 1000;

    while (true) {
      try {
        const response = await api.get<ScheduleRequestType>(`/schedule/${jobId}`);
        if (response.data.status && response.data.status.toLowerCase() == 'completed') {
          setLoading(false);
          setNewSchedule(response.data);
          break;
        }
      } catch (e) {
        console.error(`Error during poll attempt: ${e}`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const generateSchedule = async () => {
    try {
      const data: GenerateScheduleRequestType = {
        mission_id: parseInt(id),
        satellite_ids: selectedSatelliteIDs,
        ground_station_ids: selectedGroundStationIDs,
        image_request_ids: selectedOrderIDs
      };

      const res = await api.post<GenerateScheduleResponseType>(
        "/schedule/generate",
        data
      );

      setLoading(true);

      startPollingForScheduleCompletion(res.data.job_id);
    } catch (e) {
      toaster.create({ title: "Failed to generate schedule", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const changeStep = async (e: StepsChangeDetails) => {
    if (step != numberOfSteps) {
      if (e.step == numberOfSteps) {
        setStep(e.step);
        await generateSchedule();
      } else {
        setStep(e.step);
      }
    }
  };

  useEffect(() => {
    fetchMission();
    fetchSatellites();
    fetchGroundStations()
    fetchOrders();
    fetchSchedules();
  }, []);

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
        {schedules.length == 0
          ? <p>No schedules</p>
          : schedules.map((schedule, index) => (
            <div key={index}>
              <p key={index}><Link href={`/schedule/${schedule.id}`}>{schedule.id}</Link></p>
              <p>Status: {schedule.status ? schedule.status : "not started"}</p>
            </div>
          ))
        }
      <Heading size="3xl">Image Orders</Heading>
      <OrderTable orders={orders} readonly maxWidth="100%" />
      <OrderCreationDialog missionId={id} fetchOrders={fetchOrders} />
      <Heading size="3xl">Generate Schedule</Heading>
      <Steps.Root
        orientation="vertical"
        count={numberOfSteps}
        step={step}
        onStepChange={changeStep}
      >
        <Stack width="100%">
          <Stack direction="row" justifyContent="space-evenly">
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
              <SatelliteTable
                satellites={satellites}
                selectedSatelliteIDs={selectedSatelliteIDs}
                setSelectedSatelliteIDs={setSelectedSatelliteIDs}
                readonly={false}
              />
            </Steps.Content>
            <Steps.Content index={1}>
              Next, choose ground stations.
              <GroundStationTable
                groundStations={groundStations}
                selectedGroundStationIDs={selectedGroundStationIDs}
                setSelectedGroundStationIDs={setSelectedGroundStationIDs}
                readonly={false}
              />
            </Steps.Content>
            <Steps.Content index={2}>
              Orders
              <OrderTable
                orders={orders}
                selectedOrderIDs={selectedOrderIDs}
                setSelectedOrderIDs={setSelectedOrderIDs}
                readonly={false}
                maxWidth="xl"
              />
            </Steps.Content>
            <Steps.Content index={3}>
              <Text textStyle="lg">
                Satellites
              </Text>
              <SatelliteTable
                satellites={
                  satellites.filter(
                    satellite => selectedSatelliteIDs.includes(satellite.id)
                  )
                }
                readonly
              />
              <Text textStyle="lg">
                Ground Stations
              </Text>
              <GroundStationTable
                groundStations={
                  groundStations.filter(
                    groundStation => selectedGroundStationIDs.includes(groundStation.id)
                  )
                }
                readonly
              />
              <Text textStyle="lg">
                Orders
              </Text>
              <OrderTable
                orders={
                  orders.filter(
                    order => selectedOrderIDs.includes(order.id)
                  )
                }
                readonly
              />
            </Steps.Content>
            <Steps.CompletedContent>
              {loading
                ? <Spinner />
                : (newSchedule
                  ? <p>{newSchedule.id}</p>
                  : <p>nothing</p>
                )
              }
            </Steps.CompletedContent>
          </Stack>
          <ButtonGroup size="sm" variant="outline" display="flex">
            <Steps.PrevTrigger asChild flex="1">
              <Button
                disabled={step == numberOfSteps}
              >
                Prev
              </Button>
            </Steps.PrevTrigger>
            <Steps.NextTrigger asChild flex="1">
              <Button
                disabled={step == numberOfSteps}
              >
                Next
              </Button>
            </Steps.NextTrigger>
          </ButtonGroup>
        </Stack>
      </Steps.Root>
    </Stack>
  );
};

export default Mission;
