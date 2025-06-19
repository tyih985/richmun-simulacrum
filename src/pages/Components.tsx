import { ReactEventHandler, useEffect, useState } from 'react';
import { ActionIcon, Button, Group, FileInput, Image, Loader, Stack } from '@mantine/core';
import { IconPhoto, IconPlus } from '@tabler/icons-react';
import { uploadToCloudinary } from './cloudinary';

type Props = {
  onUploadSuccess: (url: string) => void;
  onChange?: (file: File | null) => void;
};

export const ImageUploader = ({ onChange, onUploadSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  

  const handleUpload = async () => {
    console.log('uploadin!')
    if (!file) return;
    console.log(file)
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      console.log(url)
      onUploadSuccess(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FileInput
            clearable
            value={file}
            onChange={(selectedFile) => {
              setFile(selectedFile);
              if (onChange) onChange(selectedFile);
            }}
            label="Add a flag"
            // disabled={loading}
            placeholder="Upload image"
            leftSection={<IconPhoto size={18} stroke={1.5} />}
            accept=".jpg,.png,.webp"
            />
      <Button onClick={handleUpload} disabled={loading || !file}>
        {loading ? <Loader size="xs" /> : 'Upload'}
      </Button>
    </>
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

