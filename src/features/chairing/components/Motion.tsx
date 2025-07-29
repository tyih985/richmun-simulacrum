import { ReactElement, useState } from 'react';
import {
  Button,
  CloseButton,
  Group,
  NumberInput,
  Paper,
  Select,
  TextInput,
} from '@mantine/core';
import { DelegateDoc, MotionDoc } from '@features/types';

type Props = {
  delegates: DelegateDoc[];
  motion: MotionDoc;
  onChange: (motion: MotionDoc) => void;
  onRemove: (motionId: string) => void;
  onStart: (motion: MotionDoc) => void;
};

export const Motion = ({
  delegates,
  motion,
  onChange,
  onRemove,
  onStart,
}: Props): ReactElement => {
  const [type, setType] = useState<MotionDoc['type']>(motion.type || 'moderated');

  return (
    <>
      <Paper p="lg" radius="md" withBorder>
        <Group align="center" justify="space-between">
          <CloseButton
            color="red"
            variant="outline"
            onClick={() => onRemove(motion.id)}
          />
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
            unselectable="off"
            value={motion.type || 'moderated'}
            data={['moderated', 'unmoderated', 'round table']}
            onChange={(value) => {
              onChange({ ...motion, type: value as MotionDoc['type'] });
              setType(value as MotionDoc['type']);
            }}
          />
          <Group grow align="center" flex={'auto'}>
            {type !== 'round table' && (
              <NumberInput
                label="Speaking Time (seconds)"
                value={motion.totalTime}
                onChange={(value) =>
                  onChange({
                    ...motion,
                    totalTime: typeof value === 'number' ? value : undefined,
                  })
                }
                min={0}
                step={30}
                placeholder="Enter seconds"
              />
            )}

            {type !== 'unmoderated' && (
              <NumberInput
                label="Total Time (seconds)"
                value={motion.totalTime}
                onChange={(value) =>
                  onChange({
                    ...motion,
                    totalTime: typeof value === 'number' ? value : undefined,
                  })
                }
                min={0}
                step={30}
                placeholder="Enter seconds"
              />
            )}
          </Group>

          <TextInput
            w={'300px'}
            label="Topic"
            placeholder="Enter the motion topic"
            required
            value={motion.topic}
            onChange={(event) =>
              onChange({ ...motion, topic: event.currentTarget.value })
            }
          />
          <Button onClick={() => onStart(motion)} variant="outline" size="md">
            Start
          </Button>
        </Group>
      </Paper>
    </>
  );
};
