import { ReactElement, useEffect, useRef, useState } from 'react';
import '@mantine/dates/styles.css';
import { useForm } from '@mantine/form';
import { Container, Stack, Button, Flex, Stepper, Box, Loader } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { committeeMutations } from '@mutations/setUpMutation';
import {
  generateCommitteeId,
  generateDelegateId,
  generateStaffId,
} from '@packages/generateIds';
import { auth } from '@packages/firebase/firebaseAuth';
import { StepOne } from '/Users/tyleryih/simulacrum/src/features/setup/components/StepOne.tsx';
import { StepTwo } from '/Users/tyleryih/simulacrum/src/features/setup/components/StepTwo.tsx';
import { StepThree } from '/Users/tyleryih/simulacrum/src/features/setup/components/StepThree.tsx';
import { Delegate, RoleOption, Staff } from 'src/features/types';

const {
  createCommittee,
  addStaffToCommittee,
  addDelegateToCommittee,
  addUserCommittee,
  getOrCreateUidFromEmail,
  ultimateConsoleLog,
} = committeeMutations();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Mock = (): ReactElement => {
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
      if (ownerUid) {
        const ownerStaffId = generateStaffId();
        await addStaffToCommittee(committeeId, ownerStaffId, true, ownerRole, ownerUid);
        await addUserCommittee(ownerUid, committeeId, 'staff');
        console.log('Added owner to committee:', { ownerUid, ownerStaffId, ownerRole });
      }

      // staff
      const staffTasks = form.values.staff.map(async ({ role, email }) => {
        const uid = await getOrCreateUidFromEmail(email);
        console.log(`Using user ${uid} for staff email ${email}.`);

        const staffId = generateStaffId();
        await addStaffToCommittee(committeeId, staffId, false, role, uid);
        if (uid) {
          await addUserCommittee(uid, committeeId, 'staff');
        }
      });

      // delegates
      const delegateTasks = form.values.delegates.map(async ({ country, email }) => {
        const uid = await getOrCreateUidFromEmail(email);
        console.log(`Using user ${uid} for delegate email ${email}.`);

        const delegateId = generateDelegateId(country.name);
        await addDelegateToCommittee(committeeId, delegateId, country.name, uid);
        if (uid) {
          await addUserCommittee(uid, committeeId, 'delegate');
        }
      });

      await Promise.all([...staffTasks, ...delegateTasks]);
      await ultimateConsoleLog();
      form.reset();
      console.log('Form reset; flow complete.');
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
