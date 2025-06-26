import { ReactElement } from 'react';
import { Container, Flex, Title, Text, Space, TextInput } from '@mantine/core';
import { DateInputComponent } from '@components/DateInput';
import { UseFormReturnType } from '@mantine/form';
import type { SetupFormValues } from 'src/features/types.ts';

interface StepOneProps {
  form: UseFormReturnType<SetupFormValues>;
}

export function StepOne({ form }: StepOneProps): ReactElement {
  return (
    <Container size="sm" p="xl">
      <Flex direction="column" gap="sm">
        <Title order={3}>1. Basic Information</Title>
        <Text size="sm">
          Let us know some general information about your committee and event to get
          started.
        </Text>

        <Space h="md" />

        <TextInput
          label="What’s your committee long name?"
          placeholder="e.g. the bestest committee :D"
          {...form.getInputProps('committeeLongName')}
          radius="lg"
          autoFocus
          required
        />

        <Space h="md" />

        <TextInput
          label="What’s your committee short name?"
          placeholder="e.g. tbc"
          {...form.getInputProps('committeeShortName')}
          radius="lg"
          required
        />

        <Space h="md" />

        <DateInputComponent
          label="What date(s) will your event take place?"
          placeholder="Pick a date range"
          value={form.values.dateRange}
          onChange={(range) => form.setFieldValue('dateRange', range!)}
          radius="lg"
        />

        <Text size="sm" c="dimmed">
          Delegates added to the committee will gain access the day your event starts. All
          unsaved data will be lost one week after your event ends.
        </Text>
      </Flex>
    </Container>
  );
}
