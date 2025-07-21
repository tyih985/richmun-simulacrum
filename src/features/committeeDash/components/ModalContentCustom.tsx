import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ReactElement } from 'react';
import { Country, Delegate } from '@features/types';

type DelegateModalProps = {
  availableCountries: Country[];
  setAvailableCountries: (countries: Country[]) => void;
  addRows: (newDelegates: Delegate[]) => void;
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

    const newDelegate: Delegate = {
      country: {
        name: customCountryName,
        value: customCountryName.toLowerCase().replace(/\s+/g, '-'),
        longName: form.values.alias || undefined,
      },
      email: '',
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
