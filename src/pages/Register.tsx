import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import api from "@utils/api";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
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
      } else {
        throw new Error(`Unexpected status ${res.status}`);
      }
    } catch (e: any) {
      toaster.create({
        title: "Registration failed",
        description: e.response?.data?.detail || e.message || String(e),
        type: "error",
      });
    }
  };

  const password = watch("password", "");

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
        <Text fontSize="2xl" mb={6} textAlign="center">
          Create Account
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter username"
                {...register("username", { required: "Username is required" })}
              />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.first_name}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter first name"
                {...register("first_name", {
                  required: "First name is required",
                })}
              />
              <FormErrorMessage>{errors.first_name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.last_name}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter last name"
                {...register("last_name", {
                  required: "Last name is required",
                })}
              />
              <FormErrorMessage>{errors.last_name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
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
                    message: "Password must be at least 6 characters",
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
                  validate: (value) =>
                    value === password || "Passwords do not match",
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
              Create Account
            </Button>
          </Stack>
        </form>

        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#319795", textDecoration: "underline" }}>
            Log in
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;