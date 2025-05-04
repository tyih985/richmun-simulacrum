import { ReactElement, useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Stack, Title, Text, Group, Flex, Image, SimpleGrid, PasswordInput, Divider, Paper, Anchor, Center, Container, BackgroundImage} from '@mantine/core';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { auth } from '@packages/firebase/firebaseAuth';

export const Login = (): ReactElement => {
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
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

  const handleSignIn = async (values: { email: string, password: string }) => {
    const { email , password } = values;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.localStorage.setItem('emailForSignIn', email);
      // Handle sending sign-in link
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <Container 
    fluid
    p="0"
    h={"100vh"}>
      <BackgroundImage
      h="100%"
      w="100%"
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      >
        <Center
          h="100%"
          w="100%"
          p="5%">
          <Paper
            bg="var(--mantine-color-body)"
            p="10vh"
            h="625px"
            w="450px"
            radius="lg"
            shadow='md'>
          <Stack
              align="stretch"
              justify="center"
            >
              <Title>Welcome Back!</Title>
              <form onSubmit={form.onSubmit(handleSignIn)}>
                <Stack 
                gap="sm"
                >
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
                  <Flex
                    direction='row'
                    justify="flex-end">
                      <Anchor href="/forgot-password"  size="xs" target="_self" underline="hover"> 
                        Forgot password?
                      </Anchor>
                  </Flex>
                  <Button 
                    fullWidth 
                    radius="lg" 
                    type="submit">
                      Sign In
                  </Button>
                </Stack>
              </form>

              <Divider my="md" label="Or sign in with" labelPosition="center" />

              <Button radius="lg" onClick={handleGoogleSignInOrSignUp}>{'Google'}</Button>
              <Text size='xs' ta='center'> Don't have an account?{' '} 
                <Anchor href="/sign-up"  size="xs" target="_self" underline="hover">Sign up</Anchor>
              </Text>
            </Stack>
          </Paper>
        </Center>
      </BackgroundImage>
    </Container>
    
  );
};
