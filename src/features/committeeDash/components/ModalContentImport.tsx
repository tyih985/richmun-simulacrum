import { parseFile, parseTSV } from '@lib/SpreadsheetThings';
import {
  Button,
  FileInput,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { IconFileSpreadsheet } from '@tabler/icons-react';
import { ReactElement, useState } from 'react';
import { Country, DelegateDoc } from '@features/types';
import { generateDelegateId } from '@packages/generateIds';
import { countriesHash } from '@lib/countriesData';

type DelegateModalProps = {
  availableCountries: Country[];
  setAvailableCountries: (countries: Country[]) => void;
  existingCountries: Set<Country>;
  addRows: (newDelegates: DelegateDoc[]) => void;
};

export const ImportSheetContent = (props: DelegateModalProps): ReactElement => {
  const { availableCountries, setAvailableCountries, existingCountries, addRows } = props;

  const [segVal, setSegVal] = useState<'paste from spreadsheet' | 'import file'>(
    'paste from spreadsheet',
  );

  const [importedValues, setImportedValues] = useState<Record<string, string>[]>([]);
  const [countryCol, setCountryCol] = useState<string | null>(null);
  const [delegateCol, setDelegateCol] = useState<string | null>(null);
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);

  const handleSubmit = () => {
    const newDelegates = transformData(importedValues);
    addRows(newDelegates);

    setAvailableCountries(
      availableCountries.filter((c) => !newDelegates.some((d) => countriesHash[d.name] === c)),
    );
    setImportedValues([]);
  };

  function transformData(data: Record<string, unknown>[]): DelegateDoc[] {
    if (!Array.isArray(data)) {
      console.warn('No new delegates to add.');
      return [];
    }

    const mappedData = data.map((row) => {
      const country =
        countryCol && typeof row[countryCol] === 'string' ? row[countryCol].trim() : '';
      const email =
        delegateCol && typeof row[delegateCol] === 'string'
          ? row[delegateCol].trim()
          : '';
      return {
        id: generateDelegateId(country),
        name: country,
        email: email, 
        inviteStatus: 'pending',
        minutes: 0,
        positionPaperSent: false,
        spoke: false,
      } as DelegateDoc;
    });

    console.log('mapped:', mappedData);

    const filteredData = mappedData.filter(
      (d) =>
        countriesHash[d.name]&&
        !Array.from(existingCountries).some((c) => c.name === d.name),
    );

    console.log('filtered:', filteredData);

    return filteredData;
  }

  function extractHeaders(data: Record<string, string>[]): string[] {
    if (!data.length) return [];

    const headers = Object.keys(data[0]);
    console.log('headers:', headers);
    setSheetHeaders(headers);

    if (headers.includes('Country')) setCountryCol('Country');
    if (headers.includes('Delegate')) setDelegateCol('Delegate');

    return headers;
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const raw = event.clipboardData.getData('Text');
    const json = parseTSV(raw);
    console.log('Parsed JSON from pasted:', json);
    extractHeaders(json);
    setImportedValues(json);
  };

  return (
    <Stack>
      <SegmentedControl
        data={['paste from spreadsheet', 'import file']}
        onChange={(value) => setSegVal(value as 'paste from spreadsheet' | 'import file')}
        value={segVal}
      />
      {segVal === 'paste from spreadsheet' && (
        <Textarea
          label="Paste spreadsheet data"
          placeholder="Paste here..."
          autosize
          onPaste={handlePaste}
        />
      )}
      {segVal === 'import file' && (
        <>
          <Text size="sm" c="dimmed">
            Upload a spreadsheet file with columns for Country and Delegate. The first row
            should contain headers.
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
                  extractHeaders(data);
                  setImportedValues(data);

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

      {sheetHeaders && (
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
        <Button onClick={handleSubmit}>Submit countries</Button>
      </Group>
    </Stack>
  );
};
