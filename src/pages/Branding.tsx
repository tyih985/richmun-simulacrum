import { ReactElement, useEffect, useState } from 'react';
import {
  Flex,
  SegmentedControl,
  Title,
  Center,
  Text,
  Container,
  Button,
  Image,
  Paper,
  Stack,
  Group,
  Divider,
  Affix,
} from '@mantine/core';
import { useCustomTheme } from '@hooks/useCustomTheme';
import { RuntimeThemeProps } from '@packages/themeGenerator';
import { RuntimeEnvironmentConfig } from '@runtime/types';

const themes: Record<string, RuntimeThemeProps & Partial<Pick<RuntimeEnvironmentConfig, 'logo_url'>>> = {
  "RichMUN": {
    theme_colors: {
      primaryColor: '#73d5d0',
    },
    fontFamily: "Lato",
    headings: {
      fontFamily: "Josefin Sans",
    },
  logo_url: "https://scontent.fyvr1-1.fna.fbcdn.net/v/t39.30808-6/249005754_4842225659129970_617253638307000008_n.png?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pxIn8NtBTHoQ7kNvwEM-N-9&_nc_oc=AdnlkpKzSkTLZgAeDz_cZaQSotgMZGCMCHdt-hac6kBieDhb2Go2Odqg13bX9VCr-4Q&_nc_zt=23&_nc_ht=scontent.fyvr1-1.fna&_nc_gid=B9i6RDpBxchlk3T1Kn7fkQ&oh=00_AfI-9clrHmmTJ-oGnm9X8KtlU1tv7slnzxj_5vehFP4Pig&oe=6822F6B1",
  },
  "SimNATO": {
    theme_colors: {
      primaryColor: '#202664',
    },
    fontFamily: 'Plus Jakarta Sans, serif',
    headings: {
      fontFamily: "Philosopher",
    },
    logo_url: "https://simnato.ca/logo.png"
  },
  "VMUN": {
    theme_colors: {
      primaryColor: '#498ebb',
    },
    fontFamily: 'MinionPro-Regular, serif',
    headings: {
      fontFamily: "TrajanPro-Bold, serif",
    },
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Vancouver_Model_United_Nations.png/960px-Vancouver_Model_United_Nations.png?20111203061606"
  },
  "CAIMUN": {
    theme_colors: {
      primaryColor: '#ca1212',
    },
    fontFamily: 'arno-pro, serif',
    headings: {
      fontFamily: "adobe-garamond-pro, serif",
    },
    logo_url: "https://images.squarespace-cdn.com/content/610c60242d9ef15f1ce4bb7a/f6ac17f5-b0de-43a3-8577-723940827681/logo.png?content-type=image%2Fpng"
  },
  "CAHSMUN": {
    theme_colors: {
      primaryColor: '#6d2929',
    },
    fontFamily: 'proxima-nova, sans-serif',
    headings: {
      fontFamily: "proxima-nova, sans-serif",
    },
    logo_url: "https://images.squarespace-cdn.com/content/v1/57b632432994cab0b44562ae/0bc43d30-1c50-4712-b90a-2b8f41b5c02c/CAHSMUN_Red_Logo_Transparent.png?format=1500w"
  },
};


export const Branding = (): ReactElement => {
  const [brandSelection, setBrandSelection] = useState<string>('RichMUN');
  const { updateTheme } = useCustomTheme();

  useEffect(() => {
    updateTheme(themes[brandSelection]);
  }, [brandSelection, updateTheme]);

  return (
    <Container fluid size="lg">
      <Stack p="lg" align="flex-start" justify="flex-start" gap="sm">
        <Group >
          <Image w={'xl'} src={themes[brandSelection].logo_url} alt="Logo" />
           <Title>{brandSelection} Simulacrum</Title>
        </Group>
        <Affix position={{ top: 20, right: 20 }}>
        <SegmentedControl
          value={brandSelection}
          onChange={(value) => setBrandSelection(value)}
          data={[
            { label: 'RichMUN', value: 'RichMUN' },
            { label: 'SimNATO', value: 'SimNATO' },
            { label: 'VMUN', value: 'VMUN' },
            { label: 'CAIMUN', value: 'CAIMUN' },
            { label: 'CAHSMUN', value: 'CAHSMUN' },
          ]}
        />
      </Affix>
        
        <Divider></Divider>
      </Stack>
      
      <Stack w={'100%'}>
        <Group w="100%" p="lg">
          <Text c={'primary'} size='xl'>Customize, right before your eyes!</Text>
        </Group>
        <Divider></Divider>
        <Text>
          
          Current brand: <strong>{brandSelection}</strong> — theme preview
        </Text>
        <Button>Button</Button>
      </Stack>
    </Container>
  );
};