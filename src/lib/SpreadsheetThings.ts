import * as XLSX from 'xlsx';

/**
 * Converts a TSV string to JSON using XLSX.
 */
export function parseTSV(tsv: string): Record<string, string>[] {
  const rows = tsv
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split('\t'));
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
}

/**
 * Reads and parses a spreadsheet file into JSON using XLSX.
 */
export async function parseFile(
  payload: File | null,
): Promise<Record<string, string>[] | null> {
  if (!payload) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { raw: true, defval: '' });
        resolve(json as Record<string, string>[]);
      } catch (err) {
        console.error('Error parsing file:', err);
        reject(err);
      }
    };

    reader.onerror = (err) => {
      console.error('File reading failed:', err);
      reject(err);
    };

    reader.readAsArrayBuffer(payload);
  });
}
