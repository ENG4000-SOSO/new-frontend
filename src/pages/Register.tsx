import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import api from "@utils/api";
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

type RegisterFormData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const Register: React.FC = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = api.post("/auth", data);
      console.log(await (await res).data);
      navigate("/login");
    } catch (e) {
      toaster.create({title: "Register Failed", description: String(e), type: "error"});
      console.log(e);
    }
  };

  return (
    <Box p={6}>
      <Stack gap="4">
        <Heading size="3xl">
          Create Account
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="4" align="flex-start">
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input {...register("username")} />
              <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root>
              <Field.Label>First Name</Field.Label>
              <Input {...register("first_name")} />
              <Field.ErrorText>{errors.first_name?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root>
              <Field.Label>Last Name</Field.Label>
              <Input {...register("last_name")} />
              <Field.ErrorText>{errors.last_name?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input {...register("email")} />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input type="password" {...register("password")} />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>
            <Button colorPalette="teal" variant="surface" type="submit">Create</Button>
          </Stack>
        </form>
        <Text>
          Already have an account?{" "}
          <Link
            href="/login"
            variant="underline"
            colorPalette="teal"
          >
            Log in
          </Link>{" "}
          instead.
        </Text>
      </Stack>
    </Box>
  );
};

export default Register;
