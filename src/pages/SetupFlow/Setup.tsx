import { Box, Container, Flex, Modal, Stepper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ReactElement } from "react";
import { Delegate, Staff } from "src/features/types.ts";

export const Setup = (): ReactElement => {
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

    const handleSubmit = async () => {}
      
    return (
        <Container size="md" p="xl" h={'100vh'}>
            <Modal
                opened={true}
                onClose={() => {}}
            >
                // modal content
            </Modal>
            <Modal
                opened={true}
                onClose={() => {}}>
                // modal content
            </Modal>
            <Flex direction="column" gap="md" h="100%" w="100%" py="xl">
                    <Box component="form" onSubmit={handleSubmit}>
                      <Flex flex={1} justify="flex-start" align="center" direction="column" gap="sm">
                        <Stepper children={undefined} active={0}>
                
                        </Stepper>
                    </Flex>

                    </Box>
            </Flex>
        </Container>
    );
}

// const handleSubmit = async () => {
//           setLoading(true);
//           try {
//             // committee
//             const committeeId = generateCommitteeId(form.values.committeeShortName.trim());
//             const [startDate, endDate] = form.values.dateRange;
//             await createCommittee(
//               committeeId,
//               form.values.committeeLongName,
//               form.values.committeeShortName,
//               startDate!,
//               endDate!,
//             );
      
//             const ownerUid = auth.currentUser?.uid || '';
//             if (ownerUid) {
//               const ownerStaffId = generateStaffId();
//               await addStaffToCommittee(committeeId, ownerStaffId, true, ownerRole, ownerUid);
//               await addUserCommittee(ownerUid, committeeId, 'staff');
//               console.log('Added owner to committee:', { ownerUid, ownerStaffId, ownerRole });
//             }
      
//             // staff
//             const staffTasks = form.values.staff.map(async ({ role, email }) => {
//               const uid = await getOrCreateUidFromEmail(email);
//               console.log(`Using user ${uid} for staff email ${email}.`);
      
//               const staffId = generateStaffId();
//               await addStaffToCommittee(committeeId, staffId, false, role, uid);
//               if (uid) {
//                 await addUserCommittee(uid, committeeId, 'staff');
//               }
//             });
      
//             // delegates
//             const delegateTasks = form.values.delegates.map(async ({ country, email }) => {
//               const uid = await getOrCreateUidFromEmail(email);
//               console.log(`Using user ${uid} for delegate email ${email}.`);
      
//               const delegateId = generateDelegateId(country);
//               await addDelegateToCommittee(committeeId, delegateId, country, uid);
//               if (uid) {
//                 await addUserCommittee(uid, committeeId, 'delegate');
//               }
//             });
      
//             await Promise.all([...staffTasks, ...delegateTasks]);
//             await ultimateConsoleLog();
//             form.reset();
//             console.log('Form reset; flow complete.');
//           } catch (err) {
//             console.error('Error in handleSubmit:', err);
//           } finally {
//             setLoading(false);
//           }
//         };