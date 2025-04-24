import {
  Box,
  Button,
  Card,
  CloseButton,
  DataList,
  Dialog,
  Field,
  Icon,
  Input,
  // NumberInput,
  Portal,
  Separator,
  Stack
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { GrSatellite } from 'react-icons/gr';
import { GroundStationType, GroundStationRequestType } from "@customTypes/ground_station";

const GroundStations = () => {

  const {
    // control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroundStationRequestType>();

  const [groundStations, setGroundStations] = useState<GroundStationType[]>([]);

  const fetchGroundStations = async () => {
    try {
      const res = await api.get<GroundStationType[]>("/assets/ground_stations");
      setGroundStations(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch ground stations", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const createGroundStation = async (data: GroundStationRequestType) => {
    try {
      await api.post("/assets/groundstations/create", data);
      await fetchGroundStations();
      toaster.create({ title: "Ground station created", type: "success" });
    } catch (e) {
      toaster.create({ title: "Ground station creation failed", description: String(e), type: "error" });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchGroundStations();
  }, []);

  return (
    <Box p={6}>
      <Stack gap="3">
        <Dialog.Root size="lg">
          <Dialog.Trigger asChild>
            <Button variant="solid">
              Create Ground Station
            </Button>
          </Dialog.Trigger>
          <Separator size="lg" />
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Ground Station</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <form onSubmit={handleSubmit(createGroundStation)}>
                    <Stack gap="4" align="flex-start">
                      <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input {...register("ground_station_name")} />
                        <Field.ErrorText>{errors.ground_station_name?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Latitude</Field.Label>
                        <Input {...register("latitude")} type="number" />
                        <Field.ErrorText>{errors.latitude?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Longitude</Field.Label>
                        <Input {...register("longitude")} type="number" />
                        <Field.ErrorText>{errors.longitude?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Elevation</Field.Label>
                        <Input {...register("elevation")} type="number" />
                        <Field.ErrorText>{errors.elevation?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Uplink Rate</Field.Label>
                        <Input {...register("uplink_rate")} type="number" />
                        <Field.ErrorText>{errors.uplink_rate?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Downlink Rate</Field.Label>
                        <Input {...register("downlink_rate")} type="number" />
                        <Field.ErrorText>{errors.downlink_rate?.message}</Field.ErrorText>
                      </Field.Root>
                      <Button type="submit">Create</Button>
                    </Stack>
                  </form>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        <Stack gap={5}>
          {groundStations.map((ground_station, index) => (
            <Card.Root key={index} flexDirection="row">
              <Box alignContent="center" justifyContent="center" padding="5">
                <Icon size="2xl" objectFit="cover">
                  <GrSatellite />
                </Icon>
              </Box>
              <Box>
                <Card.Body>
                  <Card.Title>{ground_station.ground_station_name}</Card.Title>
                  <Box>
                    <DataList.Root orientation="horizontal">
                      <DataList.Item>
                        <DataList.ItemLabel>Latitude</DataList.ItemLabel>
                        <DataList.ItemValue>{ground_station.latitude}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Longitude</DataList.ItemLabel>
                        <DataList.ItemValue>{ground_station.longitude}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Elevation</DataList.ItemLabel>
                        <DataList.ItemValue>{ground_station.elevation}</DataList.ItemValue>
                      </DataList.Item>
                    </DataList.Root>
                  </Box>
                </Card.Body>
              </Box>
            </Card.Root>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default GroundStations;
