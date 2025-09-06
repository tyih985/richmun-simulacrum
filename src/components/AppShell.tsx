import { useCommittee, useUserIsStaff } from '@hooks/useNewStuff';
import { AppShell, Burger, Group, NavLink, ScrollArea, Title, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { auth } from '@packages/firebase/firebaseAuth';
import { IconChecklist, IconDashboard, IconInbox, IconPencil, IconUsersGroup, IconWriting } from '@tabler/icons-react';
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';

export const CommitteeAppShell = () => {
  const uid = auth.currentUser!.uid
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const { committeeId } = useParams();
  const location = useLocation();
  const { isStaff, loading } = useUserIsStaff(uid, committeeId!)
  const { committee, loading: committeeLoading } = useCommittee(committeeId)

  type NavLinkItem = { label: string; to: string, icon: React.ReactNode };

  const links: NavLinkItem[] = [
    { label: 'Dashboard', to: `/committee/${committeeId}`, icon: <IconDashboard/>},
    ...(isStaff ? [{ label: 'Speakers', to: `/committee/${committeeId}/speakers`, icon: <IconUsersGroup/> }] : []),
    // ...(isStaff ? [{ label: 'Directive History', to: `/committee/${committeeId}/directives/history` }] : []),
    { label: 'Inbox', to: `/committee/${committeeId}/directives`, icon:  <IconInbox/> },
    ...(!isStaff ? [{ label: 'Directive', to: `/committee/${committeeId}/directives/new`, icon: <IconWriting/> }] : []),
    ...(isStaff ? [{ label: 'Motions', to: `/committee/${committeeId}/motions`, icon: <IconPencil/> }] : []), // idk what icon to use here lmao
    ...(isStaff ? [{ label: 'Roll Call', to: `/committee/${committeeId}/rollcall/list`, icon: <IconChecklist/> }] : []),
  ];

  if (loading) return null; // or show a loader

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 180,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {/* <Title order={3}>Committee</Title> */}
          <Title order={3}>{committee?.shortName}</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {links.map((link) => (
            <NavLink
              key={link.label}
              label={
                <Group>
                  <>{link.icon}</>
                  <Text>{link.label}</Text>
                </Group>
                
              }
              onClick={() => navigate(link.to)}
              active={location.pathname === link.to}
            />
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
