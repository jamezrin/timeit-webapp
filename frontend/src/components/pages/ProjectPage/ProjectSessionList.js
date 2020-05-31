import React, { useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import BaseTable, { Column } from 'react-base-table';
import 'react-base-table/styles.css';
import styled from '@emotion/styled';
import {
  findProjectMember,
  formatUserFullName,
  parseAndFormatTimestamp,
} from '../../../utils';
import useElementDimensions from '../../../hooks/elementDimensionsHook';

const TableWrapper = styled.div`
  flex-grow: 1;

  .BaseTable__row {
    cursor: pointer;
  }
`;

function ProjectSessionList({ projectInfo, projectMembers, sessions }) {
  const history = useHistory();

  const data = useMemo(() => {
    if (!sessions) return [];
    return sessions.map((session) => {
      const projectMember = findProjectMember(
        projectMembers,
        session.projectMemberId,
      );

      return {
        id: session.id,
        keyCreationDate: parseAndFormatTimestamp(session.createdAt),
        keyUpdateDate: parseAndFormatTimestamp(session.updatedAt),
        keyUser: formatUserFullName(projectMember.user),
        keyEndDate: session.endedAt
          ? parseAndFormatTimestamp(session.endedAt)
          : 'En curso',
      };
    });
  }, [sessions, projectMembers]);

  const rowEventHandlers = {
    onClick: (event) => {
      history.push(`/project/${projectInfo.id}/session/${event.rowData.id}`);
    },
  };

  const tableWrapperRef = useRef();
  const tableWrapperDims = useElementDimensions(tableWrapperRef);

  return (
    <TableWrapper ref={tableWrapperRef}>
      <BaseTable
        data={data}
        height={400}
        rowEventHandlers={rowEventHandlers}
        width={tableWrapperDims.width}
      >
        <Column
          key="keyId"
          dataKey="id"
          title="Id"
          resizable={true}
          width={100}
        />
        <Column
          key="keyCreationDate"
          dataKey="keyCreationDate"
          title="Creación"
          resizable={true}
          width={200}
        />
        <Column
          key="keyUpdateDate"
          dataKey="keyUpdateDate"
          title="Actualización"
          resizable={true}
          width={200}
        />
        <Column
          key="keyEndDate"
          dataKey="keyEndDate"
          title="Finalización"
          resizable={true}
          width={200}
        />
        <Column
          key="keyUser"
          dataKey="keyUser"
          title="Usuario"
          resizable={false}
          width={300}
        />
      </BaseTable>
    </TableWrapper>
  );
}

export default ProjectSessionList;
