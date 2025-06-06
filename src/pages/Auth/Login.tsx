import { ReactElement, useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Button, Stack, Image, Space, TextInput, Text, Alert, Flex } from '@mantine/core';
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from 'firebase/auth';

import { auth } from '@packages/firebase/firebaseAuth';

export const Login = (): ReactElement => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  // Handle email link completion when user returns from clicking the link
  useEffect(() => {
    const completeEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');

        if (!email) {
          // If missing, prompt user for email
          email = window.prompt('Please provide your email for confirmation');
        }

        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            // User is now signed in
          } catch (error) {
            console.error('Error completing email link sign-in:', error);
            setError('Failed to complete email sign-in. Please try again.');
          }
        }
      }
    };

    completeEmailLinkSignIn();
  }, []);

  const handleGoogleSignInOrSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error with Google sign-in/sign-up:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLinkSignIn = async () => {
    if (!form.validate().hasErrors) {
      const email =
        form.values.email ?? window.localStorage.getItem('emailForSignIn') ?? '';

      const actionCodeSettings = {
        url: window.location.href, // User returns to this same login page
        handleCodeInApp: true,
      };

      try {
        setLoading(true);
        setError(null);
        console.log('Sending email link with email:', email);
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);

        // Save email locally to complete sign-in later
        window.localStorage.setItem('emailForSignIn', email);

        setEmailLinkSent(true);
      } catch (error) {
        console.error('Error sending email link:', error);
        setError('Failed to send email link. Please check your email address.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToLogin = () => {
    setEmailLinkSent(false);
    setShowEmailForm(false);
    setError(null);
    form.reset();
  };

  // Show success state after email is sent
  if (emailLinkSent) {
    return (
      <Stack align="stretch" justify="center" p="sm" w={'420px'}>
        <Flex justify="center">
          <Image w="200px" src={'/richmun-logo.png'} />
        </Flex>
        <Space h="xs" />
        <Alert color="green" title="Check your email!">
          We've sent a sign-in link to {form.values.email}. Click the link to sign in.
        </Alert>

        <Button
          variant="subtle"
          radius="lg"
          onClick={handleEmailLinkSignIn}
          loading={loading}
        >
          Send again
        </Button>
      </Stack>
    );
  }

  return (
    <Stack align="stretch" justify="center" p="sm" w={'320px'}>
      <Flex justify="center">
        <Image w="200px" src={'/richmun-logo.png'} />
      </Flex>
      <Space h="xs" />

      {error && (
        <Alert color="red" onClose={() => setError(null)} withCloseButton>
          {error}
        </Alert>
      )}

      {!showEmailForm ? (
        // Initial state: Show both main options
        <>
          <Button
            radius="lg"
            onClick={handleGoogleSignInOrSignUp}
            loading={loading}
            size="md"
          >
            Sign in with Google
          </Button>

          <Button
            radius="lg"
            variant="light"
            onClick={() => setShowEmailForm(true)}
            size="md"
          >
            Email me a login link
          </Button>
        </>
      ) : (
        // Email form state: Show email input and send button
        <form onSubmit={form.onSubmit(handleEmailLinkSignIn)}>
          <Stack align="stretch" justify="center" p="sm" w={'320px'}>
            <TextInput
              radius="lg"
              label="Email"
              placeholder="Enter your email"
              {...form.getInputProps('email')}
              autoFocus
            />

            <Button
              radius="lg"
              onClick={handleEmailLinkSignIn}
              loading={loading}
              size="md"
            >
              Send login link
            </Button>

            <Button variant="subtle" onClick={handleBackToLogin} size="sm">
              Back to login options
            </Button>
          </Stack>
        </form>
      )}
    </Stack>
  );
};
