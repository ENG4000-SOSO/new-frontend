import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
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
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post("/auth", data);
      toaster.create({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
        type: "success",
      });
      navigate("/login");
    } catch (e: any) {
      // Extract error detail if available
      const errorMessage = e.response?.data?.detail || "Registration failed. Please try again.";
      toaster.create({
        title: "Register Failed",
        description: errorMessage,
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
          Create Account
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
            <FormControl isInvalid={!!errors.first_name}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter first name"
                {...register("first_name", { required: "First name is required" })}
              />
              <FormErrorMessage>
                {errors.first_name && errors.first_name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.last_name}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter last name"
                {...register("last_name", { required: "Last name is required" })}
              />
              <FormErrorMessage>
                {errors.last_name && errors.last_name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
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