import { Group, TextInput, Text, Table } from '@mantine/core';
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
  const countryField = `delegates.${index}.country.name`;


  return (
    <>
        <Table.Td>
          <TextInput
        {...form.getInputProps(countryField)}
        placeholder="Delegate country"
        />
        </Table.Td>
    
      <Table.Td>
      <TextInput
        {...form.getInputProps(emailField)}
        placeholder="Delegate email"
      />
</Table.Td>
      </>
  );
};
