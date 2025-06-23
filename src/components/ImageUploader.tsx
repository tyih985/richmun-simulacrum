import { useState } from 'react';
import { Button, FileInput, Loader } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import { uploadToCloudinary } from '../lib/cloudinary';

type ImageUploaderProps = {
  onUploadSuccess: (url: string) => void;
  onChange?: (file: File | null) => void;
};

export const ImageUploader = ({ onChange, onUploadSuccess }: ImageUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    console.log("uploadin'!");
    if (!file) return;
    console.log(file);
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      console.log(url);
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
