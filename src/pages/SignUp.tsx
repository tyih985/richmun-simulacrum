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
  Checkbox,
} from '@mantine/core';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';

import { auth } from '@packages/firebase/firebaseAuth';
import {
  createFirestoreDocument,
  getFirestoreDocument,
} from '@packages/firestoreAsQuery';
import { usersPath } from '@packages/firestorePaths';

export const SignUp = (): ReactElement => {
  const [isEulaSigned, setIsEulaSigned] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSuccessfulSignUp = async (user: User | null, isEulaSigned: boolean) => {
    console.log('User:', user);
    if (!user) {
      console.error('User is null after sign up');
      return;
    }
    const userId = user.uid;
    const userData = {
      email: user.email,
      createdAt: new Date(),
      isEulaSigned: isEulaSigned,
    };

    try {
      await createFirestoreDocument(usersPath(userId), userData);

      // checking if the document is created and whats in it
      const result = getFirestoreDocument(usersPath(userId));
      console.log('Firestore document created:', result);

      // Handle successful sign up (e.g., redirect to another page)
    } catch (error) {
      console.error('Error creating Firestore document:', error);
    }
  };

  const handleGoogleSignInOrSignUp = async () => {
    console.log('Google sign-in/sign-up clicked');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // If the user is signing in for the first time, Firebase will automatically create a new account
      // Handle successful sign in/sign up
      await handleSuccessfulSignUp(user, isEulaSigned);
    } catch (error) {
      console.error('Error with Google sign-in/sign-up:', error);
    }
  };

  const handleSignUp = async (values: { email: string; password: string }) => {
    console.log('normal sign-in/sign-up clicked');
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
          <Flex direction="row" justify="flex-end">
            <Checkbox
              size="xs"
              checked={isEulaSigned}
              onChange={(event) => setIsEulaSigned(event.currentTarget.checked)}
              radius="sm"
              labelPosition="left"
              label={
                <>
                  I agree to the{' '}
                  <Anchor href="/eula" size="xs" target="_blank" underline="hover">
                    {' '}
                    EULA
                  </Anchor>
                  ! :3
                </>
              }
              required
            />
          </Flex>
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
