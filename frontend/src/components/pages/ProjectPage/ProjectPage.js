import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../base/MainLayout';
import FullPageLoadSpinner from '../../base/FullPageLoadSpinner';
import { Box, Button, Flex } from '@chakra-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import ProjectMemberSelect from './ProjectMemberSelect';
import PeriodDateRangePicker from './PeriodDateRangePicker';
import moment from 'moment';
import ProjectPageInfo from './ProjectPageInfo';
import ProjectPageNoInfo from './ProjectPageNoInfo';
import { isMemberPrivileged } from '../../../utils';

moment.locale('es');

const projectsEndpoint = process.env.REACT_APP_BACKEND_URL + '/projects';
const requestProjectInfo = (projectId) =>
  axios.get(`${projectsEndpoint}/${projectId}`, { withCredentials: true });
const requestProjectSessions = (
  projectId,
  startDate,
  endDate,
  memberIds = [],
) =>
  axios.get(`${projectsEndpoint}/${projectId}/sessions`, {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate,
    },
  });

const requestProjectMembers = (projectId) =>
  axios.get(`${projectsEndpoint}/${projectId}/members`, {
    withCredentials: true,
  });

const projectStatisticsEndpoint =
  process.env.REACT_APP_BACKEND_URL + '/data_query/summary_statistics';
const requestProjectStatistics = (
  projectId,
  startDate,
  endDate,
  memberIds = [],
) =>
  axios.get(`${projectStatisticsEndpoint}/${projectId}`, {
    withCredentials: true,
    params: {
      memberIds,
      startDate,
      endDate,
    },
  });

const projectStatisticsHistoryEndpoint =
  process.env.REACT_APP_BACKEND_URL + '/data_query/history_statistics';
const requestProjectHistory = (projectId, startDate, endDate, memberId) =>
  axios.get(`${projectStatisticsHistoryEndpoint}/${projectId}`, {
    withCredentials: true,
    params: {
      memberId,
      startDate,
      endDate,
    },
  });

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
          variantColor="gray"
          variant="ghost"
          size="lg"
          onClick={() => history.push('/')}
        >
          {projectInfo.name}
        </Button>
        {isMemberPrivileged(projectInfo.projectMember) && (
          <Button
            rightIcon="settings"
            variantColor="gray"
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

  useEffect(() => {
    requestProjectInfo(projectId).then((res) => {
      setProjectInfo(res.data);
    });

    requestProjectMembers(projectId).then((res) => {
      setProjectMembers(res.data);
    });
  }, [projectId]);

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
