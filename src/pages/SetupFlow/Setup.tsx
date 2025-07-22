import { ReactElement, useEffect, useRef, useState } from 'react';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import { Container, Stack, Button, Flex, Stepper, Box, Loader } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { committeeMutations } from '@mutations/committeeMutation.ts';
import { generateCommitteeId, generateStaffId } from '@packages/generateIds';
import { auth } from '@packages/firebase/firebaseAuth';
import { StepOne } from '@features/setup/components/StepOne.tsx';
import { StepTwo } from '@features/setup/components/StepTwo.tsx';
import { StepThree } from '@features/setup/components/StepThree.tsx';
import { DelegateDoc, RoleOption, StaffDoc } from '@features/types';
import { useNavigate } from 'react-router-dom';

const { createCommittee, addStaffToCommittee, addDelegateToCommittee, addUserCommittee } =
  committeeMutations();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Setup = (): ReactElement => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      committeeLongName: '',
      committeeShortName: '',
      staff: [] as StaffDoc[],
      delegates: [] as DelegateDoc[],
      dateRange: [null, null] as [Date | null, Date | null],
    },
    validate: {
      committeeLongName: (v) => (v.trim() ? null : 'Required'),
      committeeShortName: (v) => (v.trim() ? null : 'Required'),
    },
  });

  // State for owner role
  const [ownerRole, setOwnerRole] = useState<RoleOption>('director');

  // State for loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // committee
      const committeeId = generateCommitteeId(form.values.committeeShortName.trim());
      const [startDate, endDate] = form.values.dateRange;
      await createCommittee(
        committeeId,
        form.values.committeeLongName,
        form.values.committeeShortName,
        startDate!,
        endDate!,
      );

      const ownerUid = auth.currentUser?.uid || '';
      const ownerEmail = auth.currentUser?.email?.toLowerCase() || '';
      if (ownerEmail) {
        const ownerStaffId = generateStaffId();
        await addStaffToCommittee(
          committeeId,
          ownerStaffId,
          true,
          ownerRole,
          ownerEmail,
          'accepted',
        );
        await addUserCommittee(ownerUid, committeeId, 'staff', ownerStaffId, 'accepted');
        console.log('Added owner to committee:', { ownerUid, ownerStaffId, ownerRole });
      }

      // staff
      const staffTasks = form.values.staff.map(async ({ staffRole, email }) => {
        const staffId = generateStaffId();
        await addStaffToCommittee(
          committeeId,
          staffId,
          false,
          staffRole,
          email.trim().toLowerCase(),
          'pending',
        );
      });

      // delegates
      const delegateTasks = form.values.delegates.map(async (d) => {
        console.log('delegate:', d);
        if (!d) return;
        console.log('delegate:', { committeeId, d });
        await addDelegateToCommittee(
          committeeId,
          d.id,
          d.name,
          d.email.trim().toLowerCase(),
          'pending',
        );
      });

      await Promise.all([...staffTasks, ...delegateTasks]);
      // await ultimateConsoleLog();
      form.reset();
      console.log('Form reset; flow complete.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  // State for flag things
  // const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // // State for CSV output from PasteToCSV
  // const [csv, setCsv] = useState('');

  // Enter key to blur active element ?? idk how useful this will be
  const multiSelectRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // Only blur if this MultiSelect is focused
        if (
          document.activeElement === multiSelectRef.current ||
          multiSelectRef.current?.contains(document.activeElement)
        ) {
          multiSelectRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // State for stepper
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));

  return (
    <Container size="md" p="xl" h={'100vh'}>
      <Flex direction="column" gap="md" h="100%" w="100%" py="xl">
        <Box component="form" onSubmit={handleSubmit}>
          <Stack flex={1} justify="flex-start" align="center">
            <Stepper
              active={active}
              onStepClick={setActive}
              allowNextStepsSelect={false}
              w={'100%'}
              h={'100%'}
            >
              <Stepper.Step label="First step" description="Basic Information" h={'100%'}>
                <StepOne form={form} />
              </Stepper.Step>
              <Stepper.Step label="Second step" description="Add Staff Members">
                <StepTwo ownerRole={ownerRole} setOwnerRole={setOwnerRole} form={form} />
              </Stepper.Step>
              <Stepper.Step label="Final step" description="Add Countries + Delegates">
                <StepThree form={form} />
              </Stepper.Step>
              <Stepper.Completed>
                Completed, click back button to get to previous step
              </Stepper.Completed>
            </Stepper>
          </Stack>
        </Box>

        <Flex flex={1} justify="flex-end" align="flex-end" py={'md'}>
          {loading ? (
            <Loader size="sm" />
          ) : active === 2 ? (
            <>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  !form.isValid() ||
                  !form.values.committeeLongName.trim() ||
                  !form.values.committeeShortName.trim() ||
                  !form.values.dateRange[0] ||
                  !form.values.dateRange[1] ||
                  form.values.delegates.some(
                    (d) => d.email.trim() !== '' && !emailRegex.test(d.email),
                  )
                }
              >
                Complete
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              rightSection={<IconArrowRight size={18} stroke={1.5} />}
              onClick={nextStep}
              disabled={
                !form.isValid() ||
                !form.values.committeeLongName.trim() ||
                !form.values.committeeShortName.trim() ||
                !form.values.dateRange[0] ||
                !form.values.dateRange[1]
              }
            >
              Next step
            </Button>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
