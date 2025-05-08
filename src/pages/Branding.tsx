import { ReactElement, useState } from 'react';
import { Flex, SegmentedControl, Title, Center, Text, Container } from '@mantine/core';
import { useCustomTheme } from '@hooks/useCustomTheme';

export const Branding = (): ReactElement => { 
  const [value, setValue] = useState('richmun');
  const { updateFontSize, updateTypography, updateTheme } = useCustomTheme();

  return (
    <Container fluid>
        <Flex
        p="lg"
        direction="column"
        align="flex-start"
        justify="flex-start"
        gap="sm"
        >
        <Title>Branding Page!!</Title>
        <SegmentedControl
            value={value}
            onChange={setValue}
            data={[
                { label: 'RichMUN', value: 'richmun' },
                { label: 'SimNATO', value: 'simnato' },
                { label: 'VMUN', value: 'vmun' },
                { label: 'CAIMUN', value: 'caimun' },
                { label: 'CAHSMUN', value: 'cahsmun' },
            ]}
        />
        </Flex>
        <Center>
            <Text>
              preview
            </Text>
        </Center>
    </Container>    
  );
}