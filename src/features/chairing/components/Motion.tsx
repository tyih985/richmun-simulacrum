import { ReactElement, useState } from 'react';
import { Button, CloseButton, Group, Paper, Select, TextInput } from '@mantine/core';
import { TimePicker } from '@mantine/dates';
import { DelegateDoc, MotionDoc } from '@features/types';

type Props = {
  delegates: DelegateDoc[];
  motion: MotionDoc;
  onChange: (motion: MotionDoc) => void;
  onRemove: (motionId: string) => void;
  onStart: (motionId: string) => void;
};

export const Motion = ({ delegates, motion, onChange, onRemove, onStart}: Props): ReactElement => {
  const [type, setType] = useState<MotionDoc['type']>(motion.type || 'moderated');
  
  return (
    <>
    <Paper p="lg" radius="md" withBorder>
    <Group align="center" justify='space-between'>
      <CloseButton color="red" variant="outline" onClick={() => onRemove(motion.id)}/>
      <Select
        label="Delegate"
        placeholder="Select a delegate"
        required
        value={motion.delegate}
        data={delegates.map((delegate) => ({
          value: delegate.id,
          label: delegate.name,
        }))}
        searchable
        onChange={(value) => onChange({ ...motion, delegate: value || '' })}
      />
      <Select
        label="Type"
        placeholder="Select a type"
        required
        unselectable='off'
        value={motion.type || 'moderated'}
        data={['moderated', 'unmoderated', 'round table']}
        onChange={(value) => {
          onChange({ ...motion, type: value as MotionDoc['type'] });
          setType(value as MotionDoc['type']);
        }}
      />
      <Group grow align="center" flex={'auto'}>
        {type !== 'round table' && (
          <TimePicker
            label="Total Time"
            clearable
            withSeconds
            withDropdown
            hoursStep={1}
            minutesStep={5}
            secondsStep={10}
            value={motion.totalTime?.toString()}
            onChange={(value) => onChange({ ...motion, speakingTime: value ? Number(value) : undefined })}
            style={{ flex: 1 }}
          />)}

        {type !== 'unmoderated' && (
          <TimePicker
            label="Speaking Time"
            clearable
            withSeconds
            withDropdown
            hoursStep={1}
            minutesStep={5}
            secondsStep={10}
            value={motion.totalTime?.toString()}
            onChange={(value) => onChange({ ...motion, speakingTime: value ? Number(value) : undefined })}
            style={{ flex: 1 }}
          />
        )}
      </Group>
      
      <TextInput
        w={'300px'}
        label="Topic"
        placeholder="Enter the motion topic"
        required
        value={motion.topic}
        onChange={(event) => onChange({ ...motion, topic: event.currentTarget.value })}
      />
      <Button onClick={() => onStart(motion.id)} variant="outline" size="md">
        Start
      </Button>
        
    </Group>
    </Paper>
    </>
  );
};

