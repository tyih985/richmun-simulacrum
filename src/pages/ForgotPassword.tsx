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
import { sendSignInLinkToEmail } from 'firebase/auth';

import { auth } from '@packages/firebase/firebaseAuth';

export const ForgotPassword = (): ReactElement => {
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
    },
  });

  const handleSignInLink = async (values: { email: string }) => {
    const { email } = values;
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailLinkSent(true);
      // Handle sending sign-in link
    } catch (error) {
      console.error('Error sending sign-in link:', error);
    }
  };

  return (
    <Container fluid p="0" h={'100vh'}>
      <BackgroundImage
        h="100%"
        w="100%"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
      >
        <Center h="100%" w="100%" p="5%">
          <Paper
            bg="var(--mantine-color-body)"
            p="10vh"
            h="625px"
            w="450px"
            radius="lg"
            shadow="md"
          >
            <Stack align="stretch" justify="center">
              <Title>Forgot Password</Title>
              <Text>A password-less sign-in link to be sent to your email.</Text>
              <form onSubmit={form.onSubmit(handleSignInLink)}>
                <Stack gap="sm">
                  <TextInput
                    radius="lg"
                    label="Email"
                    placeholder="Enter your email"
                    {...form.getInputProps('email')}
                    required
                  />

                  {emailLinkSent ? (
                    <Text>Email sent, check your email for a sign-in link</Text>
                  ) : (
                    <Button radius="lg" type="submit">
                      Send Sign-In Link
                    </Button>
                  )}
                </Stack>
              </form>
              <Text size="xs" ta="center">
                {' '}
                Already have an account?{' '}
                <Anchor href="/login" size="xs" target="_self" underline="hover">
                  Sign in
                </Anchor>
              </Text>
            </Stack>
          </Paper>
        </Center>
      </BackgroundImage>
    </Container>
  );
};
