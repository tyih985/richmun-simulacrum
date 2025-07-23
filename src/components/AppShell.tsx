import {
  AppShell,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';

export const CommitteeAppShell = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const { committeeId } = useParams();
  const location = useLocation();

  const links = [
    { label: 'Dashboard', to: `/committee/${committeeId}` },
    { label: 'Speakers', to: `/committee/${committeeId}/speakers` },
    { label: 'Directive History', to: `/committee/${committeeId}/directive/history` },
    { label: 'Directive Inbox', to: `/committee/${committeeId}/directives` },
    { label: 'Make Directive', to: `/committee/${committeeId}/directive/make` },
    { label: 'Motions', to: `/committee/${committeeId}/motions` },
    { label: 'Roll Call', to: `/committee/${committeeId}/rollcall` },
  ];


  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>Committee</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {links.map((link) => (
            <NavLink
              key={link.label}
              label={link.label}
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
