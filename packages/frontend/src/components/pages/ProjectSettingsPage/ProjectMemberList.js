import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';
import BaseTable, { AutoResizer, Column } from 'react-base-table';
import { formatUserFullName, parseAndFormatDate } from '../../../utils';

const projectMembersEndpoint = process.env.REACT_APP_BACKEND_URL + '/project_members'; // prettier-ignore

const requestMemberKick = (memberId) => axios.post(
  `${projectMembersEndpoint}/${memberId}/kick`,
  {},
  { withCredentials: true },
); //prettier-ignore

const requestMemberPromote = (memberId) => axios.post(
  `${projectMembersEndpoint}/${memberId}/promote`,
  {},
  { withCredentials: true },
); // prettier-ignore

const requestMemberDemote = (memberId) => axios.post(
  `${projectMembersEndpoint}/${memberId}/demote`,
  {},
  { withCredentials: true },
); // prettier-ignore

function ProjectMemberList({ projectInfo, projectMembers, updateMembers }) {
  const { colorMode } = useColorMode();
  const { addToast } = useToasts();

  const promoteMember = useCallback(
    (memberInfo) => {
      requestMemberPromote(memberInfo.id).then(() => {
        updateMembers();

        addToast(
          `Has ascendido al miembro ${formatUserFullName(memberInfo.user)}`,
          { appearance: 'success', autoDismiss: true },
        );
      });
    },
    [addToast, updateMembers],
  );

  const demoteMember = useCallback(
    (memberInfo) => {
      requestMemberDemote(memberInfo.id).then(() => {
        updateMembers();

        addToast(
          `Has degradado al miembro ${formatUserFullName(memberInfo.user)}`,
          { appearance: 'success', autoDismiss: true },
        );
      });
    },
    [addToast, updateMembers],
  );

  const kickMember = useCallback(
    (memberInfo) => {
      const confirmResponse = window.confirm(
        '¿Está seguro de que quiere expulsar a este miembro? ' +
          'Se borrarán todos los eventos e información almacenada.',
      );

      if (confirmResponse) {
        requestMemberKick(memberInfo.id).then(() => {
          updateMembers();

          addToast(
            `Has expulsado al miembro ${formatUserFullName(memberInfo.user)}`,
            { appearance: 'success', autoDismiss: true },
          );
        });
      }
    },
    [addToast, updateMembers],
  );

  useEffect(() => {
    updateMembers();
  }, [addToast, projectInfo, updateMembers]);

  const data = useMemo(() => {
    if (!projectMembers) return [];

    return projectMembers.map((member) => ({
      id: member.id,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      role: member.role,
      status: member.status,
      joinDate: parseAndFormatDate(member.createdAt),
      emailAddress: member.user.emailAddress,
      actions: (
        <>
          <IconButton
            ml={1}
            boxSize="xs"
            variant="outline"
            colorScheme="blue"
            aria-label="Search database"
            disabled={member.role === 'admin'}
            icon={member.role === 'employee' ? 'triangle-up' : 'triangle-down'}
            onClick={() =>
              member.role === 'employee'
                ? promoteMember(member)
                : demoteMember(member)
            }
          />
          <IconButton
            ml={1}
            boxSize="xs"
            variant="outline"
            colorScheme="blue"
            aria-label="Search database"
            disabled={member.role === 'admin'}
            icon="not-allowed"
            onClick={() => kickMember(member)}
          />
        </>
      ),
    }));
  }, [demoteMember, kickMember, projectMembers, promoteMember]);

  return (
    <Flex
      p={4}
      flex={1}
      rounded="md"
      direction="column"
      bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
    >
      <Heading as="h2" boxSize="md">
        Miembros del proyecto
      </Heading>

      <Divider />

      <Box flex={1}>
        <AutoResizer>
          {({ width, height }) => (
            <BaseTable
              fixed={width < 700}
              width={width}
              height={height}
              data={data}
              headerHeight={30}
            >
              <Column
                key="keyId"
                dataKey="id"
                title="Id"
                resizable={true}
                width={50}
              />
              <Column
                key="keyFirstName"
                dataKey="firstName"
                title="Nombre"
                resizable={true}
                width={80}
              />
              <Column
                key="keyLastName"
                dataKey="lastName"
                title="Apellidos"
                resizable={true}
                width={120}
              />
              <Column
                key="keyRole"
                dataKey="role"
                title="Rol"
                resizable={true}
                width={100}
              />
              <Column
                key="keyStatus"
                dataKey="status"
                title="Estado"
                resizable={true}
                width={75}
              />
              <Column
                key="keyDate"
                dataKey="joinDate"
                title="Fecha entrada"
                resizable={true}
                width={120}
              />
              <Column
                key="keyEmailAddress"
                dataKey="emailAddress"
                title="Correo"
                resizable={true}
                width={275}
              />
              <Column
                key="keyActions"
                dataKey="actions"
                title="Acciones"
                resizable={true}
                width={120}
              />
            </BaseTable>
          )}
        </AutoResizer>
      </Box>
    </Flex>
  );
}

export default ProjectMemberList;
