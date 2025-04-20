import {
  Box,
  Button,
  Card,
  CloseButton,
  Code,
  Dialog,
  Field,
  Icon,
  Input,
  NumberInput,
  Portal,
  Separator,
  Stack
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import { useAuth } from "@context/auth/auth_context";
import { SatelliteRequestType, SatelliteType } from "@customTypes/satellite";
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { MdOutlineSatelliteAlt } from 'react-icons/md';

const Satellites: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SatelliteRequestType>();

  const [satellites, setSatellites] = useState<SatelliteType[]>([]);

  const fetchSatellites = async () => {
    try {
      const res = await api.get<SatelliteType[]>("/assets/satellites");
      setSatellites(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch satellites", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const createSatellite = async (data: SatelliteRequestType) => {
    try {
      await api.post("/assets/satellite", data);
      await fetchSatellites();
      toaster.create({ title: "Satellite created", type: "success" });
    } catch (e) {
      toaster.create({ title: "Satellite creation failed", description: String(e), type: "error" });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchSatellites();
  }, []);

  return (
    <Box p={6}>
      <Stack gap="3">
        <Dialog.Root size="lg">
          <Dialog.Trigger asChild>
            <Button variant="solid">
              Create Satellite
            </Button>
          </Dialog.Trigger>
          <Separator size="lg" />
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Create Satellite</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <form onSubmit={handleSubmit(createSatellite)}>
                    <Stack gap="4" align="flex-start">
                      <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input {...register("satellite_name")} />
                        <Field.ErrorText>{errors.satellite_name?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>TLE Line 1</Field.Label>
                        <Input {...register("tle_line1")} />
                        <Field.ErrorText>{errors.tle_line1?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>TLE Line 2</Field.Label>
                        <Input {...register("tle_line2")} />
                        <Field.ErrorText>{errors.tle_line2?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Storage Capacity</Field.Label>
                        <Controller
                          name="storage_capacity"
                          control={control}
                          render={({ field }) => (
                            <NumberInput.Root
                              disabled={field.disabled}
                              name={field.name}
                              value={String(field.value)}
                              onValueChange={({ value }) => field.onChange(value)}
                            >
                              <NumberInput.Control />
                              <NumberInput.Input onBlur={field.onBlur} />
                            </NumberInput.Root>
                          )}
                        />
                        {/* <Input {...register("storage_capacity")} /> */}
                        <Field.ErrorText>{errors.storage_capacity?.message}</Field.ErrorText>
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
          {satellites.map((satellite, index) => (
            <Card.Root key={index} flexDirection="row">
              <Box alignContent="center" justifyContent="center" padding="5">
                <Icon size="2xl" objectFit="cover">
                  <MdOutlineSatelliteAlt />
                </Icon>
              </Box>
              <Box>
                <Card.Body>
                  <Card.Title>{satellite.satellite_name}</Card.Title>
                  <Card.Description>
                    <Code>{satellite.tle_line1}</Code>
                    <Code>{satellite.tle_line2}</Code>
                  </Card.Description>
                </Card.Body>
              </Box>
            </Card.Root>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Satellites;