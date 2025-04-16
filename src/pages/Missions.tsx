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
  Portal,
  Separator,
  Stack
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import { MissionRequestType, MissionType } from "@customTypes/mission";
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { MdOutlineSatelliteAlt } from 'react-icons/md';
import { Link } from "react-router-dom";

const Missions = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MissionRequestType>();

  const [missions, setMissions] = useState<MissionType[]>([]);

  const fetchMissions = async () => {
    try {
      const res = await api.get<MissionType[]>("/mission");
      setMissions(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch missions", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const createMission = async (data: MissionRequestType) => {
    try {
      await api.post("/mission", data);
      await fetchMissions();
      toaster.create({ title: "Mission Created", type: "success" });
    } catch (e) {
      toaster.create({ title: "Mission creation failed", description: String(e), type: "error" });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <Box p={6}>
      <Stack gap="3">
        <Dialog.Root size="lg">
          <Dialog.Trigger asChild>
            <Button variant="solid">
              Create Mission
            </Button>
          </Dialog.Trigger>
          <Separator size="lg" />
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Create Mission</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <form onSubmit={handleSubmit(createMission)}>
                    <Stack gap="4" align="flex-start">
                      <Field.Root>
                        <Field.Label>Name</Field.Label>
                        <Input {...register("mission_name")} />
                        <Field.ErrorText>{errors.mission_name?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Start</Field.Label>
                        <Input {...register("mission_start")} type="datetime-local" />
                        <Field.ErrorText>{errors.mission_start?.message}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>End</Field.Label>
                        <Input {...register("mission_end")} type="datetime-local" />
                        <Field.ErrorText>{errors.mission_end?.message}</Field.ErrorText>
                      </Field.Root>
                      <Dialog.ActionTrigger>
                        <Button type="submit">Create</Button>
                      </Dialog.ActionTrigger>
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
          {missions.map((mission, index) => (
            <Card.Root key={index} flexDirection="row">
              <Box alignContent="center" justifyContent="center" padding="5">
                <Icon size="2xl" objectFit="cover">
                  <MdOutlineSatelliteAlt />
                </Icon>
              </Box>
              <Box>
                <Card.Body>
                  {/* <Card.Title>{mission.mission_name}</Card.Title> */}
                  <Card.Title>
                    <Link to={`/missions/${mission.id}`}>
                      {mission.mission_name}
                    </Link>
                  </Card.Title>
                  <Box>
                    <DataList.Root orientation="horizontal">
                      <DataList.Item>
                        <DataList.ItemLabel>Start</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {new Intl.DateTimeFormat("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }).format(new Date(mission.mission_start))}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>End</DataList.ItemLabel>
                        <DataList.ItemValue>
                          {new Intl.DateTimeFormat("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }).format(new Date(mission.mission_end))}
                        </DataList.ItemValue>
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

export default Missions;
