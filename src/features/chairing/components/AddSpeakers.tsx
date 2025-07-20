import { DelegateDoc } from '@features/types';
import { Button, Card, Group, MultiSelect, Stack, Text } from '@mantine/core';
import { ReactElement, useState } from 'react';

type Props = {
  delegates: DelegateDoc[];
};

export const AddSpeakers = ({ delegates }: Props): ReactElement => {
  const [speakers, setSpeakers] = useState<string[]>([]);

  const addSpeaker = (name: string) => {
    if (!speakers.includes(name)) {
      setSpeakers([...speakers, name]);
      console.log(`Added ${name} as a speaker`);
      // disable the button or remove it from the list
    }
  };

  const clearSpeakers = () => {
    setSpeakers([]);
  };

  return (
    <Group grow align="flex-start">
      <Card bg={'gray.0'} p="md">
        <Stack>
          <Text>Add Speakers:</Text>
          {delegates.map((d) => (
            <Button
              variant="subtle"
              size="compact-md"
              key={d.id}
              onClick={() => addSpeaker(d.name)}
            >
              {d.name}
            </Button>
          ))}
        </Stack>
      </Card>
      <Card bg={'gray.0'} p="md">
        <Stack>
          <Group>
            <Text flex={1}>Current Speakers:</Text>
            {speakers.length > 0 && (
              <Button color="red" size="compact-sm" onClick={clearSpeakers}>
                Clear
              </Button>
            )}
          </Group>
          {speakers.length > 0 ? (
            speakers.map((speaker, index) => (
              <Stack align="center" justify="center">
                <Text fw={'bold'} key={index}>
                  {speaker}
                </Text>
              </Stack>
            ))
          ) : (
            <Text c="dimmed">No speakers added yet.</Text>
          )}
        </Stack>
      </Card>
    </Group>
  );
};

{
  /* <MultiSelect data={delegates.map((d) => ({
                value: d.id,
                label: `${d.name}`,
            }))}
            placeholder="Select delegates to add as speakers"
            label="Add Speakers"
            searchable
            clearable
            maxDropdownHeight={400}
            size="md">
            </MultiSelect> */
}
