import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import {
  Container,
  Flex,
  Title,
  Text,
  Space,
  Table,
  ActionIcon,
  Select,
  CloseButton,
  Modal,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { UseFormReturnType } from '@mantine/form';
import { Staff, SetupFormValues, ROLE_OPTIONS, RoleOption } from '@features/types.ts';
import { auth } from '@packages/firebase/firebaseAuth';
import { useDisclosure } from '@mantine/hooks';
import { StaffModalContent } from './ModalContentStaff';

export interface StepTwoProps {
  ownerRole: RoleOption;
  setOwnerRole: Dispatch<
    SetStateAction<'assistant director' | 'director' | 'flex staff'>
  >;
  form: UseFormReturnType<SetupFormValues>;
}

export function StepTwo({ ownerRole, setOwnerRole, form }: StepTwoProps): ReactElement {
  // State for staff
  const [staffValues, setStaffValues] = useState<string[]>([]);
  const [openedStaffModal, { open: openStaffModal, close: closeStaffModal }] =
    useDisclosure(false);

  const addStaffRows = () => {
    const staffEmails: Staff[] = staffValues.map((email) => ({
      role: 'flex staff', // default role, can be changed later
      email,
    }));

    form.setFieldValue('staff', [...form.values.staff, ...staffEmails]);
    console.log('Added staff rows:', form.values.staff);
    setStaffValues([]);
    closeStaffModal();
  };

  const removeStaffRow = (idx: number) => {
    form.setFieldValue(
      'staff',
      form.values.staff.filter((_, i) => i !== idx),
    );
  };

  const ownerRow = () => (
    <Table.Tr key="owner-row">
      <Table.Td>{auth.currentUser?.email ?? 'You'} (you)</Table.Td>
      <Table.Td>
        <Select
          data={ROLE_OPTIONS}
          value={ownerRole}
          allowDeselect={false}
          onChange={(val) => {
            // Mantine types this as string | null
            if (val) setOwnerRole(val as RoleOption);
          }}
          placeholder="Select your role"
        />
      </Table.Td>
    </Table.Tr>
  );

  const staffRows = form.values.staff.map(({ email, role }, idx) => (
    <Table.Tr key={`${email}-${idx}`}>
      <Table.Td>{email}</Table.Td>
      <Table.Td>
        <Select
          data={['director', 'assistant director', 'flex staff']}
          placeholder="Add staff role here..."
          value={role}
          allowDeselect={false}
          onChange={(role) => {
            const list = [...form.values.staff];
            list[idx].role = (role as Staff['role']) || 'flex staff'; // default to 'flex staff' if role is null
            form.setFieldValue('staff', list);
          }}
        />
      </Table.Td>
      <Table.Td>
        <CloseButton variant="outline" onClick={() => removeStaffRow(idx)} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="sm" p="xl">
      <Modal
        opened={openedStaffModal}
        onClose={closeStaffModal}
        title="Add Staff Members"
        centered
        size="lg"
      >
        <StaffModalContent onTagChange={setStaffValues} onSubmit={addStaffRows} />
      </Modal>
      <Flex direction="column" gap="sm">
        <Title order={3}>2. Add Staff Members</Title>
        <Text size="sm">
          Add the emails of staff members who will be managing your committee.
        </Text>

        <Space h="md" />

        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '50%' }}>Staff</Table.Th>
              <Table.Th>Role</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{[ownerRow(), ...staffRows]}</Table.Tbody>
        </Table>

        <Flex justify="flex-end" mt="md">
          <ActionIcon
            variant="outline"
            size="md"
            aria-label="Add staff"
            onClick={openStaffModal}
          >
            <IconPlus stroke={2.5} />
          </ActionIcon>
        </Flex>
      </Flex>
    </Container>
  );
}
