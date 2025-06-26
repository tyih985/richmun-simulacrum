import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  useCombobox,
  Text,
  CloseButton,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { CountryPill } from './CountryPill';
import { Country } from 'src/features/types';

type CountryMultiSelectProps = {
  ref?: React.ForwardedRef<HTMLInputElement>;
  dropdownData: Country[];
  value: Country[];
  onChange: (value: Country[]) => void;
};

export function CountryMultiSelect(props: CountryMultiSelectProps) {
  const { dropdownData, value, onChange } = props;
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  //   useEffect(() => {
  //       const handleKeyDown = (event: KeyboardEvent) => {
  //         if (event.key === 'Enter') {
  //           // Only blur if this MultiSelect is focused
  //           if (
  //             document.activeElement === multiSelectRef.current ||
  //             multiSelectRef.current?.contains(document.activeElement)
  //           ) {
  //             multiSelectRef.current?.blur();
  //           }
  //         }
  //       };

  //       window.addEventListener('keydown', handleKeyDown);
  //       return () => window.removeEventListener('keydown', handleKeyDown);
  //     }, []);

  const [search, setSearch] = useState('');

  const handleValueSelect = (countryName: string) => {
    const selectedCountry = dropdownData.find((country) => country.name === countryName);
    if (!selectedCountry) return;
    if (value.includes(selectedCountry)) {
      onChange(value.filter((v) => v !== selectedCountry));
    } else {
      onChange([...value, selectedCountry]);
    }
  };

  const handleValueRemove = (val: Country) => onChange(value.filter((v) => v !== val));

  const handleClearAll = () => onChange([]);

  const values = value.map((country) => (
    <CountryPill
      key={country.name}
      value={country.name}
      onRemove={() => handleValueRemove(country)}
    >
      {country.name}
    </CountryPill>
  ));

  const options = dropdownData
    .filter(
      (country) =>
        country.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        country.longName?.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .map((country) => (
      <Combobox.Option
        value={country.name}
        key={country.name}
        active={value.includes(country)}
      >
        <Group gap="sm">
          {value.includes(country) ? <CheckIcon size={12} /> : null}
          <Group gap={7} align="flex-end">
            <Text size="sm">{country.flag}</Text>
            <Text size="sm">{country.name}</Text>
            <Text size="xs" c="dimmed">
              {country.longName}
            </Text>
          </Group>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={true}>
      <Combobox.DropdownTarget>
        <PillsInput pointer onClick={() => combobox.toggleDropdown()}>
          <Group justify="stretch">
            <Pill.Group flex={1}>
              {values}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder="Start typing to search..."
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && search.length === 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
            {value.length > 0 && <CloseButton onClick={handleClearAll}></CloseButton>}
          </Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown mah={'300px'} style={{ overflowY: 'auto' }}>
        <Combobox.Options>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found...</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
