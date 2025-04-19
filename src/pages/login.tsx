import { ReactElement, useState } from 'react';
import { Text} from '@mantine/core';
// import { useForm } from '@mantine/form';
// import { TextInput, Button, Stack, Title, Text } from '@mantine/core';
// import {
//   sendSignInLinkToEmail,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from 'firebase/auth';

// import { auth } from '@packages/firebase/firebaseAuth';

export const Login = (): ReactElement => {
  const [_, mock] = useState()
  
  return (
    <Text>
      The Login functionality has been commented out, as it will break the app when it's
      missing a Firebase config. Please set the env variables for your firebase project
      before restoring login functionality.
    </Text>
  );
};
// export const Login = (): ReactElement => {
//   const [emailLinkSent, setEmailLinkSent] = useState(false);
//   const form = useForm({
//     initialValues: {
//       email: '',
//     },
//   });

//   const handleGoogleSignInOrSignUp = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       await signInWithPopup(auth, provider);
//       // If the user is signing in for the first time, Firebase will automatically create a new account
//       // Handle successful sign in/sign up
//     } catch (error) {
//       console.error('Error with Google sign-in/sign-up:', error);
//     }
//   };

//   const handleSignInLink = async (values: { email: string }) => {
//     const { email } = values;
//     const actionCodeSettings = {
//       url: window.location.href,
//       handleCodeInApp: true,
//     };
//     try {
//       await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//       window.localStorage.setItem('emailForSignIn', email);
//       setEmailLinkSent(true);
//       // Handle sending sign-in link
//     } catch (error) {
//       console.error('Error sending sign-in link:', error);
//     }
//   };

//   return (
//     <Stack>
//       <Title>Welcome! Let's get started</Title>

//       <Text>Sign-up or Login with Google</Text>
//       <Button onClick={handleGoogleSignInOrSignUp}>{'Sign in with Google'}</Button>

//       <Text>
//         Enter your email below to sign in or create an account. If you don’t have an
//         account yet, we’ll send you a sign-in link to get started—no password required!
//       </Text>

//       <form onSubmit={form.onSubmit(handleSignInLink)}>
//         <TextInput
//           label="Email"
//           placeholder="Enter your email"
//           {...form.getInputProps('email')}
//           required
//         />
//         {emailLinkSent ? (
//           <Text>Email sent, check your email for a log-in link</Text>
//         ) : (
//           <Button type="submit">Sign In</Button>
//         )}
//       </form>
//     </Stack>
//   );
// };
