import { Group, TextInput, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { DelegateDoc } from '@features/types';

interface DelegateRowProps {
  form: UseFormReturnType<{
    longName: string;
    shortName: string;
    staff: any[];
    delegates: DelegateDoc[];
    dateRange: [Date | null, Date | null];
  }>;
  index: number;
}

export const DelegateRow = ({ form, index }: DelegateRowProps) => {
  const fieldName = `delegates.${index}.email`;
  const delegate = form.values.delegates[index];

  return (
    <Group wrap="nowrap">
      <Text style={{ flex: 1 }}>{delegate.name}</Text>
      <TextInput
        style={{ flex: 2 }}
        {...form.getInputProps(fieldName)}
        placeholder="email"
      />
    </Group>
  );
};
