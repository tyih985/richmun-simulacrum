export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'preset1'); // Your unsigned preset

  const res = await fetch('https://api.cloudinary.com/v1_1/dhobjuujj/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  console.log('Cloudinary response:', data);

  return data.secure_url;
};
