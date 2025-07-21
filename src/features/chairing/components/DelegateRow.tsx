import { DelegateDoc } from '@features/types';
import { Group, Paper, Select, Text } from '@mantine/core';
import { ReactElement, useState } from 'react';

type Props = {
  delegate: DelegateDoc;
};

export const DelegateRow = ({ delegate }: Props): ReactElement => {
  //   const handleStatusChange = async (value: string | null) => {
  //   if (!value) return;

  //   const newStatus = value as AttendanceStatus;

  //   await addDelegateToCommittee(
  //     committeeId,
  //     delegate.delegateId,
  //     delegate.name,
  //     delegate.email,
  //     delegate.inviteStatus,
  //     delegate.minutes,
  //     delegate.positionPaperSent,
  //     newStatus,
  //     delegate.spoke,
  //   );
  // };

  const statusColors = {
    absent: '#ffc6c7',
    excused: '#ffeeb9',
    present: '#ccffb8',
  };

  const [status, setStatus] = useState<string | null>(delegateATTENDANCE STATUS GANG);

  const color = status ? statusColors[status as keyof typeof statusColors] : 'gray';

  return (
    <Paper bg={color} p={'sm'} radius={'0'}>
      <Group>
        <Text flex={1}>{delegate.name}</Text>
        <Select
          data={['absent', 'excused', 'present']}
          value={status}
          onChange={setStatus}
          allowDeselect={false}
        />
      </Group>
    </Paper>
  );
};

// TODO: SHIFT CLICK TO MULTISELECT WOULD BE NICE
// import React, { useState } from 'react';

// type RowType = {
//   id: string;
//   label: string;
// };

// type Props = {
//   rows: RowType[];
// };

// export function SelectableRows({ rows }: Props) {
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

//   const handleRowClick = (e: React.MouseEvent, index: number, id: string) => {
//     if (e.shiftKey && lastSelectedIndex !== null) {
//       const start = Math.min(lastSelectedIndex, index);
//       const end = Math.max(lastSelectedIndex, index);
//       const idsInRange = rows.slice(start, end + 1).map((row) => row.id);
//       const newSelected = Array.from(new Set([...selectedIds, ...idsInRange]));
//       setSelectedIds(newSelected);
//     } else {
//       if (selectedIds.includes(id)) {
//         setSelectedIds(selectedIds.filter((sid) => sid !== id));
//       } else {
//         setSelectedIds([...selectedIds, id]);
//       }
//       setLastSelectedIndex(index);
//     }
//   };

//   return (
//     <div>
//       {rows.map((row, i) => (
//         <div
//           key={row.id}
//           onClick={(e) => handleRowClick(e, i, row.id)}
//           style={{
//             cursor: 'pointer',
//             backgroundColor: selectedIds.includes(row.id) ? '#cce5ff' : undefined,
//             padding: '8px',
//             marginBottom: '4px',
//             borderRadius: '4px',
//             userSelect: 'none',
//           }}
//         >
//           {row.label}
//         </div>
//       ))}
//     </div>
//   );
// }
