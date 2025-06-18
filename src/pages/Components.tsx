import { useState } from 'react';
import { ActionIcon, Button, Group, FileInput, Image, Loader, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { uploadToCloudinary } from './cloudinary';

export const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setUrl(uploadedUrl);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack>
      <FileInput value={file} onChange={setFile} label="Choose an image" accept="image/*" />
      <Button onClick={handleUpload} disabled={!file || loading}>
        Upload to Cloudinary
      </Button>
      {loading && <Loader />}
      {url && <Image src={url} alt="Uploaded" width={300} />}
    </Stack>
  );
};


export function ExpandableButton({
  onClick,
  onFirst,
  onSecond,
  onThird,
}: {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFirst?: React.MouseEventHandler<HTMLButtonElement>;
  onSecond?: React.MouseEventHandler<HTMLButtonElement>;
  onThird?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Group
      gap="xs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      
      {hovered ? (
        <Group
        grow
        >
          <Button size="xs" color="blue" onClick={onFirst} >+UN country</Button>
          <Button size="xs" color="green" onClick={onSecond} >+custom</Button>
          <Button size="xs" color="red" onClick={onThird} >+spreadsheet</Button>
        </Group>
      ) : (
        <ActionIcon
        variant="outline"
        aria-label="Add"
        onClick={onClick}
        size="md"
      ><IconPlus style={{ width: '70%', height: '70%' }} stroke={2.5} /></ActionIcon>
      )
      }
    </Group>
  );
}

