import { ReactElement } from 'react';
import { Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { TimePicker } from '@mantine/dates';
import { DelegateDoc } from '@features/types';

export const Motion = (): ReactElement => {

    // TODO: get delegates from db
    const mockDelegates: DelegateDoc[] = [
      {
        id: 'd1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        inviteStatus: 'accepted',
        minutes: 12,
        positionPaperSent: true,
        attendanceStatus: 'present',
        spoke: true,
      },
      {
        id: 'd2',
        name: 'Ben Carson',
        email: 'ben@example.com',
        inviteStatus: 'pending',
        minutes: 0,
        positionPaperSent: false,
        attendanceStatus: 'absent',
        spoke: false,
      },
      {
        id: 'd3',
        name: 'Catherine Lee',
        email: 'catherine@example.com',
        inviteStatus: 'accepted',
        minutes: 5,
        positionPaperSent: true,
        attendanceStatus: 'excused',
        spoke: false,
      },
    ];

  return (
    <Group p="lg">
        <Select
        label="Delegate"
        placeholder="Select a delegate"
        required
        data={mockDelegates.map(delegate => ({
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
        <TextInput
        label='Topic'
        placeholder='Enter the motion topic'
        required
        />    
    </Group>
  );
};
