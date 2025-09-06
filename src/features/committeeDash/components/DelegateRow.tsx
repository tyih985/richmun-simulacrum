import { Table, TextInput, Text } from '@mantine/core';
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
  isStaff: boolean;
}

export const DelegateRow = ({ form, index, isStaff }: DelegateRowProps) => {
  const emailField = `delegates.${index}.email`;
  const countryField = `delegates.${index}.name`;

  return (
    <>
      <Table.Td w={'26%'}>
        <Text size="sm">{form.values.delegates[index].name}</Text>
      </Table.Td>

      <Table.Td w={'70%'}>
        {isStaff ? (
          <TextInput {...form.getInputProps(emailField)} placeholder="Delegate email" />
        ) : (
          <Text>{form.values.delegates[index].email}</Text>
        )}
      </Table.Td>
    </>
  );
};
