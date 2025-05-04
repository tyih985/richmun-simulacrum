import { ReactElement, useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Button,
  Stack,
  Title,
  Text,
  Group,
  Flex,
  Image,
  SimpleGrid,
  PasswordInput,
  Divider,
  Paper,
  Anchor,
  Center,
  Container,
  BackgroundImage,
} from '@mantine/core';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { auth } from '@packages/firebase/firebaseAuth';

export const SignUp = (): ReactElement => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleSignInOrSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // If the user is signing in for the first time, Firebase will automatically create a new account
      // Handle successful sign in/sign up
    } catch (error) {
      console.error('Error with Google sign-in/sign-up:', error);
    }
  };

  const handleSignUp = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Stack align="stretch" justify="center" p="xl">
      <Title>Let's Get Started.</Title>
      <form onSubmit={form.onSubmit(handleSignUp)}>
        <Stack gap="sm">
          <TextInput
            radius="lg"
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps('email')}
            required
          />
          <PasswordInput
            radius="lg"
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps('password')}
            required
          />
          <Flex direction="row" justify="flex-end"></Flex>
          <Button fullWidth radius="lg" type="submit">
            Create Account
          </Button>
        </Stack>
      </form>

      <Divider my="md" label="Or sign in with" labelPosition="center" />

      <Button radius="lg" onClick={handleGoogleSignInOrSignUp}>
        {'Google'}
      </Button>
      <Text size="xs" ta="center">
        {' '}
        Already have an account?{' '}
        <Anchor href="/login" size="xs" target="_self" underline="hover">
          Sign in
        </Anchor>
      </Text>
    </Stack>
  );
};
