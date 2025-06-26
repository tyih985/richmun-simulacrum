import { CountryMultiSelect } from "@components/CountryMultiSelect";
import { ImageUploader } from "@components/ImageUploader";
import { parseFile } from "@lib/SpreadsheetThings";
import { Button, FileInput, Group, SegmentedControl, Stack, TagsInput, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconFileSpreadsheet } from "@tabler/icons-react";
import { on } from "events";
import { ReactElement, useEffect, useState } from "react";
import { Country } from "src/features/types";


type DelegateModalProps = {
  dropdownData: Country[];
  onSubmit: () => void;
};

export const StaffModalContent = (props: DelegateModalProps): ReactElement => {
  const { dropdownData, onSubmit } = props;

  const form = useForm({
    initialValues: {
        countries: [] as string[],
    }
  });

  return (
    <Stack p="lg">
      <CountryMultiSelect
        dropdownData={dropdownData}
        value={form.values.countries}
        onChange={(values) => form.setFieldValue('countries', values)}
      ></CountryMultiSelect>
      <Group justify="center">
        <Button onClick={onSubmit} disabled={form.values.countries.length === 0}>
          Submit countries
        </Button>
      </Group>
    </Stack>
    
  );
}