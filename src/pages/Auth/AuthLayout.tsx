import { Center, Container, Flex, Group } from '@mantine/core';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Container fluid p="0" h="100vmin">
      <Flex
        w="100%"
        h="xs"
        justify="flex-start"
        align="flex-start"
        px="md"
        pt="md"
        pb="0"
      >
        <Group> </Group>
      </Flex>
      <Center h="100%" w="100%" p="xl">
        <Outlet />
      </Center>
    </Container>
  );
};

export default AuthLayout;
