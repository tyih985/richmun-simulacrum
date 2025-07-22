import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ReactElement, useState } from 'react';
import { Country, DelegateDoc } from '@features/types';
import { generateDelegateId } from '@packages/generateIds';

type DelegateModalProps = {
  availableCountries: Country[];
  setAvailableCountries: (countries: Country[]) => void;
  addRows: (newDelegates: DelegateDoc[]) => void;
};

export const CustomModalContent = (props: DelegateModalProps): ReactElement => {
  const { availableCountries, setAvailableCountries, addRows } = props;

  // State for custom country
  const [customValue, setCustomValue] = useState<Country>({} as Country);

  function handleSubmit() {
    const customDelegate = InputToDelegate(form.values.country, form.values.alias);

    addRows(customDelegate);

    setAvailableCountries(
      availableCountries.filter(
        (c) => ![customValue].some((selected) => selected.name === c.name),
      ),
    );

    setCustomValue({} as Country);
  }

  const form = useForm({
    initialValues: {
      country: '',
      alias: '',
    },
  });

  return (
    <Stack>
      <TextInput
        label="Add custom country"
        placeholder="e.g. Candyland" // this is kinda wordy lmao but alas
        {...form.getInputProps('country')}
        required
        autoFocus
      />
      <TextInput
        label="Alias for the country (optional)"
        placeholder="e.g. 'United States' can be 'USA'"
        {...form.getInputProps('alias')}
      />
      {/* <EmojiPicker></EmojiPicker> */}
      {/* <TextInput
        label="Add custom country"
        placeholder="Type a country name"
        /> */}
      {/* {<ImageUploader
          onChange={}
          onUploadSuccess={}
        />
        {uploadedUrl && <Image w={'200px'} radius="md" src={uploadedUrl} />}} */}

      <Group justify="center">
        <Button disabled={form.values.country.length === 0} onClick={handleSubmit}>
          Submit countries
        </Button>
      </Group>
    </Stack>
  );
};
function InputToDelegate(countryname: string, countryalias: string): DelegateDoc[] {
  return [
    {
      id: generateDelegateId(countryname),
      name: countryname,
      longName: countryalias,
      email: '',
      inviteStatus: 'pending',
      totalSpeakingDuration: 0,
      positionPaperSent: false,
      spoke: false,
    },
  ];
}
