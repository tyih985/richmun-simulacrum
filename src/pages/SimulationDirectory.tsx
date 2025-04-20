import { ReactElement } from 'react';
import { Title, Text } from '@mantine/core';
import { AgGridReact } from 'ag-grid-react';

import { useSimulationReferences } from '@hooks/useSimulationRefs';
import { useSession } from '@hooks/useSession';

export const SimulationDirectory = (): ReactElement => {
  const { sessionUser } = useSession();
  const { all: simulations } = useSimulationReferences(sessionUser?.uid || '', {
    enabled: !!sessionUser,
  });

  return (
    <div>
      <Title order={1}>Simulation Directory</Title>
      <Text>hello world</Text>
      {simulations.isLoading && <div>Loading...</div>}
      {simulations.isSuccess && (
        <div style={{ width: '100%', height: 'calc(100vh - 10rem)' }}>
          <AgGridReact
            rowData={MockData}
            columnDefs={[
              {
                field: 'shortName',
                flex: 2,
              },
              {
                field: 'participatingAs',
                flex: 1,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

const MockData = [
  {
    participatingAs: 'delegete',
    shortName: 'UNSC 2024',
    longName: 'United Nations Security Council 2024',
    dates: {
      start: new Date('2024-01-01').toISOString(),
      end: new Date('2024-01-03').toISOString(),
    },
    description: 'A mock security council simulation',
    supportEmail: 'support@example.com',
    archived: false,
  },
  {
    participatingAs: 'staff',
    shortName: 'UNHRC 2024',
    longName: 'UN Human Rights Council 2024',
    dates: {
      start: new Date('2024-02-01').toISOString(),
      end: new Date('2024-02-03').toISOString(),
    },
    description: 'A mock human rights council simulation',
    supportEmail: 'support@example.com',
    archived: false,
  },
];

/**
 * Need to create a new section wrapper that can
 * - simplify the fixed div size around the AgGrid
 * - determine and lock-in the height before rendering the grid... 
 * - standardize the grid theme when on dark mode
 */
