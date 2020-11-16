import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../base/MainLayout';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';
import ProjectMemberSelect from './ProjectMemberSelect';
import PeriodDateRangePicker from './PeriodDateRangePicker';
import moment from 'moment';
import ProjectPageInfo from './ProjectPageInfo';
import ProjectPageNoInfo from './ProjectPageNoInfo';
import { formatTitle, isMemberPrivileged } from '../../../utils';
import useDocumentTitle from '../../../hooks/documentTitleHook';
import { useToasts } from 'react-toast-notifications';

moment.locale('es');

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + "/projects"; // prettier-ignore
const projectStatisticsEndpoint = process.env.REACT_APP_BACKEND_URL + "/data_query/summary_statistics"; // prettier-ignore
const projectStatisticsHistoryEndpoint = process.env.REACT_APP_BACKEND_URL + "/data_query/history_statistics"; // prettier-ignore

const requestProjectInfo = (projectId) => axios.get(
  `${projectsEndpoint}/${projectId}`,
  { withCredentials: true }
); // prettier-ignore

const requestProjectSessions = (projectId, startDate, endDate, memberIds = []) => axios.get(
  `${projectsEndpoint}/${projectId}/sessions`,
  {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate
    }
  }
); // prettier-ignore

const requestProjectMembers = (projectId) => axios.get(
  `${projectsEndpoint}/${projectId}/members`,
  { withCredentials: true }
); // prettier-ignore

const requestProjectStatistics = (projectId, startDate, endDate, memberIds = []) => axios.get(
  `${projectStatisticsEndpoint}/${projectId}`,
  {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate
    }
  }
); // prettier-ignore

const requestProjectHistory = (projectId, startDate, endDate, memberId) => axios.get(
  `${projectStatisticsHistoryEndpoint}/${projectId}`,
  {
    withCredentials: true,
    params: {
      memberId,
      startDate,
      endDate
    }
  }
); // prettier-ignore

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
          leftIcon="arrow-back"
          colorScheme="gray"
          variant="ghost"
          boxSize="lg"
          whiteSpace="pre"
          onClick={() => history.push('/')}
        >
          {projectInfo.name}
        </Button>
        {isMemberPrivileged(projectInfo.projectMember) && (
          <Button
            rightIcon="settings"
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

  // prettier-ignore
  useDocumentTitle(formatTitle("Proyecto " + (projectInfo ? projectInfo.name : "")));

  useEffect(() => {
    Promise.all([
      requestProjectInfo(projectId).then((res) => {
        setProjectInfo(res.data);
      }),
      requestProjectMembers(projectId).then((res) => {
        setProjectMembers(res.data);
      }),
    ]).catch((err) => {
      if (err.response && err.response.data.error) {
        if (err.response.data.error.type === 'RESOURCE_NOT_FOUND') {
          addToast(`No se ha podido encontrar el proyecto que has pedido`, {
            appearance: 'error',
            autoDismiss: true,
          });

          history.push('/');
        }
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
