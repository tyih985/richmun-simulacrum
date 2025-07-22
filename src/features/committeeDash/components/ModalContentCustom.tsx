import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ReactElement } from 'react';
import { Country, DelegateDoc } from '@features/types';
import { generateDelegateId } from '@packages/generateIds';

type DelegateModalProps = {
  availableCountries: Country[];
  setAvailableCountries: (countries: Country[]) => void;
  addRows: (newDelegates: DelegateDoc[]) => void;
};

export const CustomModalContent = ({
  availableCountries,
  setAvailableCountries,
  addRows,
}: DelegateModalProps): ReactElement => {
  const form = useForm({
    initialValues: {
      country: '',
      alias: '',
    },
  });

  function handleSubmit() {
    const customCountryName = form.values.country.trim();
    if (!customCountryName) return;

    const newDelegate: DelegateDoc = {
      id: generateDelegateId(customCountryName),
      name: customCountryName,
      email: '',
      inviteStatus: 'pending',
      minutes: 0,
      positionPaperSent: false,
      spoke: false,
    };

    addRows([newDelegate]);
    setAvailableCountries(
      availableCountries.filter((c) => c.name !== customCountryName),
    );

    form.reset();
  }

  return (
    <Stack>
      <TextInput
        label="Add custom country"
        placeholder="e.g. Candyland"
        {...form.getInputProps('country')}
        required
        autoFocus
      />
      <TextInput
        label="Alias for the country (optional)"
        placeholder="e.g. 'United States' can be 'USA'"
        {...form.getInputProps('alias')}
      />

      <Group justify="center">
        <Button disabled={form.values.country.trim().length === 0} onClick={handleSubmit}>
          Submit countries
        </Button>
      </Group>
    </Stack>
  );
};
