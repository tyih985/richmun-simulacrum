import { CountryMultiSelect } from "@components/CountryMultiSelect";
import { ImageUploader } from "@components/ImageUploader";
import { parseFile } from "@lib/SpreadsheetThings";
import { Button, FileInput, Group, SegmentedControl, Select, Stack, TagsInput, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconFileSpreadsheet } from "@tabler/icons-react";
import { on } from "events";
import { ReactElement, useEffect, useState } from "react";
import { Country } from "src/features/types";


type DelegateModalProps = {
  onPaste: React.ClipboardEventHandler<HTMLTextAreaElement>;
  onSubmit: () => void;
};

export const StaffModalContent = (props: DelegateModalProps): ReactElement => {
  const { onPaste, onSubmit } = props;

  const [segVal, setSegVal] = useState<'paste from spreadsheet' | 'import file'>('paste from spreadsheet');
  const [loading, setLoading] = useState(false);
  const [importedValues, setImportedValues] = useState<Record<string, string>[]>([]);
  const [countryCol, setCountryCol] = useState<string | null>(null);
  const [delegateCol, setDelegateCol] = useState<string | null>(null);
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);

  function extractHeaders(data: Record<string, string>[]): string[] {
    if (!data.length) return [];

    const headers = Object.keys(data[0]);
    setSheetHeaders(headers);

    if (headers.includes('Country')) setCountryCol('Country');
    if (headers.includes('Delegate')) setDelegateCol('Delegate');

    return headers;
  }

  function readImported(json: Record<string, string>[]) {
    if (!json.length) return;

    extractHeaders(json);
    setImportedValues(json);
  }

  return (
      <Stack>
        <SegmentedControl
          data={['paste from spreadsheet', 'import file']}
          onChange={(value) =>
            setSegVal(value as 'paste from spreadsheet' | 'import file')
          }
          value={segVal}
        />
        {segVal === 'paste from spreadsheet' && (
          <Textarea
            label="Paste spreadsheet data"
            placeholder="Paste here..."
            autosize
            onPaste={onPaste}
          />
        )}
        {segVal === 'import file' && (
          <>
            <Text size="sm" c="dimmed">
              Upload a spreadsheet file with columns for Country and Delegate. The
              first row should contain headers.
            </Text>
            <FileInput
              clearable
              label="Import spreadsheet"
              placeholder="Upload spreadsheet"
              leftSection={<IconFileSpreadsheet size={18} stroke={1.5} />}
              onChange={(file) => {
                if (!file) return;
                // setLoading(true);
                parseFile(file)
                  .then((data) => {
                    if (!data) {
                      console.warn('No data parsed from file.');
                      return;
                    }
                    readImported(data);
                    // setLoading(false);
                  })
                  .catch((err) => {
                    console.error('Error parsing file:', err);
                    // setLoading(false);
                  });
              }}
              accept=".xlsx,.xls,.csv"
            />
          </>
        )}

        {importedValues.length > 0 && (
          <Group grow>
            <Select
              label="Which column is Country?"
              data={sheetHeaders}
              value={countryCol}
              onChange={setCountryCol}
              placeholder="Choose column"
            />

            <Select
              label="Which column is Delegate?"
              data={sheetHeaders}
              value={delegateCol}
              onChange={setDelegateCol}
              placeholder="Choose column"
            />
          </Group>
        )}

        <Group justify="center">
          <Button onClick={onSubmit}>
            Submit countries
          </Button>
        </Group>
      </Stack>
  );
}