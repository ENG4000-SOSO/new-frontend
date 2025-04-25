import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { useAuth } from "@context/auth/auth_context";
import { useTheme } from "@context/theme/theme_context";
import api from "@utils/api";
import React from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";

type LoginFormData = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme().theme;
  const cardBg = theme === "light" ? "white" : "gray.800";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const formData = new URLSearchParams({
        grant_type: "password",
        username: data.username,
        password: data.password,
      });

      const res = await api.post("/auth/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      login({ username: data.username, token: res.data.access_token });
      toaster.create({
        title: "Logged In",
        description: "Welcome back!",
        type: "success",
      });
      navigate("/");
    } catch (e: any) {
      if (e.response?.status === 401) {
        setError("password", {
          type: "manual",
          message: "Username or password is incorrect",
        });
      } else {
        toaster.create({
          title: "Login Failed",
          description: e.message || String(e),
          type: "error",
        });
      }
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" p={4} bg="transparent">
      <Box bg={cardBg} p={8} rounded="md" shadow="md" maxW="md" w="full">
        <Heading mb={6} textAlign="center">
          Log In
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" /> : "Log In"}
            </Button>
          </Stack>
        </form>

        <Text mt={4} textAlign="center" fontSize="sm">
          Don’t have an account?{" "}
          <ChakraLink
            as={RouterLink}
            to="/register"
            color="teal.500"
            fontWeight="medium"
          >
            Sign up
          </ChakraLink>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;