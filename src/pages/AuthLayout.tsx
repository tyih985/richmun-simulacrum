import { Anchor, BackgroundImage, Center, Container, Flex, Group, Image, Paper, Text, useMantineTheme} from "@mantine/core";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useConfig } from "@hooks/useConfig";

const AuthLayout = () => {
    const config = useConfig();
    const theme = useMantineTheme();
    return (
         <Container fluid p="0" h="100vh">
          <BackgroundImage
            h="100%"
            w="100%"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
          >
            <Flex w="100%" h="xs" justify="flex-start" align="flex-start" px="md" pt="md" pb="0">
                <Group>
                  <Image
                  w="lg"
                  src={config?.icon_192_url}
                  />
                  <Text c={theme.colors.primary[7]}>
                    Simulacrum
                  </Text>
                </Group>
            </Flex>
            <Center h="100%" w="100%" p="xl">
              <Paper
                p="xl"
                h="600px"
                w="450px"
                radius="lg"
                shadow="md"
              >
                <Outlet />
              </Paper>
            </Center>
          </BackgroundImage>
        </Container>
    );
};

export default AuthLayout;