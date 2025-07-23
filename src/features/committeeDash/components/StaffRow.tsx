import { Group, TextInput, Select, Table, CloseButton, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { StaffDoc } from '@features/types';
import { auth } from '@packages/firebase/firebaseAuth';

interface StaffRowProps {
  form: UseFormReturnType<{
    longName: string;
    shortName: string;
    staff: StaffDoc[];
    delegates: any[];
    dateRange: [Date | null, Date | null];
  }>;
  owner: string;
  index: number;
  onRemove: (i: number) => void;
}

export const StaffRow = ({ form, index, onRemove, owner }: StaffRowProps) => {
  const staffMember = form.values.staff[index];
  const isRowOwner = staffMember?.owner || false;
  const isCurrentUserOwner = auth.currentUser?.email === owner;

  const fieldName = `staff.${index}.email`;
  const roleField = `staff.${index}.staffRole`;

  // Condition for editable inputs
  const canEdit = !(isRowOwner && !isCurrentUserOwner);

  return (
    <>
      <Table.Td w={'50%'}>
        {canEdit ? (
          <Select
            allowDeselect={false}
            {...form.getInputProps(roleField)}
            data={[
              { value: 'director', label: 'director' },
              { value: 'assistant director', label: 'assistant director' },
              { value: 'flex staff', label: 'flex staff' },
            ]}
            placeholder="Select role"
          />
        ) : (
          <Text size="sm" p={'xs'}>
            {staffMember.staffRole}
          </Text>
        )}
      </Table.Td>

      <Table.Td w={'50%'}>
        {canEdit ? (
          <TextInput {...form.getInputProps(fieldName)} placeholder="Email" />
        ) : (
          <Text size="sm">{staffMember.email}</Text>
        )}
      </Table.Td>

      <Table.Td>
        {!staffMember.owner && <CloseButton onClick={() => onRemove(index)} />}
      </Table.Td>
    </>
  );
};
