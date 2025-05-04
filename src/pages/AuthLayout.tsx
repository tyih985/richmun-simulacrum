import { Anchor, BackgroundImage, Center, Container, Paper } from "@mantine/core";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
         <Container fluid p="0" h="100vh">
              <BackgroundImage
                h="100%"
                w="100%"
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
              >
                <Center h="100%" w="100%">
                  <Paper
                    p="xl"
                    h="625px"
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