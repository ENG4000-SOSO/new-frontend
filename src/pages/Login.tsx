import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import { useAuth } from '@context/auth/auth_context';
import api from "@utils/api";
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
  username: string;
  password: string;
};

const Register: React.FC = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post("/auth/token", data);
      const body = await res.data;
      login({"username": data.username, token: body.token});
      navigate("/");
    } catch (e) {
      toaster.create({ title: "Login Failed", description: String(e), type: "error" });
      console.log(e);
    }
  };

  return (
    <Box p={6}>
      <Stack gap="4">
        <Heading size="3xl">
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="4" align="flex-start">
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input {...register("username")} />
              <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
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
          Don't have an account?{" "}
          <Link
            href="/register"
            variant="underline"
            colorPalette="teal"
          >
            Create an account
          </Link>{" "}
          instead.
        </Text>
      </Stack>
    </Box>
  );
};

export default Register;
