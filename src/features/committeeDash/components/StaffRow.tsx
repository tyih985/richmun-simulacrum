import { Table, Select, TextInput, Text } from '@mantine/core';
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
  isStaff: boolean;
}

export const StaffRow = ({ form, index, isStaff }: StaffRowProps) => {
  const fieldName = `staff.${index}.email`;
  const roleField = `staff.${index}.staffRole`;
  const staffMember = form.values.staff[index];

  return (
    <>
      <Table.Td>
        {isStaff ? (
          <Select
            {...form.getInputProps(roleField)}
            data={[
              { value: 'director', label: 'Director' },
              { value: 'assistant director', label: 'Assistant Director' },
              { value: 'flex staff', label: 'Flex Staff' },
            ]}
            placeholder="Select role"
          />
        ) : (
          <Text>{staffMember.staffRole}</Text>
        )}
      </Table.Td>

      <Table.Td>
        {isStaff ? (
          <TextInput
            {...form.getInputProps(fieldName)}
            placeholder="Email"
          />
        ) : (
          <Text>{staffMember.email}</Text>
        )}
      </Table.Td>
    </>
  );
};
