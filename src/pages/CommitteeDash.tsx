import {
  Stack,
  Group,
  Text,
  Button,
  Divider,
  Title,
  Table,
  Container,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CommitteeDoc, DelegateDoc, StaffDoc } from '@features/types';
import { auth } from '@packages/firebase/firebaseAuth';
// import { useDisclosure } from '@mantine/hooks';
// import { StaffModalContent } from './ModalContentStaff';
// import { UNModalContent } from './ModalContentUN';
// import { StaffRow } from './StaffRow';
// import { DelegateRow } from './DelegateRow';
import { committeeQueries } from "@mutations/yeahglo";

export const CommitteeDash = () => {
  const { committeeId } = useParams<{ committeeId: string }>();
  const [loading, setLoading] = useState(true);
  const [committee, setCommittee] = useState<CommitteeDoc | null>(null);
  // const [openedStaffModal, { open: openStaffModal, close: closeStaffModal }] = useDisclosure(false);
  // const [openedDelegateModal, { open: openDelegateModal, close: closeDelegateModal }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      longName: '',
      shortName: '',
      staff: [] as StaffDoc[],
      delegates: [] as DelegateDoc[],
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      longName: (v) => (v.trim() ? null : 'Required'),
      shortName: (v) => (v.trim() ? null : 'Required'),
    },
  });

  useEffect(() => {
    const fetchCommittee = async () => {
      if (!auth.currentUser || !committeeId) {
        setLoading(false);
        return;
      }
      try {
        const data = await committeeQueries.getCommittee(committeeId);
        if (data) {
          setCommittee(data);
          form.setValues({
            longName: data.longName,
            shortName: data.shortName,
            staff: (await committeeQueries.getCommitteeStaff(committeeId)) ?? [],
            delegates: (await committeeQueries.getCommitteeDelegates(committeeId)) ?? [],
            dateRange: [new Date(data.startDate), new Date(data.endDate)],
          });
        }
      } catch (err) {
        console.error("Failed to load committee data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommittee();
  }, [committeeId]);

  if (loading) {
    return (
      <Container>
        <Loader/>
      </Container>
    );
  }

  if (!committee) {
    return (
      <Container>
        <Title>Error: Committee not found</Title>
      </Container>
    );
  }

  const [startDate, endDate] = form.values.dateRange;

  return (
    <Stack p="lg">
      <Group>
        <Stack>
          <Title size="xl">Committee Details</Title>
          <Text size="sm">Overview of your committee</Text>
        </Stack>
        <Button>Launch</Button>
      </Group>

      <Divider />

      <Table striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Field</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Long Name</Table.Td>
            <Table.Td>{form.values.longName}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Short Name</Table.Td>
            <Table.Td>{form.values.shortName}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Start Date</Table.Td>
            <Table.Td>{startDate ? startDate.toLocaleDateString() : '—'}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>End Date</Table.Td>
            <Table.Td>{endDate ? endDate.toLocaleDateString() : '—'}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Stack>
        <Title order={3}>Staff</Title>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Role</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.staff.map((s) => (
              <Table.Tr key={s.id}>
                <Table.Td>{s.staffRole}</Table.Td>
                <Table.Td>{s.email}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <Stack>
        <Title order={3}>Delegates</Title>
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Country</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.delegates.map((d) => (
              <Table.Tr key={d.id}>
                <Table.Td>{d.name}</Table.Td>
                <Table.Td>{d.email}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};