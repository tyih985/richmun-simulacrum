import { ReactElement } from 'react';
import { useForm } from '@mantine/form';
import { Button, Checkbox, Group, Text, TextInput, Title } from '@mantine/core';

export const BrandingPage = (): ReactElement => {
  const demoForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <div>
      <Title>Branding</Title>
      <form onSubmit={demoForm.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={demoForm.key('email')}
          {...demoForm.getInputProps('email')}
        />

        <Checkbox
          mt="md"
          label="I agree to sell my privacy"
          key={demoForm.key('termsOfService')}
          {...demoForm.getInputProps('termsOfService', { type: 'checkbox' })}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <Text c="red">this isn't a real form</Text>
    </div>
  );
};

export default BrandingPage;
