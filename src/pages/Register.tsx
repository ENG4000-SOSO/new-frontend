// src/pages/Register.tsx

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
import { useTheme } from "@context/theme/theme_context";
import api from "@utils/api";
import React from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";

type RegisterFormData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme().theme;
  const cardBg = theme === "light" ? "white" : "gray.800";

  // 👇 include setError here
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    // client‐side confirm password
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      // strip off confirmPassword before sending
      const { confirmPassword, ...payload } = data;
      const res = await api.post("/auth/", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201) {
        toaster.create({
          title: "Account Created",
          description: "Please log in with your new credentials",
          type: "success",
        });
        navigate("/login");
        return;
      }

      throw new Error(`Unexpected status ${res.status}`);
    } catch (e: any) {
      // handle duplicate‐username or duplicate‐email from backend (400)
      if (e.response?.status === 400) {
        const msg = e.response.data.detail ?? "Registration failed";
        if (msg.toLowerCase().includes("username")) {
          setError("username", { type: "manual", message: msg });
        } else if (msg.toLowerCase().includes("email")) {
          setError("email", { type: "manual", message: msg });
        } else {
          // fallback toast
          toaster.create({
            title: "Registration failed",
            description: msg,
            type: "error",
          });
        }
      } else {
        // other errors
        toaster.create({
          title: "Registration failed",
          description: e.response?.data?.detail || e.message || String(e),
          type: "error",
        });
      }
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" p={4} bg="transparent">
      <Box bg={cardBg} p={8} rounded="md" shadow="md" maxW="md" w="full">
        <Heading mb={6} textAlign="center">
          Create Account
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.first_name}>
              <FormLabel>First Name</FormLabel>
              <Input
                placeholder="Enter first name"
                {...register("first_name", {
                  required: "First name is required",
                })}
              />
              <FormErrorMessage>
                {errors.first_name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.last_name}>
              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder="Enter last name"
                {...register("last_name", {
                  required: "Last name is required",
                })}
              />
              <FormErrorMessage>
                {errors.last_name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Must be at least 6 characters",
                  },
                })}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Re-enter password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === password || "Passwords do not match",
                })}
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" /> : "Create Account"}
            </Button>
          </Stack>
        </form>

        <Text mt={4} textAlign="center" fontSize="sm">
          Already have an account?{" "}
          <ChakraLink
            as={RouterLink}
            to="/login"
            color="teal.500"
            fontWeight="medium"
          >
            Log in
          </ChakraLink>
        </Text>
      </Box>
    </Flex>
  );
};

export default Register;