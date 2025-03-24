import React, { useState } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  For,
  HStack,
  Field,
  Input,
  Stack,
  Portal
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"

type FormData = {
  satellite_name: string;
  tle_line1: string;
  tle_line2: string;
};

const Satellites = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Box p={6}>
      <Dialog.Root size="lg">
        <Dialog.Trigger asChild>
          <Button variant="outline">
            Open
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Create Satellite</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <Button>Create</Button>
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
    </Box>
  );
};

export default Satellites;
