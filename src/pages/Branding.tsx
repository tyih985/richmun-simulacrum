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
  TextInput,
  Slider,
  useMantineTheme,
  SimpleGrid,
  Space,
} from '@mantine/core';
import { useCustomTheme } from '@hooks/useCustomTheme';
import { RuntimeThemeProps } from '@packages/themeGenerator';
import { RuntimeEnvironmentConfig } from '@runtime/types';
import { useMediaQuery } from '@mantine/hooks';

const themes: Record<
  string,
  RuntimeThemeProps & Partial<Pick<RuntimeEnvironmentConfig, 'logo_url'>>
> = {
  RichMUN: {
    theme_colors: {
      primaryColor: '#73d5d0',
    },
    fontFamily: 'Lato',
    headings: {
      fontFamily: 'Josefin Sans',
    },
    logo_url:
      'https://scontent.fyvr1-1.fna.fbcdn.net/v/t39.30808-6/249005754_4842225659129970_617253638307000008_n.png?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pxIn8NtBTHoQ7kNvwEM-N-9&_nc_oc=AdnlkpKzSkTLZgAeDz_cZaQSotgMZGCMCHdt-hac6kBieDhb2Go2Odqg13bX9VCr-4Q&_nc_zt=23&_nc_ht=scontent.fyvr1-1.fna&_nc_gid=B9i6RDpBxchlk3T1Kn7fkQ&oh=00_AfI-9clrHmmTJ-oGnm9X8KtlU1tv7slnzxj_5vehFP4Pig&oe=6822F6B1',
  },
  SimNATO: {
    theme_colors: {
      primaryColor: '#202664',
    },
    fontFamily: 'Plus Jakarta Sans, serif',
    headings: {
      fontFamily: 'Philosopher',
    },
    logo_url: 'https://simnato.ca/logo.png',
  },
  VMUN: {
    theme_colors: {
      primaryColor: '#498ebb',
    },
    fontFamily: 'MinionPro-Regular, serif',
    headings: {
      fontFamily: 'TrajanPro-Bold, serif',
    },
    logo_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Vancouver_Model_United_Nations.png/960px-Vancouver_Model_United_Nations.png?20111203061606',
  },
  CAIMUN: {
    theme_colors: {
      primaryColor: '#ca1212',
    },
    fontFamily: 'arno-pro, serif',
    headings: {
      fontFamily: 'adobe-garamond-pro, serif',
    },
    logo_url:
      'https://images.squarespace-cdn.com/content/610c60242d9ef15f1ce4bb7a/f6ac17f5-b0de-43a3-8577-723940827681/logo.png?content-type=image%2Fpng',
  },
  CAHSMUN: {
    theme_colors: {
      primaryColor: '#6d2929',
    },
    fontFamily: 'proxima-nova, sans-serif',
    headings: {
      fontFamily: 'proxima-nova, sans-serif',
    },
    logo_url:
      'https://images.squarespace-cdn.com/content/v1/57b632432994cab0b44562ae/0bc43d30-1c50-4712-b90a-2b8f41b5c02c/CAHSMUN_Red_Logo_Transparent.png?format=1500w',
  },
};

export const Branding = (): ReactElement => {
  const [brandSelection, setBrandSelection] = useState<string>('RichMUN');
  const { updateFontSize, updateTheme } = useCustomTheme();
  const theme = useMantineTheme();
  const smallerThanMd = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const marks = [
    { value: 10, label: 'xs' },
    { value: 30, label: 'sm' },
    { value: 50, label: 'md' },
    { value: 70, label: 'lg' },
    { value: 90, label: 'xl' },
  ];
  const [radiusValue, setRadiusValue] = useState('md');
  const [fontSize, setFontSize] = useState(100);

useEffect(() => {
    updateTheme({
      ...themes[brandSelection],
      defaultBorderRadius: radiusValue,
      borderRadiusScale: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
    });
    updateFontSize(fontSize);
  }, [brandSelection, radiusValue, fontSize, updateTheme, updateFontSize]);

    const handleRadiusChange = (value: number) => {
      const selectedMark = marks.find((mark) => mark.value === value);
      if (selectedMark) {
        setRadiusValue(selectedMark.label);
      }
    };

  return (
    <Container fluid size="lg" py="xl">
      <Group>
        <Image w={'xl'} src={themes[brandSelection].logo_url} alt="Logo" />
        <Title>{brandSelection} Simulacrum</Title>
      </Group>
      <Affix position={{ bottom: 20, right: 20 }}>
        <SegmentedControl
          orientation="vertical"
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
      <Divider my="lg" />

      <Text c={'primary'} size="lg">
        You can customize, right before your eyes!
      </Text>
      <Text c={'dimmed'} size="sm">
        This is a preview of how your layout will look.
      </Text>
      <Space p={'md'}></Space>

      <SimpleGrid w="100%" h="100%" cols={smallerThanMd ? 1 : 2} spacing="xl" p="xl">
        <Stack justify="flex-start" p="lg" gap="sm" h={'100%'}>
          <TextInput size="md" label="Your text here" placeholder="Type something…" />
          <Button size="md" fullWidth>Action Button</Button>
        </Stack>

        <Stack justify="flex-start" p="lg" gap="sm" h={'100%'}>
          <Text size="sm">Radius</Text>
          <Slider
            defaultValue={50}
            onChange={handleRadiusChange}
            label={(val) => marks.find((mark) => mark.value === val)!.label}
            restrictToMarks={true}
            marks={marks}
          />
          <Space p={'md'}></Space>
          <Text size="sm">Font Size</Text>
          <Slider
            value={fontSize}
            onChange={setFontSize}
            min={80}
            max={120}
            marks={[
              { value: 80, label: '80%' },
              { value: 100, label: '100%' },
              { value: 120, label: '120%' },
            ]}
          />
        </Stack>
      </SimpleGrid>
    </Container>
  );
};
