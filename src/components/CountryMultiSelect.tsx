import {
  CheckIcon,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  useCombobox,
  Text,
  CloseButton,
} from '@mantine/core';
import { useState } from 'react';
import { CountryPill } from './CountryPill';
import { Country } from 'src/features/types';

type CountryMultiSelectProps = {
  ref?: React.ForwardedRef<HTMLInputElement>;
  data: Country[];
  value: string[];
  onChange: (value: string[]) => void;
};

export function CountryMultiSelect(props: CountryMultiSelectProps) {
  const { data, value, onChange } = props;
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');

  const handleValueSelect = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const handleValueRemove = (val: string) => onChange(value.filter((v) => v !== val));

  const handleClearAll = () => onChange([]);

  const values = value.map((item) => (
    <CountryPill key={item} value={item} onRemove={() => handleValueRemove(item)}>
      {item}
    </CountryPill>
  ));

  const options = data
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.longName?.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .map((item) => (
      <Combobox.Option
        value={item.name}
        key={item.name}
        active={value.includes(item.name)}
      >
        <Group gap="sm">
          {value.includes(item.value) ? <CheckIcon size={12} /> : null}
          <Group gap={7} align="flex-end">
            <Text size="sm">{item.flag}</Text>
            <Text size="sm">{item.value}</Text>
            <Text size="xs" c="dimmed">
              {item.longName}
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
