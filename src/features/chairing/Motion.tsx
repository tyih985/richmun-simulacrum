import { ReactElement } from 'react';
import { Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { TimePicker } from '@mantine/dates';
import { DelegateDoc } from '@features/types';

type Props = {
  delegates: DelegateDoc[];
};

export const Motion = ({ delegates }: Props): ReactElement => {
  return (
    <Group p="lg">
      <Select
        label="Delegate"
        placeholder="Select a delegate"
        required
        data={delegates.map((delegate) => ({
          value: delegate.id,
          label: delegate.name,
        }))}
        searchable
      />
      <Select
        label="Type"
        placeholder="Select a type"
        required
        data={['Moderated', 'Unmoderated', 'Round Table']}
      />
      <Text></Text>
      <TimePicker
        label="Total Time"
        clearable
        withSeconds
        withDropdown
        hoursStep={1}
        minutesStep={5}
        secondsStep={10}
        required
      />
      <TimePicker
        label="Speaking Time"
        clearable
        withSeconds
        withDropdown
        hoursStep={1}
        minutesStep={5}
        secondsStep={10}
        required
      />
      <TextInput label="Topic" placeholder="Enter the motion topic" required />
    </Group>
  );
};
