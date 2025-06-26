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
  onSubmit: () => void;
};

export const CustomModalContent = (props: DelegateModalProps): ReactElement => {
  const { onSubmit } = props;

  const form = useForm({
    initialValues: {
        countries: [] as string[],
    }
  });

  return (
      <Stack>
        <TextInput
          label="Add custom country"
          placeholder="e.g. Candyland" // this is kinda wordy lmao but alas
          {...form.getInputProps('countries')}
          onChange={() => {
            const customValues = form.values.countries.map((v) => v.trim()).filter((v) => v !== '');
            form.setFieldValue('countries', customValues);
          }}
          required
          autoFocus
        />
        <TextInput
          label="Alias for the country (optional)"
          placeholder="e.g. 'United States' can be 'USA'"
        />
        {/* <EmojiPicker></EmojiPicker> */}
        {/* <TextInput
        label="Add custom country"
        placeholder="Type a country name"
        /> */}
        {/* {<ImageUploader
          onChange={}
          onUploadSuccess={}
        />
        {uploadedUrl && <Image w={'200px'} radius="md" src={uploadedUrl} />}} */}

        <Group justify="center">
          <Button disabled={form.values.countries.length === 0} onClick={onSubmit}>
            Submit countries
          </Button>
        </Group>
      </Stack>
  );
}