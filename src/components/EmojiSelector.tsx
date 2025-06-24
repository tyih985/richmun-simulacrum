// EmojiSelector.tsx
import { useState } from 'react';
import { ActionIcon, Popover } from '@mantine/core';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import 'emoji-mart/css/emoji-mart.css';

interface EmojiSelectorProps {
  onSelect: (emoji: string) => void;
  value?: string;
}

export function EmojiSelector({ onSelect, value }: EmojiSelectorProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" shadow="md">
      <Popover.Target>
        <ActionIcon
          onClick={() => setOpened((o) => !o)}
          variant="light"
          size="lg"
          radius="xl"
        >
          {value || '🙂'}
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown p={0}>
        <Picker 
          data={data}
          onEmojiSelect={(emoji: unknown) => {
            const nativeEmoji = (emoji as { native: string }).native;
            onSelect(nativeEmoji); // this is the unicode string (like "🌟")
            setOpened(false);
          }}
          theme="light"
          navPosition="top"/>
      
      </Popover.Dropdown>
    </Popover>
  );
}
