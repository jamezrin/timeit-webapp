import React, { useMemo, useRef } from 'react';
import { List, ListItem, Box, PseudoBox, useColorMode } from '@chakra-ui/core';
import { Link, useHistory } from 'react-router-dom';
import BaseTable, { Column } from 'react-base-table';
import 'react-base-table/styles.css';
import moment from 'moment';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { parseAndFormatDate } from '../../../utils';
import useElementDimensions from '../../../hooks/elementDimensionsHook';

const TableWrapper = styled.div`
  flex-grow: 1;

  .BaseTable__row {
    cursor: pointer;
  }
`;

function ProjectSessionList({ projectInfo, projectMembers, sessions }) {
  const { colorMode } = useColorMode();
  const history = useHistory();

  const data = useMemo(() => {
    if (!sessions) return [];
    return sessions.map((event) => {
      const projectMember = projectMembers.find(
        (member) => member.id === event.projectMemberId,
      );

      return {
        keyId: event.id,
        keyCreationDate: parseAndFormatDate(event.createdAt),
        keyUpdateDate: parseAndFormatDate(event.updatedAt),
        keyEndDate: event.endedAt
          ? parseAndFormatDate(event.endedAt)
          : 'En curso',
        keyUser:
          projectMember.user.firstName + ' ' + projectMember.user.lastName,
      };
    });
  }, [sessions, projectMembers]);

  const rowEventHandlers = {
    onClick: (event) => {
      history.push(`/project/${projectInfo.id}/session/${event.rowData.keyId}`);
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
          dataKey="keyId"
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
