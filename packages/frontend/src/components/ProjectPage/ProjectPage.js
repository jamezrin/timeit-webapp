import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';
import { ArrowBackIcon, SettingsIcon } from '@chakra-ui/icons';
import moment from 'moment';
import ProjectMemberSelect from './ProjectMemberSelect';
import PeriodDateRangePicker from './PeriodDateRangePicker';
import ProjectPageInfo from './ProjectPageInfo';
import ProjectPageNoInfo from './ProjectPageNoInfo';
import MainLayout from '../MainLayout';
import FullPageLoadSpinner from '../FullPageLoadSpinner';
import { formatTitle, isMemberPrivileged, isResponseError } from '../../utils';
import useDocumentTitle from '../../hooks/documentTitleHook';
import { useToasts } from 'react-toast-notifications';
import { RESOURCE_NOT_FOUND_ERROR } from '@timeit/common';
import {
  requestProjectHistory,
  requestProjectInfo,
  requestProjectMembers,
  requestProjectSessions,
  requestProjectStatistics,
} from '../../api';

moment.locale('es');

function ProjectPageContent({ projectInfo, projectMembers }) {
  const history = useHistory();

  const [startDate, setStartDate] = useState(moment().set('date', 1));
  const [endDate, setEndDate] = useState(moment());

  const [projectStats, setProjectStats] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [projectHistoryStats, setProjectHistoryStats] = useState(null);

  const [selectedProjectMembers, setSelectedProjectMembers] = useState(null);

  // When any of the filters change, refresh statistics and sessions
  useEffect(() => {
    if (
      selectedProjectMembers &&
      selectedProjectMembers.length > 0 &&
      startDate &&
      endDate
    ) {
      requestProjectStatistics(
        projectInfo.id,
        startDate,
        endDate,
        selectedProjectMembers,
      ).then((res) => {
        setProjectStats(res.data);
      });

      requestProjectSessions(
        projectInfo.id,
        startDate,
        endDate,
        selectedProjectMembers,
      ).then((res) => {
        setSessions(res.data);
      });

      Promise.all(
        selectedProjectMembers.map((memberId) =>
          requestProjectHistory(
            projectInfo.id,
            startDate,
            endDate,
            memberId,
          ).then((res) => ({
            memberId,
            data: res.data,
          })),
        ),
      ).then((projectHistoryStats) => {
        setProjectHistoryStats(projectHistoryStats);
      });
    } else {
      setProjectStats(null);
      setSessions(null);
    }
  }, [projectInfo, selectedProjectMembers, startDate, endDate]);

  return (
    <Box py={10} mx={8}>
      <Flex mb={12}>
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="gray"
          variant="ghost"
          whiteSpace="pre"
          onClick={() => history.push('/')}
        >
          {projectInfo.name}
        </Button>
        {isMemberPrivileged(projectInfo.projectMember) && (
          <Button
            rightIcon={<SettingsIcon />}
            colorScheme="gray"
            variant="ghost"
            ml="auto"
            onClick={() => history.push(`/project/${projectInfo.id}/settings`)}
          >
            Ajustes
          </Button>
        )}
      </Flex>

      <Box mx={8}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'start', md: 'center' }}
        >
          <Box minWidth="20rem" maxWidth="30rem">
            <ProjectMemberSelect
              projectInfo={projectInfo}
              projectMembers={projectMembers}
              onSelectedMemberChange={(selectedProjectMembers) => {
                setSelectedProjectMembers(selectedProjectMembers);
              }}
            />
          </Box>
          <Box ml={{ md: 'auto' }} mt={{ base: '2rem', md: '0' }}>
            <PeriodDateRangePicker
              startDate={startDate}
              endDate={endDate}
              projectInfo={projectInfo}
              onDatesChange={({ startDate, endDate }) => {
                setStartDate(startDate);
                setEndDate(endDate);
              }}
            />
          </Box>
        </Flex>

        {selectedProjectMembers && selectedProjectMembers.length > 0 ? (
          <ProjectPageInfo
            projectInfo={projectInfo}
            projectMembers={projectMembers}
            projectStats={projectStats}
            projectHistoryStats={projectHistoryStats}
            sessions={sessions}
            startDate={startDate}
            endDate={endDate}
          />
        ) : (
          <ProjectPageNoInfo />
        )}
      </Box>
    </Box>
  );
}

function ProjectPage() {
  const [projectInfo, setProjectInfo] = useState(null);
  const [projectMembers, setProjectMembers] = useState(null);
  const { projectId } = useParams();
  const { addToast } = useToasts();
  const history = useHistory();

  useDocumentTitle(formatTitle(`Proyecto ${projectInfo?.name || 'Desconocido'}`)); // prettier-ignore

  useEffect(() => {
    Promise.all([
      requestProjectInfo(projectId).then((res) => {
        setProjectInfo(res.data);
      }),
      requestProjectMembers(projectId).then((res) => {
        setProjectMembers(res.data);
      }),
    ]).catch((err) => {
      if (isResponseError(err, RESOURCE_NOT_FOUND_ERROR)) {
        addToast(`No se ha podido encontrar el proyecto que has pedido`, {
          appearance: 'error',
          autoDismiss: true,
        });

        history.push('/');
      } else {
        addToast(`Ha ocurrido un error desconocido: ${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    });
  }, [history, addToast, projectId]);

  return (
    <MainLayout>
      {projectInfo && projectMembers ? (
        <ProjectPageContent
          projectInfo={projectInfo}
          projectMembers={projectMembers}
        />
      ) : (
        <FullPageLoadSpinner message="Cargando el proyecto actual" />
      )}
    </MainLayout>
  );
}

export default ProjectPage;
