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

type RegisterFormData = {
  username: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const theme = useTheme().theme;
  const cardBg = theme === "light" ? "white" : "gray.800";

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        username: data.username,
        password: data.password,
      });

      registerUser({ username: data.username, token: res.data.access_token });
      toaster.create({
        title: "Account Created",
        description: "Welcome!",
        type: "success",
      });
      navigate("/");
    } catch (e: any) {
      if (e.response?.status === 409) {
        setError("username", {
          type: "manual",
          message: "Username already exists",
        });
      } else {
        toaster.create({
          title: "Registration Failed",
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
          Create Account
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

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
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
          <ChakraLink as={RouterLink} to="/login" color="teal.500" fontWeight="medium">
            Log in
          </ChakraLink>
        </Text>
      </Box>
    </Flex>
  );
};

export default Register;