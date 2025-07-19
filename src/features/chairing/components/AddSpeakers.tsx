import { DelegateDoc } from "@features/types";
import { Button, MultiSelect, Stack, Text} from "@mantine/core";
import { ReactElement } from "react";

type Props = {
  delegates: DelegateDoc[];
};

export const AddSpeakers = ({ delegates }: Props): ReactElement => {
    const speakers: string[] = [];

    return (
        <Stack>
            {/* <MultiSelect data={delegates.map((d) => ({
                value: d.id,
                label: `${d.name}`,
            }))}
            placeholder="Select delegates to add as speakers"
            label="Add Speakers"
            searchable
            clearable
            maxDropdownHeight={400}
            size="md">
            </MultiSelect> */}
            {delegates.map((d) => (
                <Button onClick={() => {
                speakers.push(d.name)
                console.log(`Added ${d.name} as a speaker`);
                console.log('Current speakers:', speakers);
                }}>{d.name}</Button>
            ))}

            
            <Stack>
                <Text>Current Speakers:</Text>
                {speakers.map((speaker, index) => (
                    <Text key={index}>{speaker}</Text>
                ))}
                {speakers.length > 0 ? 
                (
                <>
                    <Text>
                        {speakers.join(', ')} 
                        <br />
                        <br />
                    </Text>
                    <Button onClick={() => speakers.splice(0, speakers.length)}>Clear Speakers</Button>
                </>
                )
                : (<Text>'No speakers added yet.'</Text>)}
            
            </Stack>

        </Stack>
    )
}