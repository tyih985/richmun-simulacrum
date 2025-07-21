import { Group, TextInput, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Delegate } from '@features/types';

interface DelegateRowProps {
  form: UseFormReturnType<{
    longName: string;
    shortName: string;
    staff: any[];
    delegates: Delegate[];
    dateRange: [Date | null, Date | null];
  }>;
  index: number;
}

export const DelegateRow = ({ form, index }: DelegateRowProps) => {
  const emailField = `delegates.${index}.email`;
  const delegate = form.values.delegates[index];

  return (
    <Group wrap="nowrap">
      <Text style={{ flex: 1 }}>{delegate.country.name}</Text>
      <TextInput
        style={{ flex: 2 }}
        {...form.getInputProps(emailField)}
        placeholder="Delegate email"
      />
    </Group>
  );
};
