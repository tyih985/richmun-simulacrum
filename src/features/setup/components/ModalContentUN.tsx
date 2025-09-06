import { CountryMultiSelect } from '@components/CountryMultiSelect';
// import { ImageUploader } from "@components/ImageUploader";
import { Button, Group, Stack } from '@mantine/core';
import { generateDelegateId } from '@packages/generateIds';
import { ReactElement, useState } from 'react';
import { Country, DelegateDoc } from 'src/features/types';

type DelegateModalProps = {
  availableCountries: Country[];
  setAvailableCountries: (countries: Country[]) => void;
  addRows: (newDelegates: DelegateDoc[]) => void;
};

function CountryToDelegate(countries: Country[]): DelegateDoc[] {
  return countries.map((country) => ({
    id: generateDelegateId(country.name),
    name: country.name,
    email: '',
    inviteStatus: 'pending',
    minutes: 0,
    positionPaperSent: false,
    attendanceStatus: 'absent',
  }));
}

export const UNModalContent = (props: DelegateModalProps): ReactElement => {
  const { availableCountries, setAvailableCountries, addRows } = props;

  // State for UN countries
  const [selectedValues, setSelectedValues] = useState<Country[]>([]);

  function handleSubmit() {
    const selectedUNDelegates = CountryToDelegate(selectedValues);

    addRows(selectedUNDelegates);

    setAvailableCountries(
      availableCountries.filter(
        (c) => !selectedValues.some((selected) => selected.name === c.name),
      ),
    );

    setSelectedValues([]);
  }

  return (
    <Stack p="lg">
      <CountryMultiSelect
        dropdownData={availableCountries}
        value={selectedValues}
        onChange={setSelectedValues}
      ></CountryMultiSelect>
      <Group justify="center">
        <Button onClick={handleSubmit} disabled={selectedValues.length === 0}>
          Submit countries
        </Button>
      </Group>
    </Stack>
  );
};
