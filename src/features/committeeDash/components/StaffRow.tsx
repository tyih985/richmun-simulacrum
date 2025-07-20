import { Group, TextInput, Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { StaffDoc } from '@features/types';

interface StaffRowProps {
  form: UseFormReturnType<{
    longName: string;
    shortName: string;
    staff: StaffDoc[];
    delegates: any[];
    dateRange: [Date | null, Date | null];
  }>;
  index: number;
}

export const StaffRow = ({ form, index }: StaffRowProps) => {
  const fieldName = `staff.${index}.email`;
  const roleField = `staff.${index}.staffRole`;

  const staffMember = form.values.staff[index];

  return (
    <Group wrap="nowrap">
      <Select
        style={{ flex: 1 }}
        {...form.getInputProps(roleField)}
        data={[
          { value: 'director', label: 'Director' },
          { value: 'assistant director', label: 'Assistant Director' },
          { value: 'flex staff', label: 'Flex Staff' },
        ]}
        placeholder="Select role"
        radius="sm"
      />
      <TextInput
        style={{ flex: 2 }}
        {...form.getInputProps(fieldName)}
        placeholder="Email"
      />
    </Group>
  );
};
