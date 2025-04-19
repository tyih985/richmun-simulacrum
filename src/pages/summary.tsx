import { ReactElement } from 'react';
import { Box, Button, rem, Select, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { useSelectedFocus } from '@hooks/useSelectedFocus';
import TextbookReaderPreview from '@components/textbookReader';
import MindmapView from '@components/mindmapView';

/**
 * this is a prototype page that combines the reader and the mindmap
 * - it should allow for selecting a node on the textbook side to focus on the same node on the mindmap side
 */

export const SummaryPage = (): ReactElement => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { selectedFocus, updateFocus } = useSelectedFocus();

  return (
    <>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'end',
            gap: '0.5rem',
            top: rem('15px'),
            left: rem('15px'),
          }}
        >
          <Select
            label="Select a Focus"
            placeholder="all notes"
            value={selectedFocus}
            data={[
              { label: 'all notes', value: 'main' },
              { label: 'white labeling', value: 'WhiteLabel' },
            ]}
            onChange={(value) => {
              if (value) updateFocus(value);
            }}
          />
          <Box>
            <Button variant="subtle" onClick={() => navigate('/debugger')}>
              go to debugger
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              login
            </Button>
          </Box>
        </div>
        <div
          style={{
            width: '50%',
            marginTop: '80px',
            padding: rem(theme.spacing.md),
          }}
        >
          <TextbookReaderPreview />
        </div>
        <div
          style={{
            width: '50%',
            padding: rem(theme.spacing.md),
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: '100vh',
          }}
        >
          <MindmapView />
        </div>
      </div>
    </>
  );
};
