import { ReactElement } from 'react';
import { Stack, Group, Text, Button, Divider, Title, Table } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Delegate, RoleOption, Staff } from '@features/types';
import { committeeMutations } from '@mutations/committeeMutation.ts';
import { ModalContentStaff } from '@features/committeeDash/components/ModalContentStaff.tsx';
import { ModalContentUN } from '@features/committeeDash/components/ModalContentUN.tsx';

const { createCommittee, addStaffToCommittee, addDelegateToCommittee, addUserCommittee } =
  committeeMutations();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CommitteeDash = (): ReactElement => {
  // TODO get the current Committee Info
  const form = useForm({
    initialValues: {
      committeeLongName: '',
      committeeShortName: '',
      staff: [] as Staff[],
      delegates: [] as Delegate[],
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      committeeLongName: (v) => (v.trim() ? null : 'Required'),
      committeeShortName: (v) => (v.trim() ? null : 'Required'),
    },
  });

  


  return (
    <Stack p="lg">
      <Group>
        <Stack flex={1}>
          <Title size="xl">
            Committee
          </Title>
          <Text size="sm">
            Poop
          </Text>
        </Stack>
        <Button>Launch</Button>
      </Group>
                  <Divider></Divider>
                  <Stack m="xl" p="xl">
                                    <Title order={3}>Staff</Title>
                      <Stack p="lg">
                          <Table>
                              <Table.Thead>
                                  <Table.Tr>
                                  <Table.Th>role</Table.Th>
                                  <Table.Th>email</Table.Th>
                                  </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>                            {committeeStaff.map((staff) => (
                                                          <StaffRow staffRole={staff.staffRole} email={staff.email}/>
                                                          ))}
                              </Table.Tbody>
                          </Table>
                          <Button onClick={openStaffModal}>Add Staff</Button>
                      </Stack>
                                    <Title order={3}>Delegates</Title>
                                                          <Stack p="lg">
                          <Table>
                              <Table.Thead>
                                  <Table.Tr>
                                  <Table.Th>country</Table.Th>
                                  <Table.Th>email</Table.Th>
                                  </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>                            {committeeDelegates.map((delegate) => (
                                                          <DelegateRow delegateName={delegate.name} email={delegate.name}/>
                                                          ))}
                              </Table.Tbody>
                          </Table>
                          <Button onClick={openDelegateModal}>Add Delegates</Button>
                      </Stack>
                  </Stack>
    </Stack>
  );
};