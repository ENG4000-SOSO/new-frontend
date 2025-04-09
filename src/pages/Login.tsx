import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { useAuth } from "@context/auth_context";
import api from "@utils/api";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

type LoginFormData = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Prepare form data in URL-encoded format
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const res = await api.post("/auth/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const { access_token } = res.data;
      login({ username: data.username, token: access_token });
      toaster.create({
        title: "Login Successful",
        description: "Welcome back!",
        type: "success",
      });
      navigate("/");
    } catch (e: any) {
      toaster.create({
        title: "Login Failed",
        description: String(e),
        type: "error",
      });
      console.error(e);
    }
  };


  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      p={4}
    >
      <Box width="400px" bg="white" p={8} borderRadius="md" boxShadow="md">
        <Heading textAlign="center" mb={6}>
          Log in
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4}>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter username"
                {...register("username", { required: "Username is required" })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              Log in
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#319795", textDecoration: "underline" }}>
            Create one
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;