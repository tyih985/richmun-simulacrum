import { DelegateDoc } from '@features/types';
import { Button, MultiSelect, Stack, Text } from '@mantine/core';
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
    }
  };

  const clearSpeakers = () => {
    setSpeakers([]);
  };

  return (
    <Stack>
      {delegates.map((d) => (
        <Button key={d.id} onClick={() => addSpeaker(d.name)}>
          {d.name}
        </Button>
      ))}

      <Stack>
        <Text>Current Speakers:</Text>
        {speakers.length > 0 ? (
          <>
            {speakers.map((speaker, index) => (
              <Text key={index}>{speaker}</Text>
            ))}
            <Button color="red" onClick={clearSpeakers}>
              Clear Speakers
            </Button>
          </>
        ) : (
          <Text c="dimmed">No speakers added yet.</Text>
        )}
      </Stack>
    </Stack>
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
