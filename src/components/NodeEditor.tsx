import { ReactElement, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Text,
  Textarea,
  ColorPicker,
  ActionIcon,
  TextInput,
  Popover,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconUpload, IconPhoto, IconPalette, IconEye } from '@tabler/icons-react';
import { PinNodeData } from '@types';

interface NodeEditorProps {
  onChange?: (data: Partial<PinNodeData>) => void; // real-time
  onPublish?: (data: Partial<PinNodeData>) => void; // button behaviour
  initialContent?: string;
  initialColor?: string;
}

export const NodeEditor = ({
  onChange,
  onPublish,
  initialContent = '',
  initialColor = '#FF5733',
}: NodeEditorProps): ReactElement => {
  const [content, setContent] = useState(initialContent);
  const [color, setColor] = useState(initialColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const debouncedOnChange = useDebouncedCallback((data: Partial<PinNodeData>) => {
    onChange?.(data);
  }, 500);

  const handleContentChange = (value: string) => {
    setContent(value);
    if (onChange) {
      debouncedOnChange({ text: value, color });
    }
  };

  const handleColorChange = (value: string) => {
    setColor(value);
    if (onChange) {
      debouncedOnChange({ text: content, color: value });
    }
  };

  const handleBlur = () => {
    if (onChange) {
      debouncedOnChange.flush();
      onChange({ text: content, color });
    }
  };

  const handlePublish = () => {
    if (!content.trim()) return;

    onPublish?.({
      text: content,
      color,
    });

    // Reset form after publish
    setContent('');
  };

  return (
    <Card
      shadow="md"
      p="sm"
      radius="xl"
      withBorder
      style={{ width: '100%', maxWidth: '800px', position: 'relative' }}
    >
      <Flex align="flex-start" gap="sm">
        {/* Left section: Color/Icon selector */}
        <Popover position="top" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon
              size="lg"
              color={color}
              variant="filled"
              onClick={() => {
                console.log('click!', { showColorPicker });
                setShowColorPicker((prev) => !prev);
              }}
            >
              <IconPalette size={18} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <ColorPicker
              format="hex"
              value={color}
              onChange={handleColorChange}
              onChangeEnd={handleBlur}
            />
          </Popover.Dropdown>
        </Popover>

        {/* Center section: Text editor */}
        <TextInput
          placeholder="Add your note here..."
          value={content}
          onChange={(e) => handleContentChange(e.currentTarget.value)}
          onBlur={handleBlur}
          style={{ flexGrow: 1 }}
          rightSection={
            <ActionIcon
              size="lg"
              variant="white"
              color="gray"
              title="Upload image (not implemented)"
              onClick={(e) => console.log('click!', e)}
            >
              <IconPhoto size={18} />
            </ActionIcon>
          }
        />

        <Button
          color="primary"
          onClick={handlePublish}
          disabled={!content.trim()}
          style={{ marginTop: 'auto' }}
        >
          <IconEye />
        </Button>
      </Flex>
    </Card>
  );
};
