import { Button, Group, Stack, TagsInput, Text } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IconAt } from '@tabler/icons-react';
import { ReactElement, useEffect, useState } from 'react';
import { SetupFormValues } from 'src/features/types';

type StaffModalProps = {
  onTagChange: (values: string[]) => void;
  onSubmit: () => void;
};

export const StaffModalContent = (props: StaffModalProps): ReactElement => {
  const { onTagChange, onSubmit } = props;

  const staffForm = useForm({
    initialValues: {
      staff: [] as string[],
    },
    validate: {
      staff: (emails) => {
        const invalid = emails.filter(
          (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        );
        console.log('Verifying emails:', emails, 'Invalid emails:', invalid);
        if (invalid.length >= 1) {
          return 'One or more emails are invalid';
        }
      },
    },
  });

  useEffect(() => {
    staffForm.validateField('staff');
  }, [staffForm, staffForm.values.staff]);

  return (
    <Stack justify="flex-start" align="stretch" gap="md" px="xl" pb="lg">
      <TagsInput
        label="Press enter to add a staff email."
        placeholder="Enter email..."
        leftSection={<IconAt size={16} />}
        radius="lg"
        {...staffForm.getInputProps('staff')}
        autoFocus
        onChange={(vals) => {
          const cleaned = vals.map((v) => v.trim()).filter((v) => v !== '');
          staffForm.setFieldValue('staff', cleaned);
          onTagChange(cleaned);
        }}
      />

      <Text size="sm" c="dimmed">
        Unsure? No worries, you can change this anytime after you've created your
        committee.
      </Text>

      <Group justify="center">
        <Button
          onClick={onSubmit}
          disabled={staffForm.values.staff.length === 0 || !!staffForm.errors.staff}
        >
          Submit
        </Button>
      </Group>
    </Stack>
  );
};
